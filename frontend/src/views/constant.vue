<script>
const sheetField = [
  {
    propName: "index",
    text: "序号",
    width: "50"
  },
  // {
  //   propName: "symbol",
  //   text: "数据名称"
  // },
  {
    propName: "desc",
    text: "数据描述",
    width:""
  },
  {
    propName: "data",
    text: "当前数值",
    width:"100"
  }
];
var portOptions = []
      for(var i=1;i<257;i++){
        portOptions.push(
          {
          value: "\\\\.\\COM"+i,
          label: "COM"+i
          }
        )
      }
export default {
  sheetField,
  portOptions
};
</script>