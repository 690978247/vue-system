<template>
  <el-dialog
    v-el-drag-dialog
    :visible="dialogVisible"
    :before-close="closeDialog"
    title="重置密码"
    top="24vh"
    width="30%"
  >
    <div class="dialog-content dialog-l">
      <el-form
        ref="passwordForm"
        :model="modalForm"
        :rules="userRules"
        label-position="right"
        label-width="130px"
      >
        <el-row :gutter="10" class="row-height">
          <el-col class="input-col1">
            <el-form-item label="当前用户：" prop="currentUserName">
              <el-input v-model="modalForm.currentUserName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row-height">
          <el-col class="input-col1">
            <el-form-item label="新密码：" prop="newPass">
              <el-input v-model="modalForm.newPass" :type="pwd_type" auto-complete="off" />
              <span class="show-pwd" @click="showPwd()">
                <i v-if="pwd_type==='password'" class="iconfont icon-close-eye" />
                <i v-else class="iconfont icon-yanjing" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'ResetDialog',
  directives: { elDragDialog },
  props: {
    modalForm: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogVisible: Boolean
  },
  data() {
    return {
      pwd_type: 'password',
      genderList: [],
      userRules: {}
    }
  },
  mounted() {},
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs['passwordForm'].resetFields()
      this.$emit('closeDialog', { dialogVisible: false })
    },
    // 保存
    confirm() {
      // 校验
      var $this = this
      $this.validateForm($this, 'passwordForm', function() {
        // 校验成功
        //
        $this.$emit('confirmBtn')
      })
    },
    showPwd: function() {
      if (this.pwd_type === 'password') {
        this.pwd_type = ''
      } else {
        this.pwd_type = 'password'
      }
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/dialog.scss";
</style>
