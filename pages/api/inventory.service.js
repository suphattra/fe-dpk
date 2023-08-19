import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';
export const InventoryService = {
    getInventoryList,
    getInventoryDetail,
    updateInventory,
    createInventory
};

async function getInventoryList(param) {
    try {
        return http.get(`/v1/inventories`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getInventoryDetail(param) {
    try {
        return http.get(`/v1/inventories/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateInventory(param, data) {
    try {
        return http.put(`/v1/inventories/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createInventory(data) {
    try {
        return http.post(`/v1/inventories`, data);
    } catch (err) {
        console.log(err)
    }
}
