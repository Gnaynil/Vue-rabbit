import httpInstance from '@/utils/http.js'

export const changeAddressAPI = (id,data) =>{
    return httpInstance({
        method:'PUT',
        url:`/member/address/${id}`,
        data
    })
}
export const addAddressAPI = (data)=>{
    return httpInstance({
        method:'POST',
        url:'/member/address',
        data
    })
}
export const getAddressAPI = ()=>{
    return httpInstance({
        method:'GET',
        url:'/member/address'
    })
}
export const delAddressAPI = (id)=>{
    return httpInstance({
        method:'DELETE',
        url:`/member/address/${id}`
    })
}