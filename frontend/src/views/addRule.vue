<template>
  <el-container>
    <!-- <el-header>
      <el-page-header @back="goBack" content="添加功能参数" style="margin-top:20px"></el-page-header>
    </el-header>-->
    <el-main>
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="right"
      >
        <!-- <el-form-item v-for="item in sheetField" :key="item.propName" :label="item.text">
          <el-input v-model="formData[item.propName]"></el-input>
        </el-form-item>-->
        <el-form-item label="数据名称:">
          <span>{{row.symbol}}</span>
        </el-form-item>
        <el-form-item label="数据描述:">
          <span>{{row.desc}}</span>
        </el-form-item>
        <el-form-item label="数据格式:">
          <el-radio v-model="radio" label="1">十进制</el-radio>
          <el-radio v-model="radio" label="2">十六进制</el-radio>
        </el-form-item>
        <el-form-item label="设置数值" prop="dataValue">
          <el-input v-model="formData.dataValue"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="connectButton"
            type="primary"
            @click="onSubmit('formData')"
            icon="el-icon-check"
          >立即发送</el-button>
          <el-button
            class="connectButton"
            type="danger"
            @click="resetForm('formData')"
            icon="el-icon-close"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import global from "./constant";

export default {
  props: {
    onClose: Function,
    row: Object
  },
  data() {
    //判断字符串是否为数字 （判断正整数 /^[1-9]+[0-9]*]*$/）
    var checkNum = (rule, num, callback) => {
      if (this.radio === "1") {
        var rea = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/;
        if (!rea.test(num)) {
          callback(new Error("请输入十进制数字"));
        }
        return true;
      }
      if (this.radio === "2") {
        var reb = /^([0-9|a-z|A-Z]*)$/;
        if (!reb.test(num)) {
          callback(new Error("请输入十六进制数字"));
        }
        return true;
      }
    };
    return {
      formData: {
        symbol: this.row.symbol,
        desc: this.row.desc,
        data: this.row.data ? this.row.data : 0,
        dataValue: ""
      },
      radio: "1",
      sheetField: global.sheetField,
      rules: {
        dataValue: [
          { required: true, message: "设置值不能为空！", trigger: "blur" },
          { validator: checkNum, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 提交表单
    onSubmit(formName) {
      // var re = /^[0-9]+.?[0-9]*$/;
      var rea = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/;
      var reb = /^([0-9|a-z|A-Z]*)$/;
      if (this.formData.dataValue == "") {
        this.$message.warning("设置值不能为空");
      } else if (this.radio === "1") {
        if (!rea.test(this.formData.dataValue)) {
          this.$message.warning("请输入十进制数字！");
          this.formData.dataValue = "";
        } else {
          var paramsa = {
            symbol: this.row.symbol,
            value: (Number(this.formData.dataValue)/parseFloat(this.row.scale)).toString()
          };
          this.$store.dispatch("setSingleData", paramsa);
          this.resetForm(formName);
        }
      } else if (this.radio === "2") {
        if (!reb.test(this.formData.dataValue)) {
          this.$message.warning("请输入十六进制数字！");
          this.formData.dataValue = "";
        } else {
          var paramsb = {
            symbol: this.row.symbol,
            value: eval('0x'+this.formData.dataValue).toString(10)
          };
          this.$store.dispatch("setSingleData", paramsb);
          this.resetForm(formName);
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate();
      this.onClose();
    }
  }
};
</script>