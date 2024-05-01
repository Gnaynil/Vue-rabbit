import httpInstance from "@/utils/http";

export function loginAPI({account,password}){
    return httpInstance({
        method:'POST',
        url:'/login',
        data:{
            account,
            password
        }
    })
}