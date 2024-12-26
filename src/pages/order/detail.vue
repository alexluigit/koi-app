<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <view class="wrap">
      <navigator
        v-if="pages.length > 1"
        open-type="navigateBack"
        class="back icon-left"
      />
      <navigator v-else url="/pages/home/home" open-type="switchTab" class="back icon-home" />
      <view class="title">
        订单详情
      </view>
    </view>
  </view>
  <scroll-view
    id="scroller"
    enable-back-to-top
    scroll-y
    class="viewport"
    @scrolltolower="onScrolltolower"
  >
    <template v-if="order">
      <!-- 订单状态 -->
      <view class="overview" :style="{ paddingTop: `${safeAreaInsets!.top + 20}px` }">
        <!-- 待付款状态:展示倒计时 -->
        <template v-if="order.orderState === OrderState.PendingPayment">
          <view class="status icon-clock">
            等待付款
          </view>
          <view class="tips">
            <text class="money">
              应付金额: ¥ {{ order.payMoney }}
            </text>
            <text class="time">
              支付剩余
            </text>
            <uni-countdown
              :second="order.countdown"
              color="#fff"
              splitor-color="#fff"
              :show-day="false"
              :show-colon="false"
              @timeup="onTimeup"
            />
          </view>
          <view class="button" @tap="onOrderPay">
            去支付
          </view>
        </template>
        <!-- 其他订单状态:展示再次购买按钮 -->
        <template v-else>
          <!-- 订单状态文字 -->
          <view class="status">
            {{ orderStateList[order.orderState].text }}
          </view>
          <view class="button-group">
            <navigator
              class="button"
              :url="`/pages/order/create?orderId=${query.id}`"
              hover-class="none"
            >
              再次购买
            </navigator>
            <!-- 待发货状态：模拟发货,开发期间使用,用于修改订单状态为已发货 -->
            <view
              v-if="isDev && order.orderState === OrderState.PendingDispatch"
              class="button"
              @tap="onOrderSend"
            >
              模拟发货
            </view>
            <!-- 待收货状态: 展示确认收货按钮 -->
            <view
              v-if="order.orderState === OrderState.AwaitingReceipt"
              class="button"
              @tap="onOrderConfirm"
            >
              确认收货
            </view>
          </view>
        </template>
      </view>
      <!-- 配送状态 -->
      <view class="shipment">
        <!-- 订单物流信息 -->
        <view v-for="item in logisticList" :key="item.id" class="item">
          <view class="message">
            {{ item.text }}
          </view>
          <view class="date">
            {{ item.time }}
          </view>
        </view>
        <!-- 用户收货地址 -->
        <view class="locate">
          <view class="user">
            {{ order.receiverContact }} {{ order.receiverMobile }}
          </view>
          <view class="address">
            {{ order.receiverAddress }}
          </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods">
        <view class="item">
          <navigator
            v-for="item in order.skus"
            :key="item.id"
            class="navigator"
            :url="`/pages/product/product?id=${item.spuId}`"
            hover-class="none"
          >
            <image class="cover" :src="item.image" />
            <view class="meta">
              <view class="name ellipsis">
                {{ item.name }}
              </view>
              <view class="type">
                {{ item.attrsText }}
              </view>
              <view class="price">
                <view class="actual">
                  <text class="symbol">
                    ¥
                  </text>
                  <text>{{ item.curPrice }}</text>
                </view>
              </view>
              <view class="quantity">
                x{{ item.quantity }}
              </view>
            </view>
          </navigator>
          <!-- 待评价状态:展示按钮 -->
          <view v-if="order.orderState === OrderState.AwaitingComment" class="action">
            <view class="button primary">
              申请售后
            </view>
            <navigator url="" class="button">
              去评价
            </navigator>
          </view>
        </view>
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">
              商品总价:
            </view>
            <view class="symbol">
              {{ order.totalMoney }}
            </view>
          </view>
          <view class="row">
            <view class="text">
              运费:
            </view>
            <view class="symbol">
              {{ order.postFee }}
            </view>
          </view>
          <view class="row">
            <view class="text">
              应付金额:
            </view>
            <view class="symbol primary">
              {{ order.payMoney }}
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">
          订单信息
        </view>
        <view class="row">
          <view class="item">
            订单编号: {{ query.id }} <text class="copy" @tap="onCopy(query.id)">
              复制
            </text>
          </view>
          <view class="item">
            下单时间: {{ order.createTime }}
          </view>
        </view>
      </view>

      <!-- 猜你喜欢 -->
      <!-- <XtxGuess ref="guessRef" /> -->

      <!-- 底部操作栏 -->
      <view class="toolbar-height" :style="{ paddingBottom: `${safeAreaInsets?.bottom}px` }" />
      <view class="toolbar" :style="{ paddingBottom: `${safeAreaInsets?.bottom}px` }">
        <!-- 待付款状态:展示支付按钮 -->
        <template v-if="order.orderState === OrderState.PendingPayment">
          <view class="button primary" @tap="onOrderPay">
            去支付
          </view>
          <view class="button" @tap="popup?.open?.()">
            取消订单
          </view>
        </template>
        <!-- 其他订单状态:按需展示按钮 -->
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pages/order/create?orderId=${query.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="order.orderState === OrderState.AwaitingReceipt"
            class="button primary"
            @tap="onOrderConfirm"
          >
            确认收货
          </view>
          <!-- 待评价状态: 展示去评价 -->
          <view v-if="order.orderState === OrderState.AwaitingComment" class="button">
            去评价
          </view>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
          <view
            v-if="order.orderState >= OrderState.AwaitingComment"
            class="button delete"
            @tap="onOrderDelete"
          >
            删除订单
          </view>
        </template>
      </view>
    </template>
    <template v-else>
      <nut-button type="warning">
        page loading
      </nut-button>
    </template>
  </scroll-view>
  <!-- 取消订单弹窗 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">
        订单取消
      </view>
      <view class="description">
        <view class="tips">
          请选择取消订单的原因：
        </view>
        <view v-for="item in reasonList" :key="item" class="cell" @tap="reason = item">
          <text class="text">
            {{ item }}
          </text>
          <text class="icon" :class="{ checked: item === reason }" />
        </view>
      </view>
      <view class="footer">
        <view class="button" @tap="popup?.close?.()">
          取消
        </view>
        <view class="button primary" @tap="onOrderCancel">
          确认
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import type { DeliveryLog, OrderDetails } from '@/types/order';
// import { useGuessList } from '@/composables'
import { OrderState, orderStateList } from '@/api/constants';
import {
  cancelOrder,
  ConfirmReceipt,
  deleteOrder,
  getOrderDeliveryInfo,
  getOrderDetails,
  mockShipping,
} from '@/api/order';
import { goMockPayment } from '@/api/pay';

// 获取页面参数
const query = defineProps<{
  id: string;
}>();
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getWindowInfo();
// 猜你喜欢
// const { guessRef, onScrolltolower } = useGuessList()
// 弹出层组件
const popup = ref<UniHelper.UniPopupInstance>();
// 取消原因列表
const reasonList = ref([
  '商品无货',
  '不想要了',
  '商品信息填错了',
  '地址信息填写错误',
  '商品降价',
  '其它',
]);
// 订单取消原因
const reason = ref('');
// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id });
};
// 获取页面栈
const pages = getCurrentPages();

// 基于小程序的 Page 类型扩展 uni-app 的 Page
type PageInstance = Page.PageInstance & WechatMiniprogram.Page.InstanceMethods<any>;

// #ifdef MP-WEIXIN
// 获取当前页面实例，数组最后一项
const pageInstance = pages.at(-1) as PageInstance;

// 页面渲染完毕，绑定动画效果
onReady(() => {
  // 动画效果,导航栏背景色
  pageInstance.animate(
    '.navbar',
    [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }],
    1000,
    {
      scrollSource: '#scroller',
      timeRange: 1000,
      startScrollOffset: 0,
      endScrollOffset: 50,
    },
  );
  // 动画效果,导航栏标题
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  });
  // 动画效果,导航栏返回按钮
  pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  });
});
// #endif

const deliveryLogs = ref<DeliveryLog[]>([]);
const requestDeliveryInfo = async () => {
  const res = await getOrderDeliveryInfo(query.id);
  deliveryLogs.value = res.list;
};

const order = ref<OrderDetails>();
const requestOrderDetails = async () => {
  const res = await getOrderDetails(query.id);
  order.value = res;
  if (
    [OrderState.AwaitingReceipt, OrderState.AwaitingComment, OrderState.Finished].includes(
      order.value.orderState,
    )
  ) {
    requestDeliveryInfo();
  }
};

onLoad(() => requestOrderDetails());

// 倒计时结束事件
const onTimeup = () => {
  // 修改订单状态为已取消
  order.value!.orderState = OrderState.Cancelled;
};

// 订单支付
const onOrderPay = async () => {
  if (import.meta.env.DEV) {
    // 开发环境模拟支付
    await goMockPayment({ orderId: query.id });
  }
  else {
    // #ifdef MP-WEIXIN

    // 正式环境支付：1.获取支付订单信息，2.调用微信支付API
    // const res = await goWeixinPayment({ orderId: query.id })
    // await wx.requestPayment(res)

    // 注意：因小程序上线后被恶意投诉：理由为支付 0.01 元后不发货，现调整为模拟支付
    await goMockPayment({ orderId: query.id });
    // #endif

    // #ifdef H5 || APP-PLUS
    // H5端 和 App 端未开通支付-模拟支付体验
    await goMockPayment({ orderId: query.id });
    // #endif
  }
  // 关闭当前页，再跳转支付结果页
  uni.redirectTo({ url: `/pages/order/payment?id=${query.id}` });
};

// 是否为开发环境
const isDev = import.meta.env.DEV;
// 模拟发货
const onOrderSend = async () => {
  if (isDev) {
    await mockShipping(query.id);
    uni.showToast({ icon: 'success', title: '模拟发货完成' });
    // 主动更新订单状态
    order.value!.orderState = OrderState.AwaitingReceipt;
  }
};
// 确认收货
const onOrderConfirm = () => {
  // 二次确认弹窗
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#27BA9B',
    success: async (success) => {
      if (success.confirm) {
        const res = await ConfirmReceipt(query.id);
        // 更新订单状态
        order.value = res;
      }
    },
  });
};
// 删除订单
const onOrderDelete = () => {
  // 二次确认
  uni.showModal({
    content: '是否删除订单',
    confirmColor: '#27BA9B',
    success: async (success) => {
      if (success.confirm) {
        await deleteOrder({ ids: [query.id] });
        uni.redirectTo({ url: '/pages/order/all' });
      }
    },
  });
};

// 取消订单
const onOrderCancel = async () => {
  // 发送请求
  const res = await cancelOrder(query.id, { cancelReason: reason.value });
  // 更新订单信息
  order.value = res;
  // 关闭弹窗
  popup.value?.close!();
  // 轻提示
  uni.showToast({ icon: 'none', title: '订单取消成功' });
};
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 750rpx;
  color: #000;

  /* background-color: #f8f8f8; */
  background-color: transparent;

  .wrap {
    position: relative;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      font-size: 32rpx;

      /* color: #000; */
      color: transparent;
    }

    .back {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      font-size: 44rpx;

      /* color: #000; */
      color: #fff;
    }
  }
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30rpx;
  line-height: 1;
  color: #fff;
  background-image: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png");
  background-size: cover;

  .status {
    font-size: 36rpx;
  }

  .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .tips {
    display: flex;
    align-items: center;
    margin: 30rpx 0;
    font-size: 14px;

    .money {
      margin-right: 30rpx;
    }
  }

  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
  }

  .button {
    width: 260rpx;
    height: 64rpx;
    margin: 0 10rpx;
    font-size: 28rpx;
    line-height: 64rpx;
    color: #27ba9b;
    text-align: center;
    background-color: #fff;
    border-radius: 68rpx;
  }
}

.shipment {
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  line-height: 1.4;
  background-color: #fff;
  border-radius: 10rpx;

  .locate,
  .item {
    min-height: 120rpx;
    padding: 30rpx 30rpx 25rpx 75rpx;
    background-repeat: no-repeat;
    background-position: 6rpx center;
    background-size: 50rpx;
  }

  .locate {
    background-image: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png");

    .user {
      font-size: 26rpx;
      color: #444;
    }

    .address {
      font-size: 24rpx;
      color: #666;
    }
  }

  .item {
    position: relative;
    background-image: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/car.png");
    border-bottom: 1rpx solid #eee;

    .message {
      font-size: 26rpx;
      color: #444;
    }

    .date {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.goods {
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;

  .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;

    .navigator {
      display: flex;
      margin: 20rpx 0;
    }

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
    }

    .meta {
      position: relative;
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
      margin-top: 6rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #888;
      background-color: #f7f7f8;
      border-radius: 4rpx;
    }

    .price {
      display: flex;
      margin-top: 6rpx;
      font-size: 24rpx;
    }

    .symbol {
      font-size: 20rpx;
    }

    .original {
      color: #999;
      text-decoration: line-through;
    }

    .actual {
      margin-left: 10rpx;
      color: #444;
    }

    .text {
      font-size: 22rpx;
    }

    .quantity {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 24rpx;
      color: #444;
    }

    .action {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      padding: 30rpx 0 0;

      .button {
        justify-content: center;
        width: 200rpx;
        height: 60rpx;
        margin-left: 20rpx;
        font-size: 26rpx;
        line-height: 60rpx;
        color: #444;
        text-align: center;
        border: 1rpx solid #ccc;
        border-radius: 60rpx;
      }

      .primary {
        color: #27ba9b;
        border-color: #27ba9b;
      }
    }
  }

  .total {
    padding: 20rpx 0;
    font-size: 26rpx;
    line-height: 1;
    color: #666;

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }

    .symbol::before {
      margin-right: 3rpx;
      font-size: 80%;
      content: '¥';
    }

    .primary {
      font-size: 36rpx;
      color: #cf4444;
    }
  }
}

.detail {
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  line-height: 1;
  color: #666;
  background-color: #fff;
  border-radius: 10rpx;

  .title {
    font-size: 30rpx;
    color: #444;
  }

  .row {
    padding: 20rpx 0;

    .item {
      display: flex;
      align-items: center;
      padding: 10rpx 0;
    }

    .copy {
      padding: 5rpx 10rpx;
      margin-left: 10rpx;
      font-size: 20rpx;
      border: 1px solid #ccc;
      border-radius: 20rpx;
    }
  }
}

.toolbar-height {
  box-sizing: content-box;
  height: 100rpx;
}

.toolbar {
  position: fixed;
  right: 0;
  bottom: calc(var(--window-bottom));
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  height: 100rpx;
  padding: 0 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 3;
    width: 200rpx;
    height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    color: #444;
    border: 1rpx solid #ccc;
    border-radius: 72rpx;
  }

  .delete {
    order: 4;
    color: #cf4444;
  }

  .secondary {
    order: 2;
    color: #27ba9b;
    border-color: #27ba9b;
  }

  .primary {
    order: 1;
    color: #fff;
    background-color: #27ba9b;
  }
}

.popup-root {
  padding: 30rpx 30rpx 0;
  overflow: hidden;
  border-radius: 10rpx 10rpx 0 0;

  .title {
    margin-bottom: 30rpx;
    font-size: 30rpx;
    text-align: center;
  }

  .description {
    padding: 0 20rpx;
    font-size: 28rpx;

    .tips {
      margin-bottom: 12rpx;
      color: #444;
    }

    .cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15rpx 0;
      color: #666;
    }

    .icon::before {
      font-family: erabbit !important;
      font-size: 38rpx;
      color: #999;
      content: '\e6cd';
    }

    .icon.checked::before {
      font-size: 38rpx;
      color: #27ba9b;
      content: '\e6cc';
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;

    .button {
      flex: 1;
      height: 72rpx;
      margin: 0 20rpx;
      line-height: 72rpx;
      color: #444;
      text-align: center;
      border: 1rpx solid #ccc;
      border-radius: 72rpx;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
      border: none;
    }
  }
}
</style>
