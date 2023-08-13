import { authHeader, authHeaderFile } from './auth/auth-service';
import { http } from './dpk/http.endpoint.dpk';

export const DriverService = {
    getDriverList,
    getDriverDetail,
    updateDriver,
    createDriver,
    deleteDriver,
    updateStatusDriver,
    createJobType,
    deleteJobType,
    attachfile,
    getAttachDriver,
    deleteAttachfile,
    getDownloadFile,
    getAttorney,
    addAttorney,
    deleteAttorney
};

async function getDriverList(param) {
    try {
        return http.get(`/nx/v1/driver`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getDriverDetail(param) {
    try {
        return http.get(`/nx/v1/driver/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateDriver(param, data) {
    try {
        return http.put(`/nx/v1/driver/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}

async function updateStatusDriver(data) {
    try {
        return http.put(`/nx/v1/driver/change-status`, data);
    } catch (err) {
        console.log(err)
    }
}
async function deleteDriver(param, data) {
    try {
        return http.put(`/nx/v1/driver/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createDriver(data) {
    try {
        return http.post(`/nx/v1/driver`, data);
    } catch (err) {
        console.log(err)
    }
}

async function createJobType(data) {
    try {
        return http.post(`/nx/v1/driver/job-type`, data);
    } catch (err) {
        console.log(err)
    }
}

async function deleteJobType(param) {
    try {
        return http.del(`/nx/v1/driver/job-type/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function attachfile(data) {
    try {
        return http.post(`/nx/v1/driver/attach`, data);
    } catch (err) {
        console.log(err)
    }
}
async function deleteAttachfile(param) {
    try {
        return http.del(`/nx/v1/driver/attach/${param}`);
    } catch (err) {
        console.log(err)
    }
}
async function getAttachDriver(param) {
    try {
        return http.get(`/nx/v1/driver/attach/list/${param}`);
    } catch (err) {
        console.log(err)
    }
}
async function getDownloadFile(param) {
    try {
        return http.getfile(`/nx/v1/driver/attach/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function getAttorney(param) {
    try {
        return http.get(`/nx/v1/driver/attorney`, param);
    } catch (err) {
        console.log(err)
    }
}

async function addAttorney(data) {
    try {
        return http.post(`/nx/v1/driver/attorney`, data);
    } catch (err) {
        console.log(err)
    }
}
async function deleteAttorney(data) {
    try {
        return http.del(`/nx/v1/driver/attorney`, data);
    } catch (err) {
        console.log(err)
    }
}
