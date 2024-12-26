<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        v-for="(item, index) in orderTabs"
        :key="item.title"
        class="item"
        @tap="
          () => {
            activeIndex = index
            item.isRender = true
          }
        "
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: `${activeIndex * 20}%` }" />
    </view>
    <!-- 滑动容器 -->
    <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
      <!-- 滑动项 -->
      <swiper-item v-for="item in orderTabs" :key="item.title">
        <!-- 订单列表 -->
        <order-items-tab v-if="item.isRender" :order-state="item.orderState" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
// 获取页面参数
const query = defineProps<{
  type: string;
}>();

// tabs 数据
const orderTabs = ref([
  { orderState: 0, title: '全部', isRender: false },
  { orderState: 1, title: '待付款', isRender: false },
  { orderState: 2, title: '待发货', isRender: false },
  { orderState: 3, title: '待收货', isRender: false },
  { orderState: 4, title: '待评价', isRender: false },
]);

// 高亮下标
const activeIndex = ref(orderTabs.value.findIndex(v => v.orderState === Number(query.type)));
// 默认渲染容器
orderTabs.value[activeIndex.value].isRender = true;
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

// tabs
.tabs {
  position: relative;
  z-index: 9;
  display: flex;
  justify-content: space-around;
  margin: 0 10rpx;
  line-height: 60rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgb(240 240 240 / 60%);

  .item {
    flex: 1;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
    text-align: center;
  }

  .cursor {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #27ba9b;

    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}
</style>
