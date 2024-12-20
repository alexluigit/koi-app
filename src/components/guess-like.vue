<template>
  <view class="caption">
    <text class="text">
      猜你喜欢
    </text>
  </view>
  <view class="guess">
    <navigator
      v-for="item in guessList"
      :key="item.id"
      class="guess-item"
      :url="`/pages/common/product/product?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture" />
      <view class="name">
        {{ item.name }}
      </view>
      <view class="price">
        <text class="small">
          ¥
        </text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? '没有更多了~' : '正在加载...' }}
  </view>
</template>

<script setup lang="ts">
import type { PageParams, PageResult } from '@/types/global';
import type { GuessItem } from '@/types/home';
import { getHomeGuessLikeAPI } from '@/api/home';

const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
};

const guessList = ref<GuessItem[]>([]);
const finish = ref(false);
const getGuessLikeData = async () => {
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' });
  }
  const res: PageResult<GuessItem> = await getHomeGuessLikeAPI(pageParams);
  guessList.value.push(...res.items);
  if (pageParams.page < res.pages) pageParams.page++;
  else finish.value = true;
};
const resetData = () => {
  pageParams.page = 1;
  guessList.value = [];
  finish.value = false;
};
onMounted(() => getGuessLikeData());
defineExpose({
  resetData,
  getMore: getGuessLikeData,
});
</script>

<style lang="scss">
:host {
  display: block;
}

.caption {
  display: flex;
  justify-content: center;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  line-height: 1;
  color: #262626;

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      width: 20rpx;
      height: 20rpx;
      margin: 0 10rpx;
      content: '';
      background-image: url("@/static/images/bubble.png");
      background-size: contain;
    }
  }
}

.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10rpx;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    display: -webkit-box;
    height: 75rpx;
    margin: 10rpx 0;
    overflow: hidden;
    font-size: 26rpx;
    color: #262626;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    padding-top: 4rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #cf4444;
  }

  .small {
    font-size: 80%;
  }
}

.loading-text {
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  text-align: center;
}
</style>
