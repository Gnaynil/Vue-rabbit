import { useUserStore } from "@/stores/user";

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

//设置请求拦截器 
httpInstance.interceptors.request.use(config => {
    // 1.从pinia获取token数据
    const userStore = useUserStore()
    // 2.按照后端要求拼接token数据
    const token = userStore.userInfo.token
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, e => Promise.reject(e))

//设置响应拦截器 
httpInstance.interceptors.response.use(res => {
    return res.data
}, e => {
    const userStore = useUserStore()
    //统一错误提示
    ElMessage({
        type: 'warning',
        message: e.response.data.message
    })

    //401tokenb失效处理
    //1.清楚本地用户数据
    //2.跳转到登录页
    if(e.response.status === 401){
        userStore.clearUserInfo()
        router.push('/login')
    }

})

export default httpInstance;