<template>
  <view class="not-found">
    <uni-section
      class="not-found"
      title="404"
      sub-title="找不到该页面" type="line"
    />
    <image class="not-found-image" src="@/static/images/404.png" />
  </view>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: auto;

  .not-found-image {
    width: 380rpx;
    height: 380rpx;
  }
}
</style>
