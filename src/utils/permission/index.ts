import {
  ERROR404_PATH,
  isPathExists,
  LOGIN_PATH,
  removeQueryString,
  routes,
} from '@/router';
import { isLogin } from '@/utils/auth';

const whiteList = ['/'];
routes.forEach((item) => {
  if (item.needLogin !== true) {
    whiteList.push(item.path);
  }
});

/**
 * Permission check
 * @param {string} path
 * @returns {boolean} whether the user has the permission to the path
 */
export function hasPerm(path: string = ''): boolean {
  if (!isPathExists(path) && path !== '/') {
    uni.redirectTo({
      url: ERROR404_PATH,
    });
    return false;
  }
  const hasPermission
    = whiteList.includes(removeQueryString(path)) || isLogin();
  if (!hasPermission) {
    uni.redirectTo({
      url: `${LOGIN_PATH}?redirect=${encodeURIComponent(path)}`,
    });
  }
  return hasPermission;
}

// https://uniapp.dcloud.net.cn/api/interceptor.html
function setupPermission() {
  // 注意：拦截uni.switchTab本身没有问题。但是在微信小程序端点击tabbar的底层逻辑并不是触发uni.switchTab。
  // 所以误认为拦截无效，此类场景的解决方案是在tabbar页面的页面生命周期onShow中处理。
  ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].forEach((item) => {
    uni.addInterceptor(item, {
      // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
      invoke(args) {
        // args为所拦截api中的参数，比如拦截的是uni.redirectTo(OBJECT)，则args对应的是OBJECT参数
        return hasPerm(args.url);
      },
    });
  });
}

export default setupPermission;
