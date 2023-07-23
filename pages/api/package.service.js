import { http } from './nxrider/http.endpoint.nxrider';

export const PackageService = {
    getPackageList,
    getPackageDetail,
    updatePackage,
    createPackage
};

async function getPackageList(param) {
    try {
        return http.get(`/nx/v1/package`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getPackageDetail(param, query) {
    try {
        return http.get(`/nx/v1/package/${param}`, query);
    } catch (err) {
        console.log(err)
    }
}

async function updatePackage(param, data) {
    try {
        return http.put(`/nx/v1/package/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createPackage(data) {
    try {
        return http.post(`/nx/v1/package`, data);
    } catch (err) {
        console.log(err)
    }
}