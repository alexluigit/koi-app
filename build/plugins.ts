import type { PluginOption } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import ViteRestart from 'vite-plugin-restart';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import viteImagemin from 'vite-plugin-imagemin';

/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 *  - 按需加载，自动引入
 *  - 在修改vite.config.js文件则不需要重新运行也生效配置
 *  - build 时进行图片压缩
 */
export default function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dts: 'types/auto-imports.d.ts',
      vueTemplate: true,
    }),
    // 自动按需引入组件 (注意：需注册至 uni 之前，否则不会生效)
    Components({ dts: 'types/components.d.ts' }),
    uni(),
    ViteRestart({ restart: ['vite.config.ts'] })
  ];

  if (isBuild) {
    const buildPlugins: (PluginOption | PluginOption[])[] = [
      viteImagemin({
        optipng: {
          optimizationLevel: 7,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        }
      })
    ];
    vitePlugins.push(...buildPlugins);
  }

  return vitePlugins;
}
