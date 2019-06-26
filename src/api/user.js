import request from '@/utils/request'

export function login(data) {
  var rememberClient = false
  return request({
    url: 'Anonymous/TokenAuth/Authenticate',
    method: 'post',
    data: {
      userNameOrEmailAddress: data.username,
      password: data.password,
      rememberClient
    }
  })
}

export function getInfo() {
  return request({
    url: 'Authorize/services/app/User/GetUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function searchUser(data) {
  return request({
    url: 'Authorize/services/app/User/SearchUser',
    method: 'post',
    data
  })
}

export function getAllRoles() {
  return request({
    url: 'Authorize/services/app/Role/GetAllRoles',
    method: 'get'
  })
}

export function getSystemInfo(SystemType) {
  return request({
    url: 'Authorize/services/app/Configuration/GetSystemInfo',
    method: 'get',
    params: { SystemType }
  })
}

export function getUserInfoById(id) {
  return request({
    url: 'Authorize/services/app/User/GetUserInfoById',
    method: 'get',
    params: { id }
  })
}

export function createOrUpdateUser(data) {
  return request({
    url: 'Authorize/services/app/User/CreateOrUpdateUser',
    method: 'post',
    data
  })
}

export function batchDeleteUser(data) {
  return request({
    url: 'Authorize/services/app/User/BatchDeleteUser',
    method: 'post',
    data
  })
}

export function batchEnableUser(data) {
  return request({
    url: 'Authorize/services/app/User/BatchEnableUser',
    method: 'post',
    data
  })
}

export function batchDisableUser(data) {
  return request({
    url: 'Authorize/services/app/User/BatchDisableUser',
    method: 'post',
    data
  })
}

export function batchUnlockUser(data) {
  return request({
    url: 'Authorize/services/app/User/BatchUnlockUser',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: 'Authorize/services/app/User/ResetPassword',
    method: 'post',
    data
  })
}
