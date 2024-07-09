
//引入初始化样式文件
import '@/styles/common.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
// 加载方法插件并且注册
import { lazyPlugin, copyText } from './directives/index';
//加载组件插件并且注册
import { componentPlugin } from '@/components/index';
const app = createApp(App)
const pinia = createPinia()
//注册持久化插件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(copyText)
app.use(componentPlugin)


app.mount('#app')

