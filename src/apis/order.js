import httpInstance from "@/utils/http";

/*
params: {
orderState:0,
page:1,
pageSize:2
}
*/
// 获取订单列表
export const getUserOrder = (params) => {
  return httpInstance({
    url: '/member/order',
    method: 'GET',
    removeCache: true, // 配置标识 则这个请求如果频繁请求 则会中断上次请求保留最新一次请求
    params
  })
}
//获取订单详情
export const getOrderInfoAPI = (id) => {
  return httpInstance({
    url: `/member/order/${id}`,
    method: 'GET'
  })
}

//删除订单 仅在仅在订单状态为待评价，已完成，已取消时，可删除订单。
export const deleteOrder = (ids) => {
  return httpInstance({
    url: '/member/order',
    method: 'DELETE',
    data: {
      ids
    }
  })
}
//再次购买订单 仅在仅在订单状态为待发货，待收货,待评价，已完成，可再次购买
export const repurchaseOrderAPI = (id)=>{
  return httpInstance({
    url:`/member/order/repurchase/${id}`,
    method:'GET'
  })
}
//取消订单
export const cancelOrderAPI = (id, reason) => {
  return httpInstance({
    url: `/member/order/${id}/cancel`,
    method: 'PUT',
    data: {
      reason
    }
  })
}
//模拟发货 DEV环境
export const getMemberOrderConsignmentAPI = (id) => {
  return httpInstance({
    url: `/member/order/consignment/${id}`,
    method: 'GET',
  })
}

//查看物流信息 仅在订单状态为待收货，待评价，已完成时，可获取物流信息。
export const getMemberOrderLogisticsAPI = (id) => {
  return httpInstance({
    url: `/member/order/${id}/logistics`,
    method: 'GET',
  })
}
//确认收货 仅在订单状态为待收货时，可确认收货。
export const putMemberOrderReceiptAPI = (id) => {
  return httpInstance({
    url: `/member/order/${id}/receipt`,
    method: 'PUT',
  })
}
