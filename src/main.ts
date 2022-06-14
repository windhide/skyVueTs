import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/routerIndex'
import store from '@/store/storeIndex'
import vuex from 'vuex'
import ElementPlus from 'element-plus'
import axios from '@/apis/axiosApi'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ServerDataRequest, colorFuntion, notify_messeage } from '@/apis/defineFunction'
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, { locale })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
} // element-plus icon全局注册
// app.use(vuex)
app.config.globalProperties.vuex = vuex
app.config.globalProperties.$axios = axios //全局注册，使用方法为:this.$axios   axios
app.config.globalProperties.$staticData = "/api/image/" // 静态资源用的全局url
app.config.globalProperties.ServerDataRequest = ServerDataRequest // 对应的全局方法 getdata
app.config.globalProperties.colorFuntion = colorFuntion // 对应的全局方法 colorFuntion
app.config.globalProperties.notify_messeage = notify_messeage // 对应的全局方法 notify_messeage

app.mount('#app')
