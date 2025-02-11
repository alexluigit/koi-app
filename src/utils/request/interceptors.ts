import type {
  HttpError,
  HttpRequestAbstract,
  HttpRequestConfig,
  HttpResponse,
} from 'luch-request';
import { useUserStore } from '@/store';
import storage from '@/utils/storage';
import { httpErrorMessages } from './status';

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
    const s_url = sessionObj.url;
    const s_data = sessionObj.data;
    const s_time = sessionObj.time;
    const interval = 1000;
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
let requestQueue: (() => void)[] = [];
const refreshToken = async (http: HttpRequestAbstract, config: HttpRequestConfig) => {
  if (!isRefreshing) {
    isRefreshing = true;
    const userStore = useUserStore();
    userStore.clearProfile();
    await useUserStore().authLogin();
    requestQueue.forEach(cb => cb());
    requestQueue = [];
    isRefreshing = false;
    return http.request(config);
  }
  else {
    return new Promise((resolve) => {
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
      const token = useUserStore().profile?.token;
      if (token) config.header.Authorization = token;
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
      const data = response.data;
      const config = response.config;
      const custom = config?.custom;
      const statusCode = response.statusCode;
      if (custom?.loading) uni.hideLoading();
      // if (statusCode === 401) await refreshToken(http, config);
      if (statusCode >= 200 && statusCode < 300) {
        return response || {};
      }
      if (custom?.toast !== false) uni.showToast({ icon: 'error', title: data.message });
      return Promise.reject(data);
    },
    (response: HttpError) => {
      const statusCode = response.statusCode;
      const custom = response.config?.custom;
      if (custom?.loading !== false) uni.hideLoading();
      if (custom?.toast !== false) {
        const message = statusCode ? httpErrorMessages(statusCode) : '网络连接异常,请稍后再试!';
        uni.showToast({ icon: 'error', title: message });
      }
      return Promise.reject(response);
    },
  );
}

export { requestInterceptors, responseInterceptors };
