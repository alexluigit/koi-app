import App from '@/App.vue';
import setupStore from '@/store';
// import setupPermission from '@/utils/permission';
import setupRequest from '@/utils/request';
import { createSSRApp } from 'vue';

export function createApp() {
  const app = createSSRApp(App);

  app.use(setupStore);
  // app.use(setupPermission);
  app.use(setupRequest);

  return {
    app,
  };
}
