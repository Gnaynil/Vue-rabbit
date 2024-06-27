import httpInstance from '@/utils/http'

export const getOrderAPI = (id) => {
  return httpInstance({
    url: `/member/order/${id}`
  })
}

//模拟支付
export const payMockAPI = (orderId) => {
  return httpInstance({
    url: '/pay/mock',
    method:'GET',
    params: {
      orderId
    }
  })
}