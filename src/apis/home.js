import httpInstance from "@/utils/http";

export function getBannerAPI(params={}) {
    //默认为1 商品为2
    const {distributionSite='1'} = params
    return httpInstance({
        method: 'get',
        url: 'home/banner',
        params:{
            distributionSite
        }
    })
}

export const findNewAPI = () => {
    return httpInstance({
        method: 'get',
        url: '/home/new'
    })
}

export const getHotAPI = ()=>{
    return httpInstance({
        method:'get',
        url:'home/hot'
    })
}
export function getGoodsAPI(){
    return httpInstance({
        method:"get",
        url:'/home/goods'
    })
}