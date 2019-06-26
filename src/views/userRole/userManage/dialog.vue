<template>
  <el-dialog
    v-el-drag-dialog
    :visible="dialogVisible"
    :before-close="closeDialog"
    :title="isEdit==true ? '编辑用户' : '新增用户'"
    top="15vh"
    width="50%"
  >
    <div class="dialog-content dialog-x">
      <el-form
        ref="userForm"
        :model="modalForm"
        :rules="userRules"
        label-position="right"
        label-width="130px"
      >
        <el-row :gutter="10" class="row-height">
          <el-col class="input">
            <el-form-item label="用户名：" prop="userName">
              <el-input v-model="modalForm.userName" :disabled="isEdit==true ? true : false" />
            </el-form-item>
          </el-col>
          <el-col class="input">
            <el-form-item label="姓名：" prop="fullName">
              <el-input v-model="modalForm.fullName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row-height">
          <el-col class="input">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="modalForm.sex" placeholder clearable>
                <el-option
                  v-for="item in genderList"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="input">
            <el-form-item label="岗位：" prop="post">
              <el-input v-model="modalForm.post" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row-height">
          <el-col class="input">
            <el-form-item label="手机号：" prop="phoneNumber">
              <el-input v-model="modalForm.phoneNumber" />
            </el-form-item>
          </el-col>
          <el-col class="input">
            <el-form-item label="分机号：" prop="extensionPhone">
              <el-input v-model="modalForm.extensionPhone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row-height">
          <el-col class="input">
            <el-form-item label="邮箱：" prop="emailAddress">
              <el-input v-model="modalForm.emailAddress" />
            </el-form-item>
          </el-col>
          <el-col class="input">
            <el-form-item label="角色：" prop="roleIds">
              <el-select v-model="modalForm.roleIds" multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in roleDrop"
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
            <el-form-item label="代理人：" prop="companyCode">
              <template>
                <el-select v-model="modalForm.companyCode" placeholder clearable>
                  <el-option
                    v-for="item in company"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col class="input">
            <el-form-item label="是否启用：" prop="isActiveFlag">
              <template>
                <el-radio-group v-model="modalForm.isActiveFlag">
                  <el-radio
                    v-for="item in activeDrop"
                    :key="item.code"
                    :label="item.code"
                  >{{ item.value }}</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row-height">
          <el-col class="input">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="modalForm.remark" type="textarea" />
            </el-form-item>
          </el-col>

          <el-col v-if="!isEdit" class="input">
            <el-form-item label="初始密码：" prop="password">
              <el-input :key="pwd_type" v-model="modalForm.password" :type="pwd_type" auto-complete="off" />
              <span class="show-pwd" @click="showPwd()">
                <i v-if="pwd_type==='password'" class="iconfont iconclose-eye" />
                <i v-else class="iconfont iconyanjing" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 认</el-button>
    <!--    <el-button v-debounce="[($ev) => { confirm() }, 1000]" type="primary">确 认</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getCodeData } from '@/api/dropdowm'
import { validEmail, validPhone } from '@/utils/validate'
export default {
  name: 'UserDialog',
  directives: { elDragDialog },
  props: {
    modalForm: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogVisible: Boolean,
    isEdit: Boolean,
    roleDrop: {
      type: Array,
      default() {
        return []
      }
    },
    activeDrop: {
      type: Array,
      default() {
        return []
      }
    },
    company: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const checkMail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入合法的邮箱地址'))
      } else {
        callback()
      }
    }

    const checkPhone = (rule, value, callback) => {
      if (value != null) {
        if (value.trim() === '') callback()
        if (!validPhone(value)) {
          callback(new Error('请输入合法的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pwd_type: 'password',
      genderList: [],
      userRules: {
        userName: [
          { min: 0, max: 32, message: '最长32个字符', trigger: 'blur' },
          { required: true, message: '必填', trigger: 'blur' }
        ],
        fullName: [
          { min: 0, max: 32, message: '最长32个字符', trigger: 'blur' },
          { required: true, message: '必填', trigger: 'blur' }
        ],
        post: [{ min: 0, max: 32, message: '最长32个字符', trigger: 'blur' }],
        phoneNumber: [
          { min: 0, max: 32, message: '最长32个字符', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        extensionPhone: [
          { min: 0, max: 32, message: '最长32个字符', trigger: 'blur' }
        ],
        emailAddress: [
          { min: 0, max: 32, message: '最长32个字符', trigger: 'blur' },
          { required: true, message: '必填', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        roleIds: [{ required: true, message: '必选', trigger: 'blur' }],
        password: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 0, max: 10, message: '最长10个字符', trigger: 'blur' }
        ],
        isActiveFlag: [{ required: true, message: '必选', trigger: 'blur' }],
        remark: [
          { min: 0, max: 255, message: '最长255个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getGenderList()
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.pwd_type = 'password'
      this.$refs['userForm'].resetFields()
      this.$emit('closeDialog')
    },
    // 保存
    confirm() {
      // 校验
      var $this = this
      $this.validateForm($this, 'userForm', function() {
        // 校验成功
        //
        $this.pwd_type = 'password'
        $this.$emit('confirmBtn')
      })
    },
    showPwd: function() {
      if (this.pwd_type === 'password') {
        this.pwd_type = ''
      } else {
        this.pwd_type = 'password'
      }
    },
    // 性别下拉框
    getGenderList() {
      getCodeData('Gender').then(response => {
        this.genderList = response.result
      })
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/dialog.scss";
</style>
