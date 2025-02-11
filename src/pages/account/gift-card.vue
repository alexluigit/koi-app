<template>
  <view class="gift-card-page">
    <image class="qrcode-image" src="@/static/images/test_qrcode.png" />
    <view class="balance">
      <text class="balance-label">
        当前余额:
      </text>
      <text class="balance-amount">
        {{ balance }}
      </text>
    </view>
  </view>
</template>

<script setup="ts">
import { getCardInfo } from '@/api/giftcard';

const balance = ref(0);

onLoad(async () => {
  const res = await getCardInfo('koi-consume-code-12345678');
  balance.value = res.balance / 100;
});
</script>

<style scoped>
.gift-card-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.balance {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.balance-label {
  font-weight: bold;
}

.balance-amount {
  margin-left: 5px;
}
</style>
