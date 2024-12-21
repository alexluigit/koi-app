<template>
  <view class="address-panel">
    <text class="close icon-close" />
    <view class="title">
      配送至
    </view>
    <view class="content">
      <view class="item">
        <view class="user">
          谭俊豪 13000114514
        </view>
        <view class="address">
          湖北省武汉市江岸区xx小区4号院
        </view>
        <text class="icon icon-checked" />
      </view>
      <view class="item">
        <view class="user">
          谭俊 13001114514
        </view>
        <view class="address">
          北京市顺义区后沙峪地区安平北街6号院
        </view>
        <text class="icon icon-ring" />
      </view>
      <view class="item">
        <view class="user">
          谭豪 13002114514
        </view>
        <view class="address">
          北京市朝阳区孙河安平北街6号院
        </view>
        <text class="icon icon-ring" />
      </view>
    </view>
    <view class="footer">
      <view class="button primary">
        新建地址
      </view>
      <view v-if="false" class="button primary">
        确定
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.address-panel {
  position: relative;
  padding: 0 30rpx;
  background-color: #fff;
  border-radius: 10rpx 10rpx 0 0;
}

.title {
  padding: 40rpx 0;
  font-size: 32rpx;
  font-weight: normal;
  line-height: 1;
  color: #444;
  text-align: center;
  border-bottom: 1rpx solid #ddd;
}

.close {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  padding: 20rpx;
  overflow: auto;

  .item {
    position: relative;
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-image: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png");
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: 40rpx;
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 40rpx;
    color: #999;
    transform: translateY(-50%);
  }

  .icon-checked {
    color: #27ba9b;
  }

  .icon-ring {
    color: #444;
  }

  .user {
    font-size: 28rpx;
    font-weight: 500;
    color: #444;
  }

  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    margin: 0 20rpx;
    line-height: 72rpx;
    color: #fff;
    text-align: center;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .secondary {
    background-color: #ffa868;
  }
}
</style>
