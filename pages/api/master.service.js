import { http } from './dpk/http.endpoint.dpk';

export const MasterService = {
    getConfig,
    getProvince,
    getDistrict,
    getSubDistrict,
    getZipcode,
    getSenderList,
    getPackageList
};

async function getConfig(param) {
    try {
        return http.get(`/nx/v1/config`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getProvince(param) {
    try {
        return http.get(`/nx/v1/province`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getDistrict(param) {
    try {
        return http.get(`/nx/v1/district`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getSubDistrict(param) {
    try {
        return http.get(`/nx/v1/sub-district`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getZipcode(param) {
    try {
        return http.get(`/nx/v1/zipcode`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getSenderList(param) {
    try {
        return http.get(`/nx/v1/sender`, param);
    } catch (err) {
        console.log(err)
    }
}

async function getPackageList(param) {
    try {
        return http.get(`/nx/v1/package`, param);
    } catch (err) {
        console.log(err)
    }
}
