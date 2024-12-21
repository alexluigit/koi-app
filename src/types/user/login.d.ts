import type { BaseProfile } from './profile';

export interface LoginParams {
  account: string;
  password: string;
}

export interface LoginWxMinParams {
  code: string;
  encryptedData?: string;
  iv?: string;
}

export type LoginResult = BaseProfile & {
  mobile: string;
  token: string;
};

export interface LoginByCodeReq {
  code: string;
}

export interface LoginByCodeRes {
  [key: string]: any;
}

export type providerType =
  | 'weixin'
  | 'qq'
  | 'sinaweibo'
  | 'xiaomi'
  | 'apple'
  | 'univerify'
  | undefined;
