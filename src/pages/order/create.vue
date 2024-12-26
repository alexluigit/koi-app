<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator
      v-if="selecteAddress"
      class="shipment"
      hover-class="none"
      url="/pages/account/address?from=order"
    >
      <view class="user">
        {{ selecteAddress.receiver }} {{ selecteAddress.contact }}
      </view>
      <view class="address">
        {{ selecteAddress.fullLocation }} {{ selecteAddress.address }}
      </view>
      <text class="icon icon-right" />
    </navigator>
    <navigator
      v-else
      class="shipment"
      hover-class="none"
      url="/pages/account/address?from=order"
    >
      <view class="address">
        请选择收货地址
      </view>
      <text class="icon icon-right" />
    </navigator>

    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="item in orderPre?.goods"
        :key="item.skuId"
        :url="`/pages/product/product?id=${item.id}`"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="item.picture" />
        <view class="meta">
          <view class="name ellipsis">
            {{ item.name }}
          </view>
          <view class="attrs">
            {{ item.attrsText }}
          </view>
          <view class="prices">
            <view class="pay-price symbol">
              {{ item.payPrice }}
            </view>
            <view class="price symbol">
              {{ item.price }}
            </view>
          </view>
          <view class="count">
            x{{ item.count }}
          </view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">
          配送时间
        </text>
        <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
          <view class="icon-fonts picker">
            {{ activeDelivery.text }}
          </view>
        </picker>
      </view>
      <view class="item">
        <text class="text">
          订单备注
        </text>
        <input
          v-model="buyerMessage"
          class="input"
          :cursor-spacing="30"
          placeholder="选题，建议留言前先与商家沟通确认"
        >
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">
          商品总价:
        </text>
        <text class="number symbol">
          {{ orderPre?.summary.totalPrice.toFixed(2) }}
        </text>
      </view>
      <view class="item">
        <text class="text">
          运费:
        </text>
        <text class="number symbol">
          {{ orderPre?.summary.postFee.toFixed(2) }}
        </text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" :style="{ paddingBottom: `${safeAreaInsets?.bottom}px` }">
    <view class="total-pay symbol">
      <text class="number">
        {{ orderPre?.summary.totalPayPrice.toFixed(2) }}
      </text>
    </view>
    <view class="button" :class="{ disabled: !selecteAddress?.id }" @tap="onOrderSubmit">
      提交订单
    </view>
  </view>
</template>

<script setup lang="ts">
import type { BillingInfo } from '@/types/order';
import {
  createOrder,
  getBillingInfo,
  getCartBillingInfo,
  getRepurchaseBillingInfo,
} from '@/api/order';
import { useAddressStore } from '@/store/modules/address';

// 页面参数
const query = defineProps<{
  skuId?: string;
  count?: string;
  orderId?: string;
}>();
const { safeAreaInsets } = uni.getWindowInfo();
const buyerMessage = ref('');
// 配送时间
const deliveryList = ref([
  { type: 1, text: '时间不限 (周一至周日)' },
  { type: 2, text: '工作日送 (周一至周五)' },
  { type: 3, text: '周末配送 (周六至周日)' },
]);
// 当前配送时间下标
const activeIndex = ref(0);
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value]);
// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
  activeIndex.value = ev.detail.value;
};

// 获取订单信息
const orderPre = ref<BillingInfo>();
const requestBillingInfo = async () => {
  if (query.count && query.skuId) {
    orderPre.value = await getBillingInfo({
      count: query.count,
      skuId: query.skuId,
    });
  }
  else if (query.orderId) {
    orderPre.value = await getRepurchaseBillingInfo(query.orderId);
  }
  else { // from cart
    orderPre.value = await getCartBillingInfo();
  }
};

onLoad(() => requestBillingInfo());

const addressStore = useAddressStore();
// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress || orderPre.value?.userAddresses.find(v => v.isDefault);
});

// 提交订单
const onOrderSubmit = async () => {
  // 没有收货地址提醒
  if (!selecteAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' });
  }
  // 发送请求
  const res = await createOrder({
    addressId: selecteAddress.value?.id,
    buyerMessage: buyerMessage.value,
    deliveryTimeType: activeDelivery.value.type,
    goods: orderPre.value!.goods.map(v => ({ count: v.count, skuId: v.skuId })),
    payChannel: 2,
    payType: 1,
  });
  // 关闭当前页面，跳转到订单详情，传递订单id
  uni.redirectTo({ url: `/pages/order/detail?id=${res.id}` });
};
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  margin-right: 5rpx;
  font-size: 80%;
  content: '¥';
}

.shipment {
  position: relative;
  padding: 30rpx 30rpx 30rpx 84rpx;
  margin: 20rpx;
  font-size: 26rpx;
  background: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png")
    20rpx center / 50rpx no-repeat #fff;
  border-radius: 10rpx;

  .icon {
    position: absolute;
    top: 50%;
    right: 20rpx;
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
  }

  .user {
    margin-bottom: 5rpx;
    color: #333;
  }

  .address {
    color: #666;
  }
}

.goods {
  padding: 0 20rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
    }

    .meta {
      position: relative;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs {
      align-self: flex-start;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #888;
      background-color: #f7f7f8;
      border-radius: 4rpx;
    }

    .prices {
      display: flex;
      align-items: baseline;
      margin-top: 6rpx;
      font-size: 28rpx;

      .pay-price {
        margin-right: 10rpx;
        color: #cf4444;
      }

      .price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }

    .count {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 26rpx;
      color: #444;
    }
  }
}

.related {
  padding: 0 20rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    padding-right: 20rpx;
    margin: 20rpx 0;
    font-size: 26rpx;
    color: #999;
    text-align: right;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: '\e6c2';
  }
}

/* 结算清单 */
.settlement {
  padding: 0 20rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}

/* 吸底工具栏 */
.toolbar {
  position: fixed;
  right: 0;
  bottom: calc(var(--window-bottom));
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  padding: 0 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eaeaea;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    font-size: 26rpx;
    line-height: 72rpx;
    color: #fff;
    text-align: center;
    background-color: #27ba9b;
    border-radius: 72rpx;
  }

  .disabled {
    opacity: 0.6;
  }
}
</style>
