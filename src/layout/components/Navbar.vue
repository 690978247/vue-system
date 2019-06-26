<template>
  <div ref="navbar" class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="breadcrumb-container">{{ systitle }}</div>
    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'"> -->
      <div class="block2">
        <i class="iconfont icontouxiang icon" />
        {{ name }}
      </div>
      <div class="block" @click="logout">
        <i class="iconfont icontuichu icon" />
        退出
      </div>
      <!-- </template> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      name: 'admin',
      systitle: '后台管理系统'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  updated() {
    this.$refs.navbar.style.setProperty('--activeColor', this.backColor)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common.scss";
.navbar {
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  position: relative;
  color: #fff;
  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(212, 199, 199, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    color: #fff;
    justify-content: flex-end;
    height: 100%;
    align-items: center;
    &:focus {
      outline: none;
    }
    .block {
      margin-right: 22px;
      font-size: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      height: 31px;
      padding-right: 12px;
      padding-left: 8px;
      border-radius: 45px;
      &:hover {
        // color: var(--activeColor);
        background-color: #fff;
      }
    }
    .block2 {
      margin-right: 22px;
      font-size: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 31px;
      padding-right: 12px;
      padding-left: 8px;
      border-radius: 45px;
    }
    .icon {
      margin-right: 6px;
      margin-left: 6px;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
