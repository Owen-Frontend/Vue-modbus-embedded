<template>
  <el-container>
    <el-header>
      <el-breadcrumb style="margin-top:25px" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>温度变化曲线</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container>
      <div style="align:center;">
        <div id="myChart" :style="graphStyle"></div>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import { setInterval,clearInterval } from "timers";
import { mapGetters } from "vuex";

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

export default {
  computed: {
    ...mapGetters(["getClientWidth", "getClientHeight", "getSpecifyValue"]),
    graphStyle() {
      return {
        width: `${this.getClientWidth}px`,
        height: `${this.getClientHeight - 200}px`
      };
    }
  },
  data() {
    return {
      timer:null,
      graphData: [],
      graphTime: [],
      resultTemp: "",
      option: {
        xAxis: {
          name:"当前时间",
          type: "category",
          boundaryGap: false,
          minInterval: 1,
          data: []
        },
        yAxis: {
          name:"当前温度（℃）",
          type: "value",
          boundaryGap: [0, "100%"]
        },
        series: [
          {
            data: [],
            type: "line",
            itemStyle: {
              color: "rgb(255, 70, 131)"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(255, 158, 68)" // color at 0% position
                  },
                  {
                    offset: 1,
                    color: "rgb(255, 70, 131)" // color at 100% position
                  }
                ]
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.drawLine()
  },
  beforeDestroy(){
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption(this.option);
      const _this = this;
      this.timer=setInterval(() => {
        _this.$store.dispatch("refreshSpecifyData", "RealTimeTemperature");
        let result =  _this.getSpecifyValue("RealTimeTemperature").data;
        _this.graphData.push(result);
        _this.graphTime.push(new Date().Format("hh:mm:ss"));
        if (_this.graphData.length > 30) {
          _this.graphData.shift();
          _this.graphTime.shift();
        }
        _this.option.series[0].data = _this.graphData;
        _this.option.xAxis.data = _this.graphTime;
        myChart.setOption(_this.option);
        myChart.resize();
      }, 80);
    },
    // goBack() {
    //   this.$router.push({
    //     path: "/",
    //     query: {}
    //   });
    // }
  }
};
</script>
