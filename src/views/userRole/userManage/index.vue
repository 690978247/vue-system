<template>
  <!--   <section ref="page"> -->
  <el-container ref="page" class="page-container">
    <el-header ref="searchblock" class="searchblock" :class="[mixIsHideSearch ? '':'search-show']">
      <!-- 查询条件 -->
      <el-form
        :model="searchForm"
        label-position="right"
        :label-width="mixLabelWidth"
        class="formblock"
      >
        <el-row>
          <el-col :xs="21" :sm="21" :md="22" :lg="20" :xl="17">
            <el-row :gutter="10" class="row-height">
              <el-col class="input">
                <el-form-item label="用户名：">
                  <el-input v-model="searchForm.userName" />
                </el-form-item>
              </el-col>
              <el-col class="input">
                <el-form-item label="姓名：">
                  <el-input v-model="searchForm.name" />
                </el-form-item>
              </el-col>
              <el-col class="input">
                <el-form-item label="角色：">
                  <el-select v-model="searchForm.role" placeholder clearable>
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="row-height">
              <el-col class="input">
                <el-form-item label="代理人：">
                  <el-select v-model="searchForm.companyCode" placeholder clearable>
                    <el-option
                      v-for="item in freightForwarList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="input">
                <el-form-item label="手机号：">
                  <el-input v-model="searchForm.phone" />
                </el-form-item>
              </el-col>
              <el-col class="input">
                <el-form-item label="是否启用：">
                  <el-select v-model="searchForm.isActive" placeholder clearable>
                    <el-option
                      v-for="item in enableList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="3" :sm="3" :md="2" :lg="4" :xl="5">
            <el-button class="searchbtn margin-botom" @click="search">查 询</el-button>
            <br>
            <el-button class="cancelbtn" @click="clearSearch">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>

    <!-- 查询结果 -->

    <div class="collapseTab" :class="[mixIsHideSearch ? 'icon-down' : '']" />
    <span
      :class="[mixIsHideSearch ? 'collapseTab-down iconfont iconfangdajing' : 'collapseTab-up iconfont iconshuangjiantoushang']"
      @click="hideSearch"
    >{{ !mixIsHideSearch ? '收起' : '查询' }}</span>

    <el-main ref="result" class="resultblock">
      <div class="toolbar">
        <div class="btn pull-left" @click="openDiaolg">
          <i class="iconfont iconxinzeng icon" />新增
        </div>
        <div class="btn pull-left" @click="deleteUser">
          <i class="iconfont iconshanchu icon" />删除
        </div>
        <div class="btn pull-left" @click="activeUser">
          <i class="iconfont icontijiao icon" />启用
        </div>
        <div class="btn pull-left" @click="disActiveUser">
          <i class="iconfont iconjinzhi icon" />禁用
        </div>
        <div class="btn pull-left" @click="unlockUser">
          <i class="iconfont iconjiesuo icon" />解锁账号
        </div>
        <div class="btn pull-left" @click="resetPassword">
          <i class="iconfont iconmima icon" />重置密码
        </div>
      </div>

      <template>
        <el-table
          ref="querytabel"
          :data="querytabel"
          border
          stripe
          style="width: 100%"
          :max-height="mixTabelMaxHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop label="用户名" width="160">
            <template slot-scope="scope">
              <a
                class="table-a"
                href="javascript:void(0);"
                @click="userEdit(scope.row.id)"
              >{{ scope.row.userName }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="fullName" label="姓名" show-overflow-tooltip />
          <el-table-column prop label="角色" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.roleNames.join(',') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip />
          <el-table-column prop="post" label="岗位" show-overflow-tooltip />
          <el-table-column prop="companyName" label="代理人" show-overflow-tooltip />
          <el-table-column prop="phoneNumber" label="手机号" show-overflow-tooltip />
          <el-table-column prop="emailAddress" label="邮箱" show-overflow-tooltip />
          <el-table-column prop="isActiveDesc" label="是否启用" show-overflow-tooltip width="100" />
          <el-table-column prop="isLockedDesc" label="是否锁定" show-overflow-tooltip width="100" />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip width="160" />
        </el-table>
        <pagination
          v-show="total>0"
          ref="pagechild"
          :total="total"
          :page.sync="searchForm.page"
          :limit.sync="searchForm.maxResultCount"
          @pagination="query"
        />
      </template>
    </el-main>

    <!--     <iframe name="myiframe" id="myrame-record-query" src="http://172.26.1.11:68/#/login" frameborder="0" align="middle" width="100%" height="700px" scrolling="no">
    </iframe>-->
    <!-- 新增dialog -->
    <child-dialog
      :modal-form="userForm"
      :dialog-visible="dialogVisible"
      :company="freightForwarList"
      :is-edit="isEdit"
      :role-drop="roleList"
      :active-drop="enableList"
      @closeDialog="closeChildDialog"
      @confirmBtn="saveForm"
    />
    <!-- 密码重置dialog -->

    <!-- 重置密码弹框 -->
    <password-dialog
      :dialog-visible="passDialogVisible"
      :modal-form="passWordForm"
      @closeDialog="closePasswordDialog"
      @confirmBtn="savePassword"
    />
  </el-container>
  <!--   </section> -->
</template>

<script>
import { myMixin } from '@/assets/js/mixin'
import { getCodeData, getEnableCompany } from '@/api/dropdowm'
import {
  getAllRoles,
  searchUser,
  getUserInfoById,
  createOrUpdateUser,
  batchDeleteUser,
  batchEnableUser,
  batchDisableUser,
  batchUnlockUser,
  resetPassword
} from '@/api/user'
import childDialog from './dialog'
import passwordDialog from './resetDialog'
export default {
  name: 'UserManage',
  components: { childDialog, passwordDialog },
  mixins: [myMixin],
  data() {
    return {
      isEdit: false,
      dialogVisible: false,
      passDialogVisible: false,
      total: 0,
      roleList: [],
      enableList: [],
      freightForwarList: [],
      searchForm: {
        userName: '',
        name: '',
        post: '',
        phone: '',
        role: null,
        isActive: null,
        companyCode: '',
        maxResultCount: 10,
        skipCount: 0,
        page: 1
      },
      userForm: {
        id: 0,
        userName: '',
        fullName: '',
        password: '',
        phoneNumber: '',
        roleIds: [],
        emailAddress: '',
        sex: '',
        post: '',
        extensionPhone: '',
        remark: '',
        personalIcon: '',
        isActiveFlag: null,
        lockoutEndDateUtc: '',
        roleDesc: '',
        companyCode: ''
      },
      passWordForm: {
        currentUserId: 0,
        currentUserName: '',
        oldPass: '',
        newPass: ''
      },
      querytabel: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.search()
    this.getCompanyList()
    this.getEnableList()
    this.getAllRoleList()
  },
  methods: {
    // 查询
    query(value) {
      if (value !== undefined) {
        this.searchForm.skipCount = (value.page - 1) * value.limit
      } else {
        this.searchForm.skipCount =
          (this.searchForm.page - 1) * this.searchForm.maxResultCount
      }
      searchUser(this.searchForm).then(response => {
        this.querytabel = response.result.items
        this.total = response.result.totalCount
      })
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    userEdit(id) {
      var $this = this
      $this.isEdit = true
      getAllRoles().then(response => {
        $this.roleList = response.result
        getUserInfoById(id).then(response => {
          $this.userForm = response.result
        })
        $this.dialogVisible = true
      })
    },
    search() {
      this.searchForm.page = 1
      this.query()
    },
    clearSearch() {
      this.searchForm.userName = ''
      this.searchForm.name = ''
      this.searchForm.phone = ''
      this.searchForm.role = null
      this.searchForm.isActive = null
      this.searchForm.companyCode = ''
    },
    saveForm() {
      var $this = this
      createOrUpdateUser(this.userForm).then(response => {
        if (response.result.isSuccess) {
          $this.message_OK($this, '保存成功')
          $this.closeChildDialog()
          $this.query()
        } else {
          $this.message_ERROR($this, response.result.message)
        }
      })
    },
    // 获取选中id列表
    checkData() {
      var idList = []
      var $this = this
      $this.multipleSelection.forEach(function(val) {
        idList.push(val.id)
      })
      return idList
    },
    // 批量删除
    deleteUser() {
      var $this = this
      var idList = $this.checkData()
      if (idList.length === 0) {
        $this.message_WARN($this, '请选择要删除的用户')
        return false
      }
      $this.confirm_Pop($this, '是否删除选中的用户？', function() {
        batchDeleteUser(idList).then(response => {
          if (response.result.isSuccess) {
            $this.message_OK($this, '删除成功')
            $this.searchForm.page = 1
            $this.query()
          } else {
            $this.message_ERROR($this, response.result.message)
          }
        })
      })
    },
    // 批量启用
    activeUser() {
      var $this = this
      var idList = $this.checkData()

      if (idList.length === 0) {
        $this.message_WARN($this, '请选择要启用的用户')
        return false
      }
      $this.confirm_Pop($this, '是否确认要启用选中用户？', function() {
        batchEnableUser(idList).then(response => {
          if (response.result.isSuccess) {
            $this.message_OK($this, '启用成功')
            $this.query()
          } else {
            $this.message_ERROR($this, response.result.message)
          }
        })
      })
    },
    // 批量禁用
    disActiveUser() {
      var $this = this
      var idList = $this.checkData()

      if (idList.length === 0) {
        $this.message_WARN($this, '请选择要禁用的用户')
        return false
      }
      $this.confirm_Pop($this, '是否确认要禁用选中用户？', function() {
        batchDisableUser(idList).then(response => {
          if (response.result.isSuccess) {
            $this.message_OK($this, '禁用成功')
            $this.query()
          } else {
            $this.message_ERROR($this, response.result.message)
          }
        })
      })
    },
    // 批量解锁
    unlockUser() {
      var $this = this
      var idList = $this.checkData()

      if (idList.length === 0) {
        $this.message_WARN($this, '请选择要解锁的用户')
        return false
      }
      $this.confirm_Pop($this, '是否确认要解锁选中用户？', function() {
        batchUnlockUser(idList).then(response => {
          if (response.result.isSuccess) {
            $this.message_OK($this, '解锁成功')
            $this.query()
          } else {
            $this.message_ERROR($this, response.result.message)
          }
        })
      })
    },
    resetPassword() {
      var $this = this
      var idList = $this.checkData()

      if (idList.length === 0) {
        $this.message_WARN($this, '请选择一个用户')
        return false
      }
      if (idList.length > 1) {
        $this.message_WARN($this, '对不起，只能选择一个用户')
        return false
      }

      $this.passWordForm.currentUserId = $this.multipleSelection[0].id
      $this.passWordForm.currentUserName = $this.multipleSelection[0].userName
      $this.passDialogVisible = true
    },
    // 保存密码
    savePassword() {
      var $this = this
      resetPassword(this.passWordForm).then(response => {
        if (response.result.isSuccess) {
          $this.message_OK($this, '重置密码成功')
          $this.closePasswordDialog()
        } else {
          $this.message_ERROR($this, response.result.message)
        }
      })
    },
    // 关闭密码弹框
    closePasswordDialog() {
      var $this = this

      $this.passWordForm.currentUserId = 0
      $this.passWordForm.currentUserName = ''
      $this.passWordForm.oldPass = ''
      $this.passWordForm.newPass = ''
      $this.passDialogVisible = false
    },
    // 打开弹框
    openDiaolg() {
      var $this = this
      $this.isEdit = false
      getAllRoles().then(response => {
        $this.roleList = response.result
        this.dialogVisible = true
      })
    },
    // 关闭弹窗
    closeChildDialog() {
      this.userForm = {
        id: 0,
        userName: '',
        fullName: '',
        password: '',
        phoneNumber: '',
        roleIds: [],
        emailAddress: '',
        sex: '',
        post: '',
        extensionPhone: '',
        remark: '',
        personalIcon: '',
        isActiveFlag: null,
        lockoutEndDateUtc: '',
        roleDesc: '',
        companyCode: ''
      }
      this.dialogVisible = false
    },
    // 代理人下拉框
    getCompanyList() {
      getEnableCompany().then(response => {
        this.freightForwarList = response.result
      })
    },
    // 角色下拉框
    getAllRoleList() {
      getAllRoles().then(response => {
        this.roleList = response.result
      })
    },
    // 是否启用
    getEnableList() {
      getCodeData('IsEnable').then(response => {
        this.enableList = response.result
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
