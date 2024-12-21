<template>
  <view class="viewport">
    <!-- 列表1 -->
    <view v-if="userStore.profile" class="list">
      <navigator url="/pages/account/address" hover-class="none" class="item arrow">
        我的收货地址
      </navigator>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <!-- 列表2 -->
    <view class="list">
      <button hover-class="none" class="item arrow" open-type="openSetting">
        授权管理
      </button>
      <button hover-class="none" class="item arrow" open-type="feedback">
        问题反馈
      </button>
      <button hover-class="none" class="item arrow" open-type="contact">
        联系我们
      </button>
    </view>
    <!-- #endif -->
    <!-- 列表3 -->
    <view class="list">
      <button hover-class="none" class="item arrow">
        关于锦鲤福利
      </button>
    </view>
    <!-- 操作按钮 -->
    <view v-if="userStore.profile" class="action">
      <view class="button" @tap="userLogout">
        退出登录
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';

const userStore = useUserStore();
const userLogout = () => {
  uni.showModal({
    content: '是否退出登录？',
    confirmColor: '#27BA9B',
    success: (res) => {
      if (res.confirm) {
        userStore.clearProfile();
        uni.navigateBack();
      }
    },
  });
};
</script>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  padding: 20rpx;
}

/* 列表 */
.list {
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;

  .item {
    position: relative;
    padding-left: 10rpx;
    font-size: 30rpx;
    line-height: 90rpx;
    color: #333;
    text-align: left;
    background-color: #fff;
    border-top: 1rpx solid #ddd;
    border-radius: 0;

    &::after {
      right: 5rpx;
      left: auto;
      width: auto;
      height: auto;
      border: none;
    }

    &:first-child {
      border: none;
    }
  }

  .arrow::after {
    position: absolute;
    top: 50%;
    font-family: erabbit !important;
    font-size: 32rpx;
    color: #ccc;
    content: '\e6c2';
    transform: translateY(-50%);
  }
}

/* 操作按钮 */
.action {
  margin-top: 40rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #333;
  text-align: center;

  .button {
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }
}
</style>
