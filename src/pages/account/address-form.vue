<template>
  <view class="content">
    <uni-forms ref="formRef" :rules="rules" :model="form">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">
          收货人
        </text>
        <input v-model="form.receiver" class="input" placeholder="请填写收货人姓名">
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">
          手机号码
        </text>
        <input
          v-model="form.contact"
          class="input"
          placeholder="请填写收货人手机号码"
          :maxlength="11"
        >
      </uni-forms-item>
      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">
          所在地区
        </text>
        <!-- #ifdef MP-WEIXIN -->
        <picker
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
          @change="changeRegion"
        >
          <view v-if="form.fullLocation">
            {{ form.fullLocation }}
          </view>
          <view v-else class="placeholder">
            请选择省/市/区(县)
          </view>
        </picker>
        <!-- #endif -->

        <!-- #ifdef H5 || APP-PLUS -->
        <uni-data-picker
          v-model="form.countyCode"
          placeholder="请选择地址"
          popup-title="请选择城市"
          collection="opendb-city-china"
          field="code as value, name as text"
          orderby="value asc"
          :step-searh="true"
          self-field="code"
          parent-field="parent_code"
          :clear-icon="false"
          @change="onCityChange"
        />
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">
          详细地址
        </text>
        <input v-model="form.address" class="input" placeholder="街道、楼牌号等信息">
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="submit">
    保存并使用
  </button>
</template>

<script setup lang="ts">
import * as AddressAPI from '@/api/address';

const query = defineProps<{ id?: string }>();

const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
});

const requestAddressById = async () => {
  if (query.id)
    Object.assign(form.value, await AddressAPI.getUserAddressById(query.id));
};

onLoad(() => requestAddressById());

uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' });

const changeRegion: UniHelper.RegionPickerOnChange = (ev) => {
  form.value.fullLocation = ev.detail.value.join(' ');
  const [provinceCode, cityCode, countyCode] = ev.detail.code!;
  // form.value.provinceCode = provinceCode
  Object.assign(form.value, { provinceCode, cityCode, countyCode });
};

// 收集是否默认收货地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0;
};

// 定义校验规则
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  countyCode: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请选择详细地址' }],
  },
};

// 表单组件实例
const formRef = ref<UniHelper.UniFormsInstance>();

// 提交表单
const submit = async () => {
  try {
    await formRef.value?.validate?.();
    if (query.id) {
      await AddressAPI.updateUserAddressById(query.id, form.value);
    }
    else {
      await AddressAPI.addUserAddress(form.value);
    }
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' });
    setTimeout(() => {
      uni.navigateBack();
    }, 400);
  }
  catch (error) {
    uni.showToast({ icon: 'error', title: (error as Error).message });
  }
};

// #ifdef H5 || APP-PLUS
const onCityChange: UniHelper.UniDataPickerOnChange = (ev) => {
  const [province, city, county] = ev.detail.value;
  Object.assign(form.value, {
    provinceCode: province.value,
    cityCode: city.value,
    countyCode: county.value,
  });
};
// #endif
</script>

<style lang="scss">
// 深度选择器修改 uni-data-picker 组件样式
:deep(.selected-area) {
  flex: 0 1 auto;
  height: auto;
}

page {
  background-color: #f4f4f4;
}

.content {
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;

  .form-item,
  .uni-forms-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx;
    margin-bottom: 0;
    font-size: 28rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #ddd;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      display: block;
      flex: 1;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  font-size: 30rpx;
  color: #fff;
  background-color: #27ba9b;
  border-radius: 80rpx;
}
</style>
