import jwt from 'jwt-decode'
import { http } from '../dpk/http.endpoint.dpk';
export const authService = {
    getToken,
    authentication,
    logout,
    getUserId
};

export function getUser() {
    return localStorage.getItem('username');
}

export function getUserId() {
    return localStorage.getItem('userId');
}

export function getToken() {
    const currentUser = localStorage.getItem('accessToken');
    if (currentUser) {
        const user = jwt(currentUser);
        if (Date.now() >= user.exp * 1000) {
            return false
        }
        return true;
    } else {
        return false
    }
}

export function authHeader() {
    const currentUser = localStorage.getItem('accessToken');
    if (currentUser) {
        return {
            ContentType: 'application/json',
            Authorization: `${currentUser}`
        };
    } else {
        return {};
    }
}
export function authHeaderFile() {
    const currentUser = localStorage.getItem('accessToken');
    if (currentUser) {
        return {
            // "Content-Type": "multipart/form-data",
            Authorization: `${currentUser}`,
            responseType: 'arraybuffer',
        };
    } else {
        return {};
    }
}
function authentication(param) {
    try {
        return http.post(`/nx/v1/auth/login/admin`, {
            userName: param.username,
            password: param.password
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.resultCode === '20000') {
                    localStorage.setItem('username', response.data.resultData.email);
                    localStorage.setItem('userId', response.data.resultData.userId);
                    localStorage.setItem('accessToken', response.data.resultData.accessToken);
                }
                return response;
            }
        })
            .catch(function (error) {
                if (error.resultCode === "40100") {
                    let ret = {
                        data: '',
                        resultDesc: error.resultDesc,
                        resultCode: error.resultCode
                    }
                    return ret;
                } else if (error.response) {
                    let ret = {
                        data: '',
                        resultDesc: error.response.data.resultDescription,
                        resultCode: error.response.data.resultCode
                    }
                    return ret;
                }
            });
    } catch (err) {
        console.log(err)
    }
}

async function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    return true
}