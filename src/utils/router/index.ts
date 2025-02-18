import pagesJson from '@/pages.json';

export const HOME_PATH = '/pages/home/home';
export const USER_PATH = '/pages/user/user';
export const LOGIN_PATH = '/pages/account/login';
export const ERROR404_PATH = '/pages/common/404';

/**
 * Parse the routes defined in pages.json
 * @param {object} pagesJson
 * @returns [{"path": "/pages/home/home","login": false},...]
 */
function parseRoutes(pagesJson = {} as any) {
  if (!pagesJson.pages) {
    pagesJson.pages = [];
  }
  if (!pagesJson.subPackages) {
    pagesJson.subPackages = [];
  }

  function parsePages(pages = [] as any, rootPath = '') {
    const routes = [];
    for (let i = 0; i < pages.length; i++) {
      routes.push({
        path: rootPath ? `/${rootPath}/${pages[i].path}` : `/${pages[i].path}`,
        login: pages[i].login === true,
      });
    }
    return routes;
  }

  function parseSubPackages(subPackages = [] as any) {
    const routes = [];
    for (let i = 0; i < subPackages.length; i++) {
      routes.push(...parsePages(subPackages[i].pages, subPackages[i].root));
    }
    return routes;
  }

  return [
    ...parsePages(pagesJson.pages),
    ...parseSubPackages(pagesJson.subPackages),
  ];
}
export const routes = parseRoutes(pagesJson);

/**
 * @returns {string} current route
 */
export function currentRoute(): string {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  return currentPage?.$page?.fullPath || currentPage.route;
}

/**
 * Get rid of query string in a path
 * @param {string} path - the original path
 * @returns {string} path get `?*` stripped
 */
export function sanitizePath(path: string = ''): string {
  return path.split('?')[0];
}

/**
 * Check if the path exists
 * @param {string} path
 * @returns {boolean} whether the path exists or not
 */
export function isPathExists(path: string = ''): boolean {
  const cleanPath = sanitizePath(path);
  return routes.some(item => item.path === cleanPath);
}

/**
 * Check if the path is one of the tabbar page
 * @param {string} path
 */
export function isTabBarPath(path: string = ''): boolean {
  const cleanPath = sanitizePath(path);
  return (
    pagesJson.tabBar?.list?.some(
      item => `/${item.pagePath}` === cleanPath,
    ) === true
  );
}
