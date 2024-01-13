import { authService } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';
export const EmployeeService = {
    getEmployeeList,
    getEmployeeDetail,
    updateEmployee,
    createEmployee,
    getEmployeeUnassignList,
    getEmployeeFinancialsList,
    getEmployeeFinancialsDetail,
    updateEmployeeFinancials,
    createEmployeeFinancials
};

async function getEmployeeList(param) {
    try {
        return http.get(`/v1/employee`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getEmployeeDetail(param) {
    try {
        return http.get(`/v1/employee/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateEmployee(param, data) {
    try {
        return http.put(`/v1/employee/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createEmployee(data) {
    try {
        return http.post(`/v1/employee`, data);
    } catch (err) {
        console.log(err)
    }
}
async function getEmployeeUnassignList(param) {
    try {
        return http.get(`/v1/employee/unassign/timesheet`, param);
    } catch (err) {
        console.log(err)
    }
}

async function getEmployeeFinancialsList(param) {
    try {
        return http.get(`/v1/employees-financials`, param);
    } catch (err) {
        console.log(err)
    }
}

async function getEmployeeFinancialsDetail(param) {
    try {
        return http.get(`/v1/employees-financials/${param}`);
    } catch (err) {
        console.log(err)
    }
}
async function updateEmployeeFinancials(param, data) {
    try {
        return http.put(`/v1/employees-financials/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createEmployeeFinancials(data) {
    try {
        return http.post(`/v1/employees-financials`, data);
    } catch (err) {
        console.log(err)
    }
}