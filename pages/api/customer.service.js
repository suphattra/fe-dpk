import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';
export const CustomerService = {
    getCustomerList,
    getCustomerDetail,
    updateCustomer,
    createCustomer,
    packageCustomer
};

async function getCustomerList(param) {
    try {
        return http.get(`/nx/v1/customer`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getCustomerDetail(param) {
    try {
        return http.get(`/nx/v1/customer/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateCustomer(param, data) {
    try {
        return http.put(`/nx/v1/customer/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createCustomer(data) {
    try {
        return http.post(`/nx/v1/customer`, data);
    } catch (err) {
        console.log(err)
    }
}


async function packageCustomer(id, customerId) {
    let userId = authService.getUserId()
    try {
        return http.get(`/nx/v1/job/customer-package?userId=${userId}&customerId=${customerId}`);
    } catch (err) {
        console.log(err)
    }
}