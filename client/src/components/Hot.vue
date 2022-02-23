<!--  -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapState(["theme"]),

    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
  },
  //监控data中的数据变化
  watch: {
    theme() {
      // 当前图表销毁
      this.chartInstance.dispose();
      // 以最新的主题初始化图表对象
      this.initChart();
      // 屏幕适配
      this.screenAdapter();
      // 更新图表的展示
      this.updateChart();
    },
  },
  //方法集合
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "｜热销商品的占比",
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            //计算所有三级分类的数值总和
            let total = 0;
            const thirdCategory = arg.data.children;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let resStr = "";
            thirdCategory.forEach((item) => {
              resStr += `${item.name}:${
                parseInt((item.value / total) * 100) + "%"
              }<br/>`;
            });
            console.log(thirdCategory);
            return resStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            // 高亮的状态的样式
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData(ret) {
      // const { data: ret } = await this.$http.get("hot");
      this.allData = ret;
      console.log(ret);
      this.updateChart();
    },
    updateChart() {
      // 处理图例
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const seriseData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriseData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    toLeft() {
      this.currentIndex--;

      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize ,
          itemHeight: this.titleFontSize ,
          itemGap: this.titleFontSize ,
          textStyle: {
            fontSize: this.titleFontSize ,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "55%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.$socket.registerCallBack("hotData", this.getData);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hot",
      value: "",
    });

    window.addEventListener("resize", this.screenAdapter);
    // 刚开始就要调整自适应，因为一开始固定了字体大小，不调整，一开始字体太大了
    this.screenAdapter();
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {
    this.$socket.unrRegisterCallBack("hotData");

    window.removeEventListener("resize", this.screenAdapter);
  }, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="less">
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  cursor: pointer;
}
.cat-name {
  color: white;
  position: absolute;
  left: 80%;
  bottom: 20px;
}
</style>