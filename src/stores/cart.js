// 封装购物车模块

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { computed } from 'vue';
import { useUserStore } from './user';
import { insertCartAPI, findNewCartListAPI, delCartAPI, changeCartAPI } from '@/apis/cart.js'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)

  // 1. 定义state - cartList
  const cartList = ref([])

  //获取最新购物车列表
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 2. 定义action - addCart
  const addCart = async (goods) => {
    // console.log('添加', goods)
    const { skuId, count } = goods
    if (isLogin.value) {
      //登录之后加入购物车逻辑
      // console.log('登录了');
      await insertCartAPI({ skuId, count })
      updateNewList()
    }
    else {
      // 添加购物车操作
      // 已添加过 - count + 1
      // 没有添加过 - 直接push
      // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        // 找到了
        item.count++
      } else {
        // 没找到
        cartList.value.push(goods)
      }
    }

  }
  //删除购物车
  const delCart = async (skuId) => {
    if (isLogin.value) {
      //数据库删除
      //登录之后删除购物车逻辑
      await delCartAPI([skuId])
      updateNewList()
    }
    //思路:
    //1.找到要删除项的下标值 -splice
    //2.使用数组的过滤方法
    //本地删除
    const idx = cartList.value.findIndex((item) => skuId === item.skuId)
    cartList.value.splice(idx, 1)
  }
  //修改购物车单品
  const changeCart = async () => {
    cartList.value.forEach(async (item) => {
      //判断改变了的单品,修改数据库
      if (item.change) {
        await changeCartAPI(item.skuId, item)
      }
    })
    setTimeout(() => {
      updateNewList()
    }, 1000)


  }

  //登出后清楚购物车
  const clearCart = () => {
    cartList.value = []
  }


  //单选功能
  const singleCheck = (skuId, selected) => {
    //通过skuId找到要修改的那一项,然后把它的selected修改为传过来的selected
    const item = cartList.value.find((item) => { return item.skuId === skuId })
    item.selected = selected
    // console.log(item.selected, 'singleCheck');
    //单品已改变
    item.change = true
  }
  // 全选功能action
  const allCheck = (selected) => {
    // 把cartList中的每一项的selected都设置为当前的全选框状态
    cartList.value.forEach(item => {
      item.selected = selected
      //单品已改变
      item.change = true
    })
  }

  // 是否全选计算属性
  const isAll = computed(() => cartList.value.every((item) => item.selected))

  //计算属性
  //1.总的数量 所以项的count之和
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
  //2.总价 所以项count*price之和
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
  // 3. 已选择数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
  // 4. 已选择商品价钱合计
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))
  return {
    cartList,
    addCart,
    delCart,
    changeCart,
    allCount,
    allPrice,
    singleCheck,
    allCheck,
    isAll,
    selectedCount,
    selectedPrice,
    clearCart,
    updateNewList,
  }
}, {
  persist: true,
})