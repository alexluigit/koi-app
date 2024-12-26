<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y @scrolltolower="onScrolltolower">
    <!-- 订单状态 -->
    <view class="overview">
      <view class="status icon-checked">
        模拟支付成功
      </view>
      <view class="tips">
        提示: 本小程序仅为演示用途，并未实际支付或购买商品或服务
      </view>
      <view class="buttons">
        <navigator
          hover-class="none"
          class="button navigator"
          url="/pages/home/home"
          open-type="switchTab"
        >
          返回首页
        </navigator>
        <navigator
          hover-class="none"
          class="button navigator"
          :url="`/pages/order/detail?id=${query.id}`"
          open-type="redirect"
        >
          查看订单
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <!-- <XtxGuess ref="guessRef" /> -->
  </scroll-view>
</template>

<script setup lang="ts">
// import { useGuessList } from '@/composables'

// 获取页面参数
const query = defineProps<{ id: string }>();

// 猜你喜欢
// const { guessRef, onScrolltolower } = useGuessList()

// 页面加载
onLoad(() => {
  uni.showModal({
    title: '温馨提示',
    content: '此交易是模拟支付，您并未付款，不会导致实际购买商品或服务',
    confirmText: '知道了',
    showCancel: false,
  });
});
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  padding: 50rpx 0;
  line-height: 1;
  color: #fff;
  background-color: #27ba9b;

  .tips {
    width: 70%;
    margin: 60rpx auto;
    font-size: 24rpx;
    line-height: 1.5;
    text-align: center;
  }

  .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }

  .status::before {
    display: block;
    margin-bottom: 20rpx;
    font-size: 110rpx;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60rpx;
    margin-top: 60rpx;
    line-height: 60rpx;
  }

  .button {
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #fff;
    text-align: center;

    &:first-child {
      width: 200rpx;
      border: 1rpx solid #fff;
      border-radius: 64rpx;
    }
  }
}
</style>
