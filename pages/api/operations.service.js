import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';

export const OperationsService = {
    getOperationsList,
    getOperationsDetail,
    updateOperations,
    createOperations,

};

async function getOperationsList(param) {
    try {
        return http.get(`/v1/operations`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getOperationsDetail(param) {
    try {
        return http.get(`/v1/operations/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateOperations(param, data) {
    try {
        return http.put(`/v1/operations/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createOperations(data) {
    try {
        return http.post(`/v1/operations`, data);
    } catch (err) {
        console.log(err)
    }
}