import type { LoginParams, LoginResult, LoginWxMinParams } from '@/types/user/login';
import { UserLoginApi } from '@/api/user';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const profile = ref<LoginResult>();
  const setProfile = (val: LoginResult) => profile.value = val;
  const clearProfile = () => profile.value = undefined;

  const login = async (data: LoginParams) => await UserLoginApi.postLoginAPI(data);
  const wxLogin = async (data: LoginWxMinParams) => await UserLoginApi.postLoginWxMinAPI(data);
  const sampleLogin = async (phoneNumber: string) =>
    await UserLoginApi.postLoginWxMinSimpleAPI(phoneNumber);

  return {
    profile,
    setProfile,
    clearProfile,
    login,
    wxLogin,
    sampleLogin,
  };
}, {
  persist: false,
});
