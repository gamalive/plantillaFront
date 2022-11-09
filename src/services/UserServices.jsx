import { routeOrigin } from './OriginURL'

async function PostLogin(url, form) {
    const data = JSON.stringify(
        {
            ...form
        }
    )
    const response = await fetch(`${routeOrigin}${url}`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }
    )
    return await response
}


function logout() {
    localStorage.removeItem('authUser')
}

export function Exit() {
    localStorage.removeItem('authUser')
    window.location.href = '/auth/login'

}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout()
                // eslint-disable-next-line no-restricted-globals
                location.reload(true)
            }
            const error = (data && data.message) || response.statusText
            return Promise.reject(error)
        }
        return data
    })
}

async function login(data) {


    let user = await PostLogin('Login/auth/login', data)

    user = await handleResponse(user)
    if (user) {
        user.authdata = window.btoa(data)

        localStorage.setItem('authUser', JSON.stringify(user))
    }

    return user
}

export const userService = { login, logout, Exit }