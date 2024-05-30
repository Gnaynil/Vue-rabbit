import httpInstance from "@/utils/http";

export function loginAPI({ account, password }) {
  return httpInstance({
    method: 'POST',
    url: '/login',
    data: {
      account,
      password
    }
  })
}

export const getLikeListAPI = ({ limit = 4 }) => {
  return httpInstance({
    url: '/goods/relevant',
    params: {
      limit
    }
  })
}

