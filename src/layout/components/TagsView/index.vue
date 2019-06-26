<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <ul class="tags-box">
        <router-link
          ref="tag1"
          :class="isActive(dashbordTab)?'active':''"
          :to="{ path: dashbordTab.path, query: dashbordTab.query, fullPath: dashbordTab.fullPath }"
          :key="dashbordTab.path"
          tag="li"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(dashbordTab)"
          @contextmenu.prevent.native="openMenu(dashbordTab,$event)"
        >
          <i class="iconfont iconshouye"/>
          {{ dashbordTab.title }}
        </router-link>
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          :key="tag.path"
          tag="li"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <i class="iconfont iconf14 shuaxin" @click.prevent="refreshSelectedTag(tag)"/>
          {{ tag.title }}
          <span
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </ul>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      dashbordTab: {
        fullPath: "/dashboard",
        hash: "",
        matched: [],
        meta: "",
        name: "Dashboard",
        params: "",
        path: "/dashboard",
        query: "",
        title: "首页"
      }
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews.filter(
        p => p.path !== "/dashboard"
      );
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        if (tags !== undefined) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag);

              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch("tagsView/updateVisitedView", this.$route);
              }

              break;
            }
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView);
            } else {
              this.$router.push("/");
            }
          }
        });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags() {
      this.$store.dispatch("tagsView/delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;

      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.shuaxin {
  font-size: 15px;
  margin-right: 3px;
  color: #b2b2b2;
}
.tags-view-container {
  height: 40px;
  width: 100%;
  line-height: 40px;
  border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    width: 100%;
    .tags-box {
      height: 39px;
      // width:80%;
    }
    .tags-view-item:not(:first-child)::after {
      content: "|";
      color: #ccc;
      position: relative;
      left: 8px;
      font-size: 19px;
    }
    .tags-view-item {
      display: inline-block;
      cursor: pointer;
      color: #7c7c7c;
      background: #eff4fa;
      padding: 0 10px;
      font-size: 12px;
      height: 100%;
      &:first-of-type::after {
        // margin-left: 15px;
        content: "|";
        color: #ccc;
        position: relative;
        left: 13px;
        font-size: 19px;
      }
      &:last-of-type {
        // margin-right: 15px;
      }
      &.active {
        background-color: #fff;
        // color: #000;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        height: 40px;
        &::after {
          content: "";
          background: #fff;
        }
        &::before {
          content: "|";
          position: relative;
          color: #eff4fa;
          right: 17px;
          font-size: 19px;
          background: #eff4fa;
        }
      }&.active:first-child{
        border-left:0px;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 0px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      margin-left: 5px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(1.2);
        display: inline-block;
        vertical-align: -2px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
