const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  backColor: state => state.color.backColor,
  textColor: state => state.color.textColor,
  btnColor: state => state.color.btnColor,
  pagesizes_setting: state => state.user.pagesizes,
  pagesize_setting: state => state.user.pagesize
}
export default getters
