<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <view class="product-result">
      <view class="preview">
        <swiper circular @change="onChange">
          <swiper-item v-for="item in productResult?.mainPictures" :key="item">
            <image class="image" mode="aspectFill" :src="item" @tap="onTapImage(item)" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">
            {{ currentIndex + 1 }}
          </text>
          <text class="split">
            /
          </text>
          <text class="total">
            {{ productResult?.mainPictures.length }}
          </text>
        </view>
      </view>

      <!-- Product brief -->
      <view class="meta">
        <view class="price">
          <text class="symbol">
            ¥
          </text>
          <text class="number">
            {{ productResult?.price }}
          </text>
        </view>
        <view class="name ellipsis">
          {{ productResult?.name }}
        </view>
        <view class="desc">
          {{ productResult?.desc }}
        </view>
      </view>

      <!-- Action panel -->
      <view class="action">
        <view class="item arrow" @tap="console.log('SKU select not implement yet')">
          <text class="label">
            选择
          </text>
          <text class="text ellipsis" />
        </view>
        <view class="item arrow" @tap="openPopup('address')">
          <text class="label">
            送至
          </text>
          <text class="text ellipsis">
            请选择收获地址
          </text>
        </view>
        <view class="item arrow" @tap="openPopup('service')">
          <text class="label">
            服务
          </text>
          <text class="text ellipsis">
            免费包邮 次日达
          </text>
        </view>
      </view>
    </view>

    <!-- Product details -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <view v-for="item in productResult?.details.properties" :key="item.name" class="item">
            <text class="label">
              {{ item.name }}
            </text>
            <text class="value">
              {{ item.value }}
            </text>
          </view>
        </view>
        <image
          v-for="item in productResult?.details.pictures"
          :key="item"
          class="image"
          mode="widthFix"
          :src="item"
        />
      </view>
    </view>

    <!-- Similar suggestion -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in productResult?.similarProducts"
          :key="item.id"
          class="product-result"
          hover-class="none"
          :url="`/pages/product/product?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture" />
          <view class="name ellipsis">
            {{ item.name }}
          </view>
          <view class="price">
            <text class="symbol">
              ¥
            </text>
            <text class="number">
              {{ item.price }}
            </text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- Purchase panel -->
  <view v-if="productResult" class="toolbar" :style="{ paddingBottom: `${safeAreaInsets?.bottom}px` }">
    <view class="icons">
      <button class="icons-button">
        <text class="icon-heart" />收藏
      </button>
      <!-- #ifdef MP-WEIXIN -->
      <button class="icons-button" open-type="contact">
        <text class="icon-handset" />客服
      </button>
      <!-- #endif -->
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <text class="icon-cart" />购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="console.log('Add to cart not implement yet')">
        加入购物车
      </view>
      <view class="payment" @tap="console.log('Buy directly not implement yet')">
        立即购买
      </view>
    </view>
  </view>

  <!-- Popup -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <address-panel v-if="popupName === 'address'" @close="popup?.close()" />
    <service-panel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
</template>

<script setup lang="ts">
import type { ProductResult } from '@/types/product';
import { getProductByIdAPI } from '@/api/product';

const query = defineProps<{ id: string }>();
const { safeAreaInsets } = uni.getWindowInfo();

const productResult = ref<ProductResult>();
const getProductDetails = async () => {
  const res = await getProductByIdAPI(query.id);
  productResult.value = res;
};

onLoad(() => getProductDetails());

const currentIndex = ref(0);
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current;
};

const onTapImage = (url: string) => {
  uni.previewImage({
    current: url,
    urls: productResult.value!.mainPictures,
  });
};

const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void;
  close: () => void;
}>();

const popupName = ref<'address' | 'service'>();
const openPopup = (name: typeof popupName.value) => {
  popupName.value = name;
  popup.value?.open();
};
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;

  .title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rpx;
    padding: 30rpx 60rpx 30rpx 6rpx;
    line-height: 1;

    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      border-left: 4rpx solid #27ba9b;
    }

    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    font-family: erabbit !important;
    font-size: 32rpx;
    color: #ccc;
    content: '\e6c2';
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.product-result {
  background-color: #fff;

  .preview {
    position: relative;
    height: 750rpx;

    .image {
      width: 750rpx;
      height: 750rpx;
    }

    .indicator {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      height: 40rpx;
      padding: 0 24rpx;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 40rpx;
      color: #fff;
      background-color: rgb(0 0 0 / 30%);
      border-radius: 30rpx;

      .current {
        font-size: 26rpx;
      }

      .split {
        margin: 0 1rpx 0 2rpx;
        font-size: 24rpx;
      }

      .total {
        font-size: 24rpx;
      }
    }
  }

  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;

    .price {
      box-sizing: border-box;
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      font-size: 34rpx;
      color: #fff;
      background-color: #35c8a9;
    }

    .number {
      font-size: 56rpx;
    }

    .brand {
      position: absolute;
      top: 26rpx;
      right: 30rpx;
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
    }

    .name {
      max-height: 88rpx;
      margin: 20rpx;
      font-size: 32rpx;
      line-height: 1.4;
      color: #333;
    }

    .desc {
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      line-height: 1;
      color: #cf4444;
    }
  }

  .action {
    padding-left: 20rpx;

    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 90rpx;
      padding-right: 60rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx solid #eaeaea;

      &:last-child {
        border-bottom: 0 none;
      }
    }

    .label {
      width: 60rpx;
      margin: 0 16rpx 0 10rpx;
      color: #898b94;
    }

    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;

  .content {
    margin-left: -20rpx;

    .image {
      width: 100%;
    }
  }

  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;

    .item {
      display: flex;
      padding: 10rpx;
      font-size: 26rpx;
      line-height: 2;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }

    .label {
      width: 200rpx;
    }

    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20rpx 20rpx;
    background-color: #f4f4f4;

    .product-result {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      background-color: #fff;
      border-radius: 10rpx;
    }

    .image {
      width: 300rpx;
      height: 260rpx;
    }

    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }

    .price {
      font-size: 20rpx;
      line-height: 1;
      color: #cf4444;
    }

    .number {
      margin-left: 2rpx;
      font-size: 26rpx;
    }
  }

  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  right: 0;
  bottom: calc((var(--window-bottom)));
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

  .buttons {
    display: flex;

    & > view {
      width: 220rpx;
      font-size: 26rpx;
      line-height: 72rpx;
      color: #fff;
      text-align: center;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #ffa868;
    }

    .payment {
      margin-left: 20rpx;
      background-color: #27ba9b;
    }
  }

  .icons {
    display: flex;
    flex: 1;
    align-items: center;
    padding-right: 20rpx;
    // 兼容 H5 端和 App 端的导航链接样式
    .navigator-wrap,
    .icons-button {
      flex: 1;
      padding: 0;
      margin: 0;
      font-size: 20rpx;
      line-height: 1.4;
      color: #333;
      text-align: center;
      background-color: #fff;
      border-radius: 0;

      &::after {
        border: none;
      }
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
