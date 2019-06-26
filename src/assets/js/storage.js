var storage = {
  /**
     对本地数据进行操作的相关方法，如localStorage,sessionStorage的封装
      $this.$storage.setStorage("MasterBillNumber", number);  进港信息接收 传总单号和代理人 给 分单详情
      $this.$storage.setStorage("FreightForwarderCode", freightForwarder);

      //理货子页面传参
      $this.$storage.setStorage("TallyMasterBillId", this.currentRow.masterAirwayBillId);
      $this.$storage.setStorage("TallyMasterBillNumber", this.currentRow.masterAirwayBillNumber);
      $this.$storage.setStorage("TallyFreightForwarderName", this.currentRow.companyName);
    */
  setStorage: function(key, value) {
    var str = JSON.stringify(value)
    localStorage[key] = str
  },
  getStorage: function(key) {
    var data = localStorage[key]
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  },
  removeStorage: function(key) {
    localStorage.removeItem(key)
  },
  getSession: function(key) {
    var data = sessionStorage[key]
    return data
  },
  setSession: function(key, value) {
    sessionStorage[key] = value
  }
}
export default storage
