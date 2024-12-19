<template>
  <view class="viewport">
    <home-navbar />
    <scroll-view
      enable-back-to-top refresher-enabled
      :refresher-triggered="isRefresherTriggered"
      class="scroll-view"
      scroll-y
      @refresherrefresh="onRefresherrefresh"
      @scrolltolower="onScrollToLower"
    >
      <template>
        <custom-swiper :list="bannerList" />
        <home-category-panel :list="categoryList" />
        <home-hot-panel :list="hotList" />
        <guess-like ref="guessRef" />
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type {
  BannerItem,
  CategoryItem,
  HotItem,
} from '@/types/home';
import {
  getHomeBannerAPI,
  getHomeCategoryAPI,
  getHomeHotAPI,
} from '@/api/home';

const isLoading = ref(false);
const isRefresherTriggered = ref(false);
const guessRef = ref();
const bannerList = ref<BannerItem[]>([]);
const categoryList = ref<CategoryItem[]>([]);
const hotList = ref<HotItem[]>([]);
const getHomeBannerData = async () => {
  bannerList.value = await getHomeBannerAPI();
};
const getHomeCategoryData = async () => {
  categoryList.value = await getHomeCategoryAPI();
};
const getHomeHotData = async () => {
  hotList.value = await getHomeHotAPI();
};
const onRefresherrefresh = async () => {
  isRefresherTriggered.value = true;
  guessRef.value.resetData();
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    guessRef.value.getMore(),
  ]);
  isRefresherTriggered.value = false;
};
const onScrollToLower = () => guessRef.value?.getMore();

onLoad(async () => {
  isLoading.value = true;
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
  ]);
  isLoading.value = false;
});
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f7;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
