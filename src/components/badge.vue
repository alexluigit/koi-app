<template>
  <view>
    <view v-if="propNumber !== 0" class="am-badge">
      <view :class="`am-badge-text ${(propNumber > 99) ? 'am-badge-text-max' : ''}`">
        <text>{{ (propNumber > 99) ? '99+' : propNumber }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    propNumber: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {},
  methods: {},
};
</script>

<style scoped>
.am-badge {
    position: relative;
    display: inline-block;
    vertical-align: middle;
}

.am-badge-text {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    min-width: 28rpx;
    height: 28rpx;
    padding: 0;
    padding: 2rpx;
    font-size: 20rpx;
    line-height: 28rpx;
    color: #fff;
    text-align: center;
    background-color: #FF3B30;
    border-radius: 40rpx;
    box-shadow: 0 0 10rpx rgb(0 0 0 / 30%);
    transform: translate(50%, -50%);
}

.am-badge-text-max {
    padding: 2rpx 4rpx;
}
</style>
