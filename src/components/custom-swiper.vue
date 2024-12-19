<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl" />
        </navigator>
      </swiper-item>
    </swiper>
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { BannerItem } from '@/types/home';

defineProps<{ list: BannerItem[] }>();

const activeIndex = ref(0);

const onChange: UniHelper.SwiperOnChange = (ev) => {
  activeIndex.value = ev.detail.current;
};
</script>

<style lang="scss">
.carousel {
  position: relative;
  height: 280rpx;
  overflow: hidden;
  background-color: #efefef;
  transform: translateY(0);

  .indicator {
    position: absolute;
    right: 0;
    bottom: 16rpx;
    left: 0;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      background-color: rgb(255 255 255 / 40%);
      border-radius: 6rpx;
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
