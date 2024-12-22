import type { UserConfig } from 'vite';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './build/plugins';
import { createViteProxy } from './build/proxy';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }): UserConfig => {
  console.log('command, mode -> ', command, mode);

  const { UNI_PLATFORM } = process.env;
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM); // 得到 mp-weixin, h5, app 等

  const env = loadEnv(mode, fileURLToPath(new URL('./env', import.meta.url)));
  console.log('环境变量 env -> ', env);

  const isBuild = process.env.NODE_ENV === 'production';
  return {
    envDir: './env',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number.parseInt(env.VITE_APP_PORT, 10),
      hmr: true,
      host: true,
      open: true,
      // proxy only works on h5, probably an issue of `vite-plugin-uni`
      proxy: createViteProxy(env),
    },
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    plugins: createVitePlugins(isBuild),
    esbuild: {
      drop: JSON.parse(env.VITE_DROP_CONSOLE) ? ['console', 'debugger'] : [],
    },
  };
});
