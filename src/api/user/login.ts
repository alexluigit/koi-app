import type {
  LoginByCodeParams,
  LoginByCodeResult,
  LoginParams,
  LoginResult,
  LoginWxMinParams,
} from '@/types/user/login';
import { post } from '@/utils/request';

export const loginByCode = (data: LoginByCodeParams) =>
  post<LoginByCodeResult>('/user/loginByCode', { data });
export const postLoginAPI = (data: LoginParams) =>
  post<LoginResult>('/login', { data });
export const postLoginWxMinAPI = (data: LoginWxMinParams) =>
  post<LoginResult>('/login/wxMin', { data });
export const postLoginWxMinSimpleAPI = (phoneNumber: string) =>
  post<LoginResult>('/login/wxMin/simple', { data: { phoneNumber } });
