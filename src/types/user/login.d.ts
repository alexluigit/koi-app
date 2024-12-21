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

export interface LoginByCodeParams {
  code: string;
}

export interface LoginByCodeResult {
  [key: string]: any;
}

export type LoginResult = BaseProfile & {
  mobile: string;
  token: string;
};

export type providerType =
  | 'weixin'
  | 'qq'
  | 'sinaweibo'
  | 'xiaomi'
  | 'apple'
  | 'univerify'
  | undefined;
