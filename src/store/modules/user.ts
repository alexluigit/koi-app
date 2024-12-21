import type { LoginParams, LoginResult, LoginWxMinParams, providerType } from '@/types/user/login';
import { LoginAPI } from '@/api/user';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const profile = ref<LoginResult>();
  const setProfile = (val: LoginResult) => profile.value = val;
  const clearProfile = () => profile.value = undefined;
  const login = async (data: LoginParams) => await LoginAPI.postLoginAPI(data);
  const wxLogin = async (data: LoginWxMinParams) => await LoginAPI.postLoginWxMinAPI(data);
  const sampleLogin = async (phoneNumber: string) =>
    await LoginAPI.postLoginWxMinSimpleAPI(phoneNumber);
  const authLogin = (provider: providerType = 'weixin') =>
    new Promise((resolve, reject) => {
      uni.login({
        provider,
        success: async (result: UniApp.LoginRes) => {
          if (result.code) resolve(await LoginAPI.loginByCode({ code: result.code }));
          else reject(new Error(result.errMsg));
        },
        fail: (err: any) => {
          console.error(`login error: ${err}`);
          reject(err);
        },
      });
    });
  return {
    profile,
    setProfile,
    clearProfile,
    login,
    wxLogin,
    sampleLogin,
    authLogin,
  };
}, {
  persist: false,
});
