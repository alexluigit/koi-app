<template>
  <view class="service-panel">
    <text class="close icon-close" @tap="emit('close')" />
    <view class="title">
      服务说明
    </view>
    <view class="content">
      <view class="item">
        <view class="dt">
          无忧退货
        </view>
        <view class="dd">
          自收到商品之日起30天内，可在线申请无忧退货服务（食品等特殊商品除外）
        </view>
      </view>
      <view class="item">
        <view class="dt">
          快速退款
        </view>
        <view class="dd">
          收到退货包裹并确认无误后，将在48小时内办理退款，
          退款将原路返回，不同银行处理时间不同，预计1-5个工作日到账
        </view>
      </view>
      <view class="item">
        <view class="dt">
          满88元免邮费
        </view>
        <view class="dd">
          单笔订单金额(不含运费)满88元可免邮费，不满88元， 单笔订单收取10元邮费
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'close'): void;
}>();
</script>

<style lang="scss">
.service-panel {
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
  padding: 20rpx 20rpx 100rpx;

  .item {
    margin-top: 20rpx;
  }

  .dt {
    position: relative;
    margin-bottom: 10rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;

    &::before {
      position: absolute;
      top: 50%;
      left: -20rpx;
      width: 10rpx;
      height: 10rpx;
      content: '';
      background-color: #eaeaea;
      border-radius: 50%;
      transform: translateY(-50%);
    }
  }

  .dd {
    font-size: 26rpx;
    line-height: 1.6;
    color: #999;
  }
}
</style>
