//封装订单模块
import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserOrder } from '@/apis/order.js'
export const useOrderStore = defineStore('order', () => {


    //定义state -orderList
    const orderList = ref({})
    //默认loading开启
    const showLoading = ref(true)
    //初始化更新判断
    const updated = ref([])
    for (var i = 0; i < 6; i++) {
        updated.value[i] = false
    }

    //设置订单分页参数
    const orderParamsState = ref(0)
    let pageCase = {
        page: 1,
        pageSize: 10
    }
    const params = ref([])
    for (let i = 0; i < 6; i++) {
        params.value.push(pageCase)
    }
    //订单总数
    const total = ref([])
    for (let i = 0; i < 6; i++) {
        total.value[i] = 0
    }


    //获取全部订单列表
    const updateNewOrderList = async (orderState) => {
        console.log(total.value);
        console.log(params.value);
        //判断orderState是否传参
        if (orderState !== void (0)) {
            orderParamsState.value = orderState
        }
        //判断是否需要更新订单列表 
        if (updated.value[orderParamsState.value] === true) {
            showLoading.value = false
            return
        }
        //开启Loading
        showLoading.value = true
        //获取订单数据
        const res = await getUserOrder({
            orderState: orderParamsState.value,
            ...params.value[orderParamsState.value]
        })
        updated.value[orderParamsState.value] = true
        orderList.value[orderParamsState.value] = res.result.items
        total.value[orderParamsState.value] = res.result.counts
        //关闭Loading
        showLoading.value = false
    }

    //切换Tab
    const handleTabsChange = (tab) => {
        orderParamsState.value = tab.index;
        updateNewOrderList()
    }
    //切换分页
    const handlePagesChange = (page) => {
        params.value[orderParamsState.value].page = page
        updated.value[orderParamsState.value] = false
        updateNewOrderList()
    }
    return {
        updateNewOrderList,
        handleTabsChange,
        handlePagesChange,
        orderList,
        total,
        showLoading,
        updated,
        orderParamsState,
        params
    }
}, {
    persist: true
})