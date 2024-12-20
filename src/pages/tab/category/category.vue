<template>
  <!-- <view class="viewport" v-if="isFinish"> -->
  <view class="viewport">
    <view class="search">
      <view class="input">
        <text class="icon-search">
          电饭煲
        </text>
      </view>
    </view>
    <view class="categories">
      <!-- Left side: toplevel category -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name">
            {{ item.name }}
          </text>
        </view>
      </scroll-view>
      <!-- Right side: secondary category -->
      <scroll-view enable-back-to-top class="secondary" scroll-y>
        <custom-swiper class="banner" :list="bannerList" />
        <view v-for="item in subCategoryList" :key="item.id" class="panel">
          <view class="title">
            <text class="name">
              {{ item.name }}
            </text>
            <navigator class="more" hover-class="none">
              全部
            </navigator>
          </view>
          <view class="section">
            <navigator
              v-for="product in item.goods"
              :key="product.id"
              class="product"
              hover-class="none"
              :url="`/pages/common/product/product?id=${product.id}`"
            >
              <image class="image" :src="product.picture" />
              <view class="name ellipsis">
                {{ product.name }}
              </view>
              <view class="price">
                <text class="symbol">
                  ¥
                </text>
                <text class="number">
                  {{ product.price }}
                </text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <!-- <PageSkeleton v-else /> -->
</template>

<script setup lang="ts">
import type { CategoryTopItem } from '@/types/category';
import type { BannerItem } from '@/types/home';
import { getCategoryBannerAPI, getCategoryTopAPI } from '@/api/category';
// import PageSkeleton from './components/PageSkeleton.vue'

const bannerList = ref<BannerItem[]>([]);
const getBannerData = async () => {
  bannerList.value = await getCategoryBannerAPI();
};
const categoryList = ref<CategoryTopItem[]>([]);
const activeIndex = ref(0);
const getCategoryTopData = async () => {
  categoryList.value = await getCategoryTopAPI();
};

const isFinish = ref(false);
onLoad(async () => {
  await Promise.all([getBannerData(), getCategoryTopData()]);
  isFinish.value = true;
});

const subCategoryList = computed(() =>
  categoryList.value[activeIndex.value]?.children || []);
</script>

<style lang="scss">
@import './styles/category.scss';
</style>
