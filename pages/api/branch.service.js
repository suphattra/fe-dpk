import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';
export const BranchService = {
    getBranchList,
    getBranchDetail,
    updateBranch,
    createBranch
};

async function getBranchList(param) {
    try {
        return http.get(`/v1/branch`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getBranchDetail(param) {
    try {
        return http.get(`/v1/branch/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateBranch(param, data) {
    try {
        return http.put(`/v1/branch/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createBranch(data) {
    try {
        return http.post(`/v1/branch`, data);
    } catch (err) {
        console.log(err)
    }
}
