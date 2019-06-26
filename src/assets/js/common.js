import Vue from 'vue'

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      if (j === 'timestamp') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    })
  )
}

export default {
  install(Vue, options) {
    Vue.prototype.validateForm = function(ref, formName, success) {
      ref.$refs[formName].validate(function(valid) {
        if (valid) {
          success()
        } else {
          return false
        }
      })
    }

    Vue.prototype.message_OK = function(ref, message) {
      ref.$message({
        message: message,
        type: 'success',
        duration: 2000
      })
    }

    Vue.prototype.message_WARN = function(ref, message) {
      ref.$message({
        message: message,
        type: 'warning',
        duration: 2000
      })
    }

    Vue.prototype.message_INFO = function(ref, message) {
      ref.$message({
        message: message,
        type: 'info',
        duration: 2000
      })
    }

    Vue.prototype.message_ERROR = function(ref, message) {
      ref.$message({
        message: message,
        type: 'error',
        duration: 2000
      })
    }

    Vue.prototype.confirm_Pop = function(ref, message, success) {
      ref.$confirm(message, '提示', {
        customClass: 'confirmDialog',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        type: 'warning',
        callback: function(info) {
          if (info == 'confirm') {
            success()
          }
        }
      })
    }

    Vue.prototype.export2Excel = function(tabelData, fileName) {
      var cols = tabelData.length > 0 ? Object.keys(tabelData[0]) : null
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = cols
        const filterVal = cols
        const list = tabelData
        const data = formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName
        })
      })
    }
  }
}
