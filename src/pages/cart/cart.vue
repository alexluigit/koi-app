<template>
  <scroll-view enable-back-to-top scroll-y class="scroll-view" @scrolltolower="onScrolltolower">
    <!-- logged in -->
    <template v-if="userStore.profile">
      <view v-if="isShowingCart" class="cart-list">
        <view class="tips">
          <text class="label">
            年终特惠
          </text>
          <text class="desc">
            满2件享9折优惠
          </text>
        </view>
        <uni-swipe-action>
          <uni-swipe-action-item v-for="item in cartItems" :key="item.skuId" class="cart-swipe">
            <view class="goods">
              <text
                class="checkbox"
                :class="{ checked: item.selected }"
                @tap="changeSelected(item)"
              />
              <navigator
                :url="`/pages/product/product?id=${item.id}`"
                hover-class="none"
                class="navigator"
              >
                <image mode="aspectFill" class="picture" :src="item.picture" />
                <view class="meta">
                  <view class="name ellipsis">
                    {{ item.name }}
                  </view>
                  <view class="attrs-text ellipsis">
                    {{ item.attrsText }}
                  </view>
                  <view class="price">
                    {{ item.nowPrice }}
                  </view>
                </view>
              </navigator>
              <view class="count">
                <nut-input-number
                  v-model="item.count"
                  min="1"
                  :max="item.stock"
                  @change="changeCount"
                />
              </view>
            </view>
            <template #right>
              <view class="cart-swipe-right">
                <button class="button delete-button" @tap="deleteCartItem(item.skuId)">
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- empty cart -->
      <view v-else class="cart-blank">
        <image src="/static/images/empty_cart.png" class="image" />
        <text class="text">
          购物车还是空的，快来挑选好货吧
        </text>
        <navigator url="/pages/home/home" hover-class="none" open-type="switchTab">
          <button class="button">
            去首页看看
          </button>
        </navigator>
      </view>
      <!-- toolbar -->
      <view v-if="isShowingCart" class="toolbar">
        <text class="all" :class="{ checked: isSelectedAll }" @tap="changeSelectedAll">
          全选
        </text>
        <text class="text">
          合计:
        </text>
        <text class="amount">
          {{ totalPrice }}
        </text>
        <view class="button-grounp">
          <view
            class="button payment-button"
            :class="{ disabled: totalCount === 0 }"
            @tap="gotoPayment"
          >
            去结算({{ totalCount }})
          </view>
        </view>
      </view>
    </template>
    <!-- logged out -->
    <view v-else class="login-blank">
      <text class="text">
        登录后可查看购物车中的商品
      </text>
      <navigator url="/pages/account/login" hover-class="none">
        <button class="button">
          去登录
        </button>
      </navigator>
    </view>
    <!-- guess like -->
    <!-- todo -->
    <!-- place holder -->
    <view class="toolbar-height" />
  </scroll-view>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types/cart';
import * as CartAPI from '@/api/cart';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const cartItems = ref<CartItem[]>([]);
const isShowingCart = ref(true);
const requestCartItems = async () => {
  const res = await CartAPI.getCartItems();
  cartItems.value = res;
  isShowingCart.value = res.length > 0;
};

onShow(() => userStore.profile
  && requestCartItems());

const deleteCartItem = (skuId: string) => {
  uni.showModal({
    content: '是否删除',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await CartAPI.deleteCartItems({ ids: [skuId] });
        requestCartItems();
      }
    },
  });
};

// TODO: use watch() to monitor the count change, then fire up the api request
// updateCartItemBySkuId(ev.index, { count: ev.value })
const changeCount = (count, event) => {
  console.log(count, event);
};

const changeSelected = async (item: CartItem) => {
  item.selected = !item.selected;
  await CartAPI.updateCartItemBySkuId(item.skuId, { selected: item.selected });
};

// TODO: use watch here
const isSelectedAll = computed(() =>
  cartItems.value.length && cartItems.value.every(v => v.selected));

// TODO: use watch here
const changeSelectedAll = () => {
  const _isSelectedAll = !isSelectedAll.value;
  cartItems.value.forEach((item) => {
    item.selected = _isSelectedAll;
  });
  CartAPI.updateCartAllSelected({ selected: _isSelectedAll });
};

const selectedCartItems = computed(() => cartItems.value.filter(v => v.selected));

const totalCount = computed(() =>
  selectedCartItems.value.reduce((sum, item) => sum + item.count, 0));

const totalPrice = computed(() =>
  selectedCartItems.value.reduce((sum, item) => sum + item.count * item.nowPrice, 0).toFixed(2));

const gotoPayment = () => {
  if (totalCount.value === 0)
    return uni.showToast({ icon: 'none', title: '请选择商品' });
  uni.navigateTo({ url: '/pages/order/create' });
};
</script>

<style lang="scss">
// 根元素
:host {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
  background-color: #f7f7f8;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #666;

    .label {
      padding: 7rpx 15rpx 5rpx;
      margin-right: 10rpx;
      font-size: 24rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 4rpx;
    }
  }

  // 购物车商品
  .goods {
    position: relative;
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    background-color: #fff;
    border-radius: 10rpx;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        font-family: koi !important;
        font-size: 40rpx;
        color: #444;
        content: '\e6cd';
      }

      &.checked::before {
        color: #27ba9b;
        content: '\e6cc';
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs-text {
      align-self: flex-start;
      padding: 0 15rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #888;
      background-color: #f7f7f8;
      border-radius: 4rpx;
    }

    .price {
      margin-bottom: 2rpx;
      font-size: 26rpx;
      line-height: 1;
      color: #cf4444;

      &::before {
        font-size: 80%;
        content: '￥';
      }
    }

    // 商品数量
    .count {
      position: absolute;
      right: 5rpx;
      bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        font-size: 24rpx;
        color: #444;
        text-align: center;
        background-color: #f6f6f6;
        border-radius: 4rpx;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      padding: 6px;
      font-size: 26rpx;
      line-height: 1.5;
      color: #fff;
      border-radius: 0;
    }

    .delete-button {
      background-color: #cf4444;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .image {
    width: 300rpx;
    height: 300rpx;
  }

  .text {
    margin: 20rpx 0;
    font-size: 26rpx;
    color: #444;
  }

  .button {
    width: 240rpx !important;
    height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    line-height: 60rpx;
    color: #fff;
    background-color: #27ba9b;
    border-radius: 60rpx;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  right: 0;
  bottom: calc(var(--window-bottom));
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;

  .all {
    display: flex;
    align-items: center;
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
  }

  .all::before {
    margin-right: 8rpx;
    font-family: koi !important;
    font-size: 40rpx;
    content: '\e6cd';
  }

  .checked::before {
    color: #27ba9b;
    content: '\e6cc';
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    font-size: 14px;
    color: #444;
  }

  .amount {
    font-size: 20px;
    color: #cf4444;

    .decimal {
      font-size: 12px;
    }

    &::before {
      font-size: 12px;
      content: '￥';
    }
  }

  .button-grounp {
    display: flex;
    justify-content: space-between;
    margin-left: auto;
    font-size: 13px;
    line-height: 72rpx;
    color: #fff;
    text-align: center;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
