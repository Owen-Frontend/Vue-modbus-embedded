<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    @select="handleSelect"
    :background-color="menuBackgroundColor"
    :text-color="menuItemTextColor"
    :active-text-color="menuItemTextActiveColor"
  >
    <el-menu-item index="temperature">温度走势</el-menu-item>
    <el-menu-item index="table">数据总览</el-menu-item>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getFocus"]),
    menuBackgroundColor() {
      return this.getFocus ? "#ddd1" : "#ddddddcc";
      // return this.getFocus ? "#2b579a11" : "#ddddddcc";
    },
    menuItemTextColor() {
      return this.getFocus ? "#7b7b7b" : "#7b7b7b";
      // return this.getFocus ? "#ddd" : "#7b7b7b";
    },
    menuItemTextActiveColor(){
      return this.getFocus ? "#111111" : "#111111";
      // return this.getFocus ? "#ffffff" : "#111111";
    }
  },
  data() {
    return {
      activeIndex: "table"
    };
  },
  methods: {
    handleSelect(key) {
      this.$router.push({ name: key });
    }
  }
};
</script>

<style scoped>
</style>