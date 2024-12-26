<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData"
  >
    <view v-for="order in orderList" :key="order.id" class="card">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">
          {{ order.createTime }}
        </text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="order.orderState >= OrderState.AwaitingComment"
          class="icon-delete"
          @tap="onOrderDelete(order.id)"
        />
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        v-for="item in order.skus"
        :key="item.id"
        class="goods"
        :url="`/pages/order/detail?id=${order.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image class="image" mode="aspectFit" :src="item.image" />
        </view>
        <view class="meta">
          <view class="name ellipsis">
            {{ item.name }}
          </view>
          <view class="type">
            {{ item.attrsText }}
          </view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">
          共{{ order.totalNum }}件商品
        </text>
        <text>实付</text>
        <text class="amount">
          <text class="symbol">
            ¥
          </text>{{ order.payMoney }}
        </text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.orderState === OrderState.PendingPayment">
          <view class="button primary" @tap="onOrderPay(order.id)">
            去支付
          </view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pages/order/create?orderId=${order.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="order.orderState === OrderState.AwaitingReceipt"
            class="button primary"
            @tap="onOrderConfirm(order.id)"
          >
            确认收货
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: `${safeAreaInsets?.bottom}px` }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import type { OrderItem, OrderListParams } from '@/types/order';
import { OrderState, orderStateList } from '@/api/constants';
import { ConfirmReceipt, deleteOrder, getOrderList } from '@/api/order';
import { goMockPayment } from '@/api/pay';

// 定义 porps
const props = defineProps<{ orderState: number }>();

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getWindowInfo();

// 请求参数
const queryParams: Required<OrderListParams> = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
};

// 是否分页结束
const isFinish = ref(false);

// 获取订单列表
const orderList = ref<OrderItem[]>([]);
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false);
const getMemberOrderData = async () => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return;
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' });
  }
  // 发送请求前，标记为加载中
  isLoading.value = true;
  // 发送请求
  const res = await getOrderList(queryParams);
  // 发送请求后，重置标记
  isLoading.value = false;
  // 数组追加
  orderList.value.push(...res.items);
  // 分页条件
  if (queryParams.page < res.pages) {
    // 页码累加
    queryParams.page++;
  }
  else {
    // 分页已结束
    isFinish.value = true;
  }
};

onMounted(() => {
  getMemberOrderData();
});

// 订单支付
const onOrderPay = async (id: string) => {
  if (import.meta.env.DEV) {
    // 开发环境模拟支付
    await goMockPayment({ orderId: id });
  }
  else {
    // #ifdef MP-WEIXIN

    // 正式环境支付：1.获取支付订单信息，2.调用微信支付API
    // const res = await goWeixinPayment({ orderId: id })
    // await wx.requestPayment(res.result)

    // 注意：因小程序上线后被恶意投诉：理由为支付 0.01 元后不发货，现调整为模拟支付
    await goMockPayment({ orderId: id });
    // #endif
  }
  // 成功提示
  uni.showToast({ title: '模拟支付成功' });
  // 模拟支付提示
  setTimeout(() => {
    wx.showModal({
      title: '温馨提示',
      content: '此交易是模拟支付，您并未付款，不会导致实际购买商品或服务',
      confirmText: '知道了',
      showCancel: false,
    });
  }, 2000);
  // 更新订单状态
  const order = orderList.value.find(v => v.id === id);
  order!.orderState = OrderState.PendingDispatch;
};

// 确认收货
const onOrderConfirm = (id: string) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await ConfirmReceipt(id);
        uni.showToast({ icon: 'success', title: '确认收货成功' });
        // 确认成功，更新为待评价
        const order = orderList.value.find(v => v.id === id);
        order!.orderState = OrderState.AwaitingComment;
      }
    },
  });
};

// 删除订单
const onOrderDelete = (id: string) => {
  uni.showModal({
    content: '你确定要删除该订单？',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await deleteOrder({ ids: [id] });
        // 删除成功，界面中删除订单
        const index = orderList.value.findIndex(v => v.id === id);
        orderList.value.splice(index, 1);
      }
    },
  });
};

// 是否触发下拉刷新
const isTriggered = ref(false);
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true;
  // 重置数据
  queryParams.page = 1;
  orderList.value = [];
  isFinish.value = false;
  // 加载数据
  await getMemberOrderData();
  // 关闭动画
  isTriggered.value = false;
};
</script>

<style lang="scss">
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    background-color: #fff;
    border-radius: 10rpx;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15rpx;
    font-size: 28rpx;
    color: #999;

    .date {
      flex: 1;
      color: #666;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      padding-left: 10rpx;
      margin-left: 10rpx;
      line-height: 1;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      position: relative;
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      overflow: hidden;
      border-radius: 10rpx;

      .image {
        width: 170rpx;
        height: 170rpx;
      }
    }

    .quantity {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      line-height: 1;
      color: #fff;
      background-color: rgb(0 0 0 / 60%);
      border-radius: 10rpx 0 0;
    }

    .meta {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      align-self: flex-start;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #888;
      background-color: #f7f7f8;
      border-radius: 4rpx;
    }

    .more {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20rpx 0;
    font-size: 28rpx;
    line-height: 1;
    color: #999;
    text-align: right;
    border-bottom: 1rpx solid #eee;

    .quantity {
      margin-right: 16rpx;
      font-size: 24rpx;
    }

    .amount {
      margin-left: 6rpx;
      color: #444;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 20rpx;

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180rpx;
      height: 60rpx;
      margin-left: 20rpx;
      font-size: 26rpx;
      color: #444;
      border: 1rpx solid #ccc;
      border-radius: 60rpx;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
      border-color: #27ba9b;
    }
  }

  .loading-text {
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #666;
    text-align: center;
  }
}
</style>
