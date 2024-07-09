import { useUserStore } from "@/stores/user";
import { useOrderStore } from '@/stores/order';

import axios from "axios";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import router from '@/router'
//创建axios实例
const httpInstance = axios.create({
    baseURL: "http://pcapi-xiaotuxian-front-devtest.itheima.net",
    //响应时间50s
    timeout: 50000
})

//重复调用请求，中断上一个重复请求
// isCancel-取消标识 用于判断请求是不是被AbortController取消的
const { isCancel } = axios
const cacheRequest = {}
// 删除缓存队列中的请求
function removeCacheRequest(reqKey) {
    if (cacheRequest[reqKey]) {
        // 通过AbortController实例上的abort来进行请求的取消
        cacheRequest[reqKey].abort()
        delete cacheRequest[reqKey]
    }
}


//设置请求拦截器 
httpInstance.interceptors.request.use(config => {
    // 1.从pinia获取token数据
    const userStore = useUserStore()
    // 2.按照后端要求拼接token数据
    const token = userStore.userInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // removeCache - 是config里配置的是否清除相同请求的标识，不传则默认是不需要清除
    // 此处根据实际需求来 如果需要全部清除相同的请求功能 则默认为true 或者增加白名单
    const { url, method, removeCache = false } = config
    if (removeCache) {
        // 请求地址和请求方式组成唯一标识，将这个标识作为取消函数的key，保存到请求队列中
        const reqKey = `${url}&${method}`
        // 如果config传了需要清除重复请求的removeCache，则如果存在重复请求，删除之前的请求
        removeCacheRequest(reqKey)
        // 将请求加入请求队列，通过AbortController来进行手动取消
        const controller = new AbortController()
        config.signal = controller.signal
        cacheRequest[reqKey] = controller
    }
    return config
}, e => Promise.reject(e))

//设置响应拦截器 
httpInstance.interceptors.response.use(res => {
    // 请求成功，从队列中移除
    const { url, method, removeCache = false } = res.config
    if (removeCache) removeCacheRequest(`${url}&${method}`)
    return res.data
}, e => {
    if (isCancel(e)) {
        // 通过CancelToken取消的请求不做任何处理
        return Promise.reject({
            message: '重复请求，自动拦截并取消'
        })
    }
    const userStore = useUserStore()
    //统一错误提示
    ElMessage({
        type: 'warning',
        message: '获取数据失败'
    })
    const orderStore = useOrderStore()
    orderStore.getdataState = false;
    //401tokenb失效处理
    //1.清楚本地用户数据
    //2.跳转到登录页
    if (e.response?.status === 401) {
        userStore.clearUserInfo()
        router.push('/login')
    }
})

export default httpInstance;