<template>
  <div class="login-container">
    <el-main class="login-box">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <img class="index-logo" src="../../assets/image/logo.png">
          <h5 class="login-title">请登录您的用户</h5>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            autofocus
            type="text"
            tabindex="1"
            auto-complete="on"
            @blur="getPassword"
          >
            <i slot="prefix" class="el-input__icon iconfont iconuser icon-blue" />
          </el-input>
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大小写锁定已打开" placement="right" manual>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              auto-complete="off"
              tabindex="2"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" class="el-input__icon iconfont iconsuo icon-blue" />
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <div class="remember-pass">
          <el-checkbox v-model="loginForm.rememberMe" class="box" />记住密码
        </div>

        <div v-if="isError" class="errorMsg">
          <img
            src="../../assets/image/error.png"
            style="height:15px;margin-right:5px;vertical-align: text-top;"
          >
          <span>{{ errMessage }}</span>
        </div>

        <el-button
          class="loginbtn"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>

        <div class="login-copyright">copyright</div>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      showDialog: false,
      redirect: undefined,
      checked: false,
      isError: false,
      errMessage: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.username.focus()
    }

    this.getCookie()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(res => {
              if (res.result.isValid) {
                // 判断是否勾选 记住密码
                if (this.loginForm.rememberMe === true) {
                  // 传入账号名，密码，和保存天数3个参数
                  this.setCookie(
                    this.loginForm.username,
                    this.loginForm.password,
                    30
                  )
                } else {
                  this.clearCookie()
                }
                this.$router.push({ path: '/' })
              } else {
                this.isError = true
                this.errMessage = res.result.message
              }
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getPassword() {
      if (
        this.passwordCookie !== '' &&
        this.loginForm.username === this.userNameCookie
      ) {
        this.loginForm.password = this.passwordCookie
        this.$refs['loginForm'].clearValidate()
      }
    },
    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      // 加密密码
      var ebcryptPass = CryptoJS.AES.encrypt(c_pwd, 'secret key 123').toString()

      window.document.cookie =
        'userPwd' +
        '=' +
        ebcryptPass +
        ';path=/;expires=' +
        exdate.toGMTString()
    },
    // 读取cookie
    getCookie: function() {
      var hasCookie = false
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.loginForm.username = arr2[1] // 保存到保存数据的地方
            this.userNameCookie = arr2[1]
            hasCookie = true
          } else if (arr2[0] === 'userPwd') {
            // 解密密码
            var bytes = CryptoJS.AES.decrypt(arr2[1], 'secret key 123')
            var decryptPass = bytes.toString(CryptoJS.enc.Utf8)

            this.loginForm.password = decryptPass
            this.passwordCookie = decryptPass
            hasCookie = true
          }
        }
        if (hasCookie) {
          this.loginForm.rememberMe = true
        }
      }
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$cursor: #fff;
$font: #2e2b2b;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item--medium .el-form-item__content {
    line-height: 26px;
  }

  .el-input--medium .el-input__inner {
    height: 36px !important;
    border: 1px solid #dfe0e3;
  }
  .el-input__prefix,
  .el-input__suffix {
    position: absolute;
    -webkit-transition: all 0.3s;
    width: 36px;
    height: 34px;
    color: #c0c4cc;
    text-align: center;
  }

  .el-input__prefix {
    left: 1px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 36px;
  }

  .el-input--medium .el-input__icon {
    line-height: 30px;
    top: 1px;
    height: 100%;
  }
  .el-input {
    display: inline-block;
    height: 32px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $font;
      height: 32px;
      caret-color: $font;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fdfeff inset !important;
        -webkit-text-fill-color: $font !important;
      }
    }
  }

  .el-form-item {
    background: #fdfeff;
    border-radius: 0px;
    color: $font;
  }

  .el-form-item__error {
    padding-top: 8px;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$font: #2e2b2b;
$back_color: #fff;
.login-container {
  height: 100%;
  width: 100%;
  background: url(../../assets/image/login-bg.jpg) no-repeat bottom center;
  background-size: cover;

  .login-box {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-form {
    position: relative;
    width: 400px;
    padding: 10px 45px 20px 45px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: $back_color;

    height: 418px;
  }

  .tips {
    font-size: 14px;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;
    text-align: center;
    .index-logo {
      width: 45px;
      height: 45px;
      margin-top: 10px;
    }
    .login-title {
      text-align: center;
      font-weight: normal;
      margin: 0 auto;
      margin-top: 12px;
      padding-bottom: 30px;
    }
  }

  .icon-blue {
    font-size: 15px;
    color: #444e57;
    background-color: #e9ecf1;

    border-radius: 2px;
    border-right: 1px solid #dfe0e3;
    position: absolute;
    left: 0;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .errorMsg {
    margin-bottom: 15px;
    text-align: left;
    font-size: 14px;
    color: red;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .loginbtn {
    background-color: #0759bc;
    &:hover,
    &:focus {
      -webkit-filter: drop-shadow(0px 0px 5px #0759bc);
      filter: drop-shadow(0px 0px 5px #0759bc);
    }
  }

  .remember-pass {
    font-size: 13px;
    color: $font;
    margin-bottom: 20px;
    margin-top: 10px;
    .box {
      margin-right: 10px;
    }
  }

  .login-copyright {
    font-size: 6px;
    margin-top: 12px;
    color: #6c6c6c;
    text-align: center;
  }
}
</style>
