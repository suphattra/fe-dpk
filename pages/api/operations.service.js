import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';

export const OperationsService = {
    getOperationsList,
    getOperationsDetail,
    updateOperations,
    createOperations,
    getCostOfWorkPerBranch,
    costOfWorkPerTask,
    costOfWorkAllBranch

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
async function getCostOfWorkPerBranch(param) {
    try {
        return http.get(`/v1/dashboards/costOfWorkPerBranch`, param);
    } catch (err) {
        console.log(err)
    }
}
async function costOfWorkPerTask(param) {
    try {
        return http.get(`/v1/dashboards/costOfWorkPerTask`, param);
    } catch (err) {
        console.log(err)
    }
}
async function costOfWorkAllBranch(param) {
    try {
        return http.get(`/v1/dashboards/costOfWorkAllBranch`, param);
    } catch (err) {
        console.log(err)
    }
}

