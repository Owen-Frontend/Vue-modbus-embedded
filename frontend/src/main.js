import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import './icon/codicon.css'
import { mapGetters } from "vuex";
import { setInterval,clearInterval } from "timers";

Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data(){
    return{
      timer:null
    }
  },
  computed: {
    ...mapGetters(["getConnectPort"]),
  },
  created() {
    this.$store.dispatch('loadRules')
    this.refreshData()
  },
  beforeDestroy(){
    this.$store.dispatch('disConnect',this.getConnectPort)
    clearInterval(this.timer)
    this.timer=null
  },
  methods:{
    refreshData(){
      this.timer=setInterval(()=>{
        this.$store.dispatch("getTableData");
      },1000)
    }
  }
})

