// import type { CommonRes } from '@/types/network';
// import type { LoginByCodeReq, LoginByCodeRes, LoginReq, LoginRes, ProfileReq, ProfileRes } from '@/types/user';
import type { LoginParams, LoginResult, LoginWxMinParams } from '@/types/user/login';
import { post } from '@/utils/request';

// export const profile = (params?: ProfileReq) => get<ProfileRes>('/user/profile', { params });
// export const login = (data: LoginReq) => post<LoginRes>('/user/login', { data, custom: { auth: false } });
// export const loginByCode = (data: LoginByCodeReq) => post<LoginByCodeRes>('/user/loginByCode', { data });
// export const logout = () => post<CommonRes>('/user/logout');

export const postLoginAPI = (data: LoginParams) =>
  post<LoginResult>('/login', { data });

export const postLoginWxMinAPI = (data: LoginWxMinParams) =>
  post<LoginResult>('/login/wxMin', { data });

export const postLoginWxMinSimpleAPI = (phoneNumber: string) =>
  post<LoginResult>('/login/wxMin/simple', { data: { phoneNumber } });
