<template>
  <view class="navbar" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <view class="logo">
      <image class="logo-image" src="@/static/images/logo.png" />
      <text class="logo-text">
        美好触手可及
      </text>
    </view>
    <view class="search">
      <text class="icon-search">
        搜索商品
      </text>
      <text class="icon-scan" />
    </view>
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getWindowInfo();
</script>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: url("@/static/images/navigator_bg.png");
  background-size: cover;

  .logo {
    display: flex;
    align-items: center;
    height: 60rpx;
    padding-top: 10rpx;
    padding-left: 20rpx;

    .logo-image {
      width: 200rpx;
      height: 42rpx;
    }

    .logo-text {
      flex: 1;
      padding-left: 20rpx;
      margin: 2rpx 0 0 20rpx;
      font-size: 26rpx;
      line-height: 28rpx;
      color: #fff;
      border-left: 1rpx solid #fff;
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding: 0 10rpx 0 26rpx;
    margin: 16rpx 20rpx;
    font-size: 28rpx;
    color: #fff;
    background-color: rgb(255 255 255 / 50%);
    border-radius: 32rpx;
  }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    padding: 15rpx;
    font-size: 30rpx;
  }
}
</style>
