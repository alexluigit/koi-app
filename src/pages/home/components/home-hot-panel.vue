<template>
  <view class="panel hot">
    <view v-for="item in list" :key="item.id" class="item">
      <view class="title">
        <text class="title-text">
          {{ item.title }}
        </text>
        <text class="title-desc">
          {{ item.alt }}
        </text>
      </view>
      <navigator hover-class="none" :url="`/pages/hot/hot?type=${item.type}`" class="cards">
        <image
          v-for="src in item.pictures"
          :key="src"
          class="image"
          mode="aspectFit"
          :src="src"
        />
      </navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { HotItem } from '@/types/home';

defineProps<{
  list: HotItem[];
}>();
</script>

<style lang="scss">
@import '../styles/hot.scss';
</style>
