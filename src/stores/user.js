// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { mergeCartAPI } from '@/apis/cart'
import { useCartStore } from './cart'

export const useUserStore = defineStore('user', () => {
    const CartStore = useCartStore()
    // 1. 定义管理用户数据的state
    const userInfo = ref({})
    // 2. 定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        userInfo.value = res.result
        //合并购物车操作
        // await mergeCartAPI(CartStore.cartList.map(item=>{
        //     return {
        //         skuId:item.skuId,
        //         selected:item.selected,
        //         count:item.count
        //     }
        // }))
        await mergeCartAPI(CartStore.cartList)
        CartStore.updateNewList()
    }
    //退出时清楚用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
        //执行清楚购物车
        CartStore.clearCart()
    }
    // 3. 以对象的格式把state和action return
    return {
        getUserInfo,
        userInfo,
        clearUserInfo
    }
}, {
    persist: true,
})