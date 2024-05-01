import httpInstance from "@/utils/http";


export function getTopCategoryAPI (id){
    return httpInstance({
        method:'get',
        url:'/category',
        params:{
            id
        }
    })
}

export function getCategoryFilterAPI (id){
    return httpInstance({
        method:'get',
        url:'/category/sub/filter',
        params:{
            id
        }
    })
}

export function getSubCategoryAPI (data) {
    return httpInstance({
        method:'POST',
        url:'/category/goods/temporary',
        data
    })
}