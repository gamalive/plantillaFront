import { routeOrigin } from './OriginURL'

export async function GetRoute(url) {
    const response = await fetch(`${routeOrigin}${url}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("authUser")).token}`
        }
    })
        .then(function (data) {
            return data.json()
        })
        .catch(function (data) {
            return []
        })
    return await response
}
export async function PostRoute(url, form) {

    const data = JSON.stringify({
        // idUsuario: JSON.parse(localStorage.getItem("authUser")).id,
        usuario: 1,
        ...form
    })

    const response = await fetch(`${routeOrigin}${url}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("authUser")).token}`
        },
        body: data
    })
        .then(function (data) {
            // StatusCode(data)
            return data.json()
        })
        .catch(function (data) {
            // StatusCode(data)
            return []
        })

    return await response
}

export default {
    GetRoute,
    PostRoute
}
