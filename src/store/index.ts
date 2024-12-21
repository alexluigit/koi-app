import type { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

function setupStore(app: App) {
  const store = createPinia();

  const piniaPersist = createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  });
  store.use(piniaPersist);

  app.use(store);
}

export * from './modules/address';
export * from './modules/app';
export * from './modules/user';
export default setupStore;
