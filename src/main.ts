import { createSSRApp } from "vue";
import uviewPlus from 'uview-plus';
import "uview-plus/index.scss";
import { setupStore } from '@/store'
import App from "./App.vue";
export function createApp() {
  const app = createSSRApp(App);
  // Configure store
  // 配置 store
  setupStore(app)
  app.use(uviewPlus)
  return {
    app,
  };
}
