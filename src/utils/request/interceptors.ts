import type {
  HttpError,
  HttpRequestAbstract,
  HttpRequestConfig,
  HttpResponse,
} from 'luch-request';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';
import storage from '@/utils/storage';
import { showMessage } from './status';

let requestQueue: (() => void)[] = [];

// 防止重复提交
const repeatSubmit = (config: HttpRequestConfig) => {
  const requestObj = {
    url: config.url,
    data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
    time: new Date().getTime(),
  };
  const sessionObj = storage.getJSON('sessionObj');
  if (!sessionObj) {
    storage.setJSON('sessionObj', requestObj);
  }
  else {
    const s_url = sessionObj.url; // 请求地址
    const s_data = sessionObj.data; // 请求数据
    const s_time = sessionObj.time; // 请求时间
    const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
    if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
      const message = '数据正在处理，请勿重复提交';
      console.warn(`[${s_url}]: ${message}`);
      return Promise.reject(new Error(message));
    }
    else {
      storage.setJSON('sessionObj', requestObj);
    }
  }
};

let isRefreshing: boolean = false;

const refreshToken = async (http: HttpRequestAbstract, config: HttpRequestConfig) => {
  // 是否在获取token中,防止重复获取
  if (!isRefreshing) {
    // 修改登录状态为true
    isRefreshing = true;
    await useUserStore().authLogin();
    // 登录完成之后，开始执行队列请求
    requestQueue.forEach(cb => cb());
    // 重试完了清空这个队列
    requestQueue = [];
    isRefreshing = false;
    // 重新执行本次请求
    return http.request(config);
  }
  else {
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等登录后直接执行
      requestQueue.push(() => {
        resolve(http.request(config));
      });
    });
  }
};

function requestInterceptors(http: HttpRequestAbstract) {
  http.interceptors.request.use(
    (config: HttpRequestConfig) => {
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {};
      const custom = config?.custom;
      // #ifdef MP-WEIXIN
      config.header = {
        ...config.header,
        'source-client': 'miniapp',
      };
      // #endif
      const isToken = custom?.auth === false;
      if (getToken() && !isToken && config.header) {
        config.header.token = getToken();
      }
      if (custom?.loading) {
        uni.showLoading({
          title: '加载中',
          mask: true,
        });
      }
      const isRepeatSubmit = custom?.repeatSubmit === false;
      if (!isRepeatSubmit && (config.method === 'POST' || config.method === 'UPLOAD')) {
        repeatSubmit(config);
      }
      return config;
    },
    (config: any) => Promise.reject(config),
  );
}

function responseInterceptors(http: HttpRequestAbstract) {
  http.interceptors.response.use(
    async (response: HttpResponse) => {
      /* 对响应成功做点什么 可使用async await 做异步操作 */
      const data = response.data;
      const config = response.config;
      const custom = config?.custom;
      const statusCode = response.statusCode;
      if (statusCode === 401) refreshToken(http, config);
      if (custom?.loading) uni.hideLoading();
      if (statusCode >= 200 && statusCode < 300) {
        return response || {};
      }
      if (custom?.toast !== false) uni.$u.toast(data.message);
      return Promise.reject(data);
    },
    (response: HttpError) => {
      const custom = response.config?.custom;
      if (custom?.loading !== false) uni.hideLoading();
      if (custom?.toast !== false) {
        const message = response.statusCode ? showMessage(response.statusCode) : '网络连接异常,请稍后再试!';
        uni.$u.toast(message);
      }
      return Promise.reject(response);
    },
  );
}

export { requestInterceptors, responseInterceptors };
