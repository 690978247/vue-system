import request from '@/utils/request'

// 获取不是禁用的代理人
export function getEnableCompany() {
  return request({
    url: 'OperationAssistance/services/app/CommonService/GetEnableCompany',
    method: 'get'
  })
}

// 获取数据字典
export function getCodeData(codeCategoryGroup, categoryCode, isSync = true) {
  return request({
    url: 'Authorize/services/app/CommonService/GetCodeCategory',
    method: 'get',
    async: isSync,
    params: { codeCategoryGroup, categoryCode }
  })
}
