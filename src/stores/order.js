//封装订单模块
import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserOrder, getMemberOrderConsignmentAPI, getMemberOrderLogisticsAPI, putMemberOrderReceiptAPI, cancelOrderAPI } from '@/apis/order.js'
import { ElMessage } from 'element-plus';
export const useOrderStore = defineStore('order', () => {


    //定义state -orderList
    const orderList = ref({})
    //默认loading开启
    const showLoading = ref(true)
    //数据是否获取成功 默认为true
    const getdataState = ref(true)

    //初始化更新判断
    const updated = ref([])
    for (let i = 0; i < 7; i++) {
        updated.value[i] = false
    }
    //设置订单分页参数 orderParamsState是索引
    const orderParamsState = ref(0)
    const params = ref({ page: 1, pageSize: 10 }
    )
    //订单总数
    const total = ref([])
    for (let i = 0; i < 7; i++) {
        total.value[i] = 0
    }


    //获取全部订单列表
    const updateNewOrderList = async (orderState) => {
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
        getdataState.value = true
        //获取订单数据
        const res = await getUserOrder({
            orderState: orderParamsState.value,
            ...params.value
        })
        if (res !== void 0) {
            updated.value[orderParamsState.value] = true
            orderList.value[orderParamsState.value] = res.result.items
            total.value[orderParamsState.value] = res.result.counts
            //关闭Loading
            showLoading.value = false
        }
    }

    //切换Tab
    const handleTabsChange = (tab) => {
        orderParamsState.value = tab.index;
        params.value.page = 1
        updateNewOrderList()
    }
    //切换分页
    const handlePagesChange = (page) => {
        //切换分页
        params.value.page = page
        //重置更新判断
        updated.value[orderParamsState.value] = false
        //更新订单列表
        updateNewOrderList()
    }
    //模拟发货
    const onOrderSend = async (id) => {
        await getMemberOrderConsignmentAPI(id)
        ElMessage.success('模拟发货成功')
        updateNewOrderList()
    }
    //查看物流信息
    //物流列表
    const orderLogisticsList = ref([])
    //物流公司信息
    const orderLogisticsCompany = ref({})
    const getLogistics = async (id) => {
        const res = await getMemberOrderLogisticsAPI(id)
        orderLogisticsList.value = res.result.list
        orderLogisticsCompany.value = res.result.company
    }
    //确认收货 
    const receiptOrder = async (id) => {
        //提交确认收货
        await putMemberOrderReceiptAPI(id);
        //重置更新判断
        updated.value[orderParamsState.value] = false
        //更新订单列表
        updateNewOrderList()
    }
    //取消订单
    const handleCancelOrder = async (id, reason) => {
        await cancelOrderAPI(id, reason);
        updated.value[orderParamsState.value] = false
        updateNewOrderList()
    }


    return {
        updateNewOrderList,
        handleTabsChange,
        handlePagesChange,
        onOrderSend,
        getLogistics,
        receiptOrder,
        handleCancelOrder,
        orderList,
        total,
        showLoading,
        getdataState,
        updated,
        orderParamsState,
        params,
        orderLogisticsList,
        orderLogisticsCompany
    }
}, {
    persist: true
})