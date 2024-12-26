<template>
  <view class="viewport">
    <view class="logo">
      <image src="@/static/images/logo.png" />
    </view>
    <view class="login">
      <!-- #ifdef H5 -->
      <input v-model="form.account" class="input" type="text" placeholder="请输入用户名/手机号码">
      <input v-model="form.password" class="input" type="text" password placeholder="请输入密码">
      <button class="button phone" @tap="onSubmit">
        登录
      </button>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view class="button-privacy-wrap">
        <button
          :hidden="isAgreePrivacy"
          class="button-opacity button phone"
          @tap="checkedAgreePrivacy"
        >
          请先阅读并勾选协议
        </button>
        <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
          <text class="icon icon-phone" />
          手机号快捷登录
        </button>
      </view>
      <!-- #endif -->

      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @tap="onSampleLogin">
            <text class="icon icon-phone">
              模拟快捷登录
            </text>
          </button>
        </view>
      </view>
      <view class="tips" :class="{ 'animate-shake': isAgreePrivacyShakeY }">
        <label class="label" @tap="isAgreePrivacy = !isAgreePrivacy">
          <radio class="radio" color="#28bb9c" :checked="isAgreePrivacy" />
          <text>登录/注册即视为你同意锦鲤福利</text>
        </label>
        <navigator class="link" hover-class="none" url="/pages/common/protocol">
          《服务条款》
        </navigator>
        和
        <text class="link" @tap="onOpenPrivacyContract">
          《隐私协议》
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { LoginResult } from '@/types/user/login';
import { useUserStore } from '@/store';
import { isTabBarPath, LOGIN_PATH, sanitizePath, USER_PATH } from '@/utils/router';

const userStore = useUserStore();
const isAgreePrivacy = ref(false);
const isAgreePrivacyShakeY = ref(false);
const checkedAgreePrivacy = async () => { // TODO: doesn't work on H5
  if (!isAgreePrivacy.value) {
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    });
    isAgreePrivacyShakeY.value = true;
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false;
    }, 500);
    return Promise.reject(console.error('请先阅读并勾选协议'));
  }
};
let redirectPath = USER_PATH;
const loginSuccess = (profile: LoginResult) => {
  userStore.setProfile(profile);
  uni.showToast({ icon: 'success', title: '登录成功' });
  console.log(`going to ${redirectPath}`);
  setTimeout(() => {
    if (isTabBarPath(redirectPath)) uni.switchTab({ url: redirectPath });
    else uni.redirectTo({ url: redirectPath });
  }, 500);
};

onLoad(async (options: any) => {
  if (options.redirect
    && sanitizePath(options.redirect) !== LOGIN_PATH) {
    redirectPath = decodeURIComponent(options.redirect);
  }
});

// #ifdef MP-WEIXIN
let code = '';
onLoad(async () => {
  const res = await wx.login();
  code = res.code;
});

const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  await checkedAgreePrivacy();
  const { encryptedData, iv } = ev.detail;
  const res = await userStore.wxLogin({ code, encryptedData, iv });
  loginSuccess(res);
};
// #endif

const onSampleLogin = async () => {
  await checkedAgreePrivacy();
  const res = await userStore.sampleLogin('13123456789');
  loginSuccess(res);
};

// #ifdef H5
// Login use phone number，test account：13123456789 password：123456
const form = ref({
  account: '13123456789',
  password: '',
});

const onSubmit = async () => {
  await checkedAgreePrivacy();
  const res = await userStore.login(form.value);
  loginSuccess(res);
};
// #endif

const onOpenPrivacyContract = () => {
  // #ifdef MP-WEIXIN
  wx.openPrivacyContract({});
  // #endif
};
</script>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 500rpx;
    height: 105rpx;
    margin-top: 15vh;
    filter: opacity(0.8) drop-shadow(0 1000px 0 #28bb9c);
    transform: translateY(-1000px);
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    border: 1px solid #ddd;
    border-radius: 72rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    color: #fff;
    border-radius: 72rpx;

    .icon {
      margin-right: 6rpx;
      font-size: 40rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      position: relative;
      width: 440rpx;
      font-size: 26rpx;
      line-height: 1;
      color: #999;
      border-top: 1rpx solid #ddd;

      text {
        position: absolute;
        top: -12rpx;
        left: 50%;
        background-color: #fff;
        transform: translate(-40%);
      }
    }

    .options {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;

        &::after {
          border: none;
        }
      }
    }

    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #444;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      color: #06c05f;
      border-color: #06c05f;
    }
  }
}

@keyframes animate-shake {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, -5rpx);
  }

  100% {
    transform: translate(0, 0);
  }
}

.animate-shake {
  animation: animate-shake 0.2s ease-in-out 3;
}

.button-privacy-wrap {
  position: relative;

  .button-opacity {
    position: absolute;
    z-index: 1;
    opacity: 0;
  }
}

.tips {
  position: absolute;
  right: 20rpx;
  bottom: 80rpx;
  left: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;

  .radio {
    margin-top: -4rpx;
    margin-right: -4rpx;
    vertical-align: middle;
    transform: scale(0.6);
  }

  .link {
    display: inline;
    color: #28bb9c;
  }
}
</style>
