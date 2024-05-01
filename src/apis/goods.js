import httpInstance from '@/utils/http.js'

export function getDetail(id){
    return httpInstance({
        method:'get',
        url:'/goods',
        params:{
            id
        }
    })
}

export function fetchHotGoodsAPI({ id, type, limit = 3 }) {
    return httpInstance({
        method: 'get',
        url: '/goods/hot',
        params: {
            id,
            type,
            limit
        }
    })
}