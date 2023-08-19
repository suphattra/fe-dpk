import axios from "axios"
import { authHeader, authHeaderFile, authService } from "../auth/auth-service"
const baseAPI = process.env.NODE_ENV === "development" ? "/api/dpk" : '/api/dpk'

const header = () => ({
  Authorization: `Bearer ${authService.getToken() || "unknown"}`
})

const get = async (url, filter = {}) => {
  const property = {
    method: "GET",
    url: baseAPI + url,
    params: filter,
    headers: authHeader()
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}

const post = (url, body) => {
  const property = {
    method: "POST",
    url: baseAPI + url,
    headers: authHeader(),
    data: body
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}

const patch = (url, body) => {
  const property = {
    method: "PATCH",
    url: baseAPI + url,
    headers: authHeader(),
    data: body
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}

const put = (url, body) => {
  const property = {
    method: "PUT",
    url: baseAPI + url,
    headers: authHeader(),
    data: body
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}

const del = (url, body) => {
  const property = {
    method: "DELETE",
    url: baseAPI + url,
    headers: authHeader(),
    data: body
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}

const getfile = async (url, filter = {}) => {
  const property = {
    method: "GET",
    url: baseAPI + url,
    params: filter,
    responseType: 'blob',
    headers: authHeaderFile()
  }
  return axios(property)
    .then(response => handleSuccess(response))
    .catch(error => handleError(error))
}
function handleSuccess(result) {
  if (result.status !== 200 && result.status !== 201) {
    throw result
  }
  return result
}

function handleError(error) {
  throw (error.response && error.response.data) || error || "System Error"
}

export const http = {
  get,
  post,
  patch,
  put,
  del,
  getfile
}
