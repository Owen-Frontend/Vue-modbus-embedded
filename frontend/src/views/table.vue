<template>
  <el-container class="table-page">
    <el-header>
      <el-row>
        <el-col :span="6">
          <h2>功能参数列表</h2>
        </el-col>
        <el-col :span="18">
          <div class="table-control-button-container">
            <el-input v-model="search" style="margin-right:5px; width:250px" placeholder="输入关键字搜索" prefix-icon="el-icon-search"/>
            <el-select style="margin-right:5px" v-model="portValue" placeholder="请选择串口">
              <el-option
                v-for="item in portOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>

            </el-select>
            <el-select v-model="styleValue" placeholder="请选择模式" @change="chooseStyle">
              <el-option
                v-for="item in styleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              class="connectButton"
              v-if="!getConnectStatus"
              @click="initConnect()"
              icon="el-icon-circle-check"
              style="margin-left: 5px"
            >连接</el-button>
            <el-button
              class="connectButton"
              v-else
              @click="disconnect()"
              icon="el-icon-circle-close"
            >断开连接</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table 
      :data="getTable.filter(data => !search || data.desc.toLowerCase().includes(search.toLowerCase()))"
       ref="multipleTable" tooltip-effect="dark">
        <el-table-column
          v-for="item in sheetConfig"
          :key="item.propName"
          :prop="item.propName"
          :label="item.text"
          :width="item.width"
          resizable
        ></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              v-if="writable(scope.row)"
              type="success"
              size="mini"
              @click="handleCurrentChange(scope.row)"
            >设置</el-button>
            <el-button v-else type="" size="mini" disabled>只读</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog title="发送设置" :visible.sync="isAddRuleVisile" append-to-body custom-class="write-dialog" width="50%" @close="handleClose">
      <add-rule ref="addRule" :row="message" :on-close="handleAddRule"></add-rule>
    </el-dialog>
  </el-container>
</template>

<script>
import global from "./constant";
import { mapGetters } from "vuex";
import AddRule from "./addRule";

export default {
  components: {
    "add-rule": AddRule
  },
  computed: {
    ...mapGetters(["getTable","getConnectStatus"]),
    writeDialogClass(){
      return 'write-dialog'
    }
  },
  methods: {
    // 断开连接
    disconnect() {
      var value = this.portValue;
      this.$store.dispatch("disConnect", value);
      this.$store.dispatch("getTableData");
      this.portValue = "";
    },
    // 先选择串口，然后连接
    initConnect() {
      var value = this.portValue;
      if (value == "") {
        this.$message.warning("请先选择串口！");
      } else {
        this.$store.dispatch("initConnect", value);
        this.$store.dispatch("getTableData");
      }
    },
    // 选择模式
    chooseStyle(value) {
      this.$store.dispatch("setCurtMode", value);
    },
    // 判断是否可写
    writable(row) {
      if (row.writable === "true") {
        return true;
      } else {
        return false;
      }
    },
    // 发送参数
    handleCurrentChange(currentRow) {
      if (currentRow.writable === "true") {
        this.message = currentRow;
        this.isAddRuleVisile = true;
      }
    },
    // 关闭弹窗的回调
    handleClose() {
      this.$refs.addRule.resetForm("formData");
    },
    handleAddRule() {
      this.isAddRuleVisile = false;
    }
  },

  data() {
    return {
      sheetConfig: global.sheetField,
      isAddRuleVisile: false,
      search: '',
      message: {},
      styleOptions: [
        {
          value: "1",
          label: "温度反馈模式"
        },
        {
          value: "2",
          label: "光功率反馈模式"
        },
        {
          value: "3",
          label: "电功率反馈模式"
        }
      ],
      styleValue: "1",
      portOptions: global.portOptions,
      portValue: ""
    };
  }
};
</script>

<style scoped>
.table-page {
  background-color: #fff;
}

.table-control-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 75px;
}

</style>