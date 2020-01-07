<template>
  <div id="app">
    <el-container>
      <el-scrollbar :style="mainViewStyle">
        <div style="position:fixed;z-index:1000;backdrop-filter: saturate(180%) blur(20px);">
          <title-bar />
          <navigate-bar />
        </div>
        <div style="height:75px;" />
        <transition name="slide-fade">
          <keep-alive>
            <router-view :style="routerViewStyle"></router-view>
          </keep-alive>
        </transition>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
import TitleBar from "./components/titleBar";
import NavigateBar from "./components/navigateBar";
import { mapGetters } from "vuex";
export default {
  components: {
    "title-bar": TitleBar,
    "navigate-bar": NavigateBar
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getMaximized", "getClientWidth", "getClientHeight"]),
    mainViewStyle() {
      return {
        height: `${this.getClientHeight}px`,
        width: `${this.getClientWidth}px`
      };
    },
    routerViewStyle() {
      return {
        // position: "absolute",
        width: `${this.getClientWidth}px`
      };
    }
  },
  mounted() {
    this.$store.commit(
      "setClientHeight",
      document.documentElement.clientHeight
    );
    this.$store.commit("setClientWidth", document.documentElement.clientWidth);
    const _this = this;
    window.onresize = function temp() {
      _this.$store.commit(
        "setClientHeight",
        document.documentElement.clientHeight
      );
      _this.$store.commit(
        "setClientWidth",
        document.documentElement.clientWidth
      );
    };
  }
};
</script>

<style>
body {
  margin: 0px;
  overflow-y: hidden;
  overflow-x: hidden;
  user-select: none;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>