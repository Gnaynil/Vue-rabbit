import httpInstance from "@/utils/http";

export function getBannerAPI() {
    return httpInstance({
        method: 'get',
        url: 'home/banner'
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