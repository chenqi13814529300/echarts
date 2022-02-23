<!--  -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>｜{{ showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-icon" :style="marginStyle" v-show="showChoice">
        <div
          class="select-item"
          @click="handleSelect(item.key)"
          :key="index"
          v-for="(item, index) in selectType"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
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
      showChoice: false, //是否显示可选项
      choiceType: "map",
      titleFontSize: 0,
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapState(["theme"]),

    selectType() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => item.key !== this.choiceType);
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    //   设置给标题样式的计算属性
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
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
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
      this.showChoice = false;
    },

    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme);
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        // 触碰工具提示
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          //   距离0没有间隙
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },

    // ret就服务端发送给客户端的数据
    async getData(ret) {
      // const { data: ret } = await this.$http.get("trend");
      // console.log(ret);
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 颜色值
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      // 处理数据
      const timeArr = this.allData.common.month;
      //   y轴数据
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      // 图例的数据
      const legendArr = valueArr.map((item) => item.name);

      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },

    // 屏幕适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };

      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.$socket.registerCallBack("trendData", this.getData);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initChart();
    // this.getData();
    // 发送数据给服务器，告诉服务器，我现在需要数据
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {
    this.$socket.unrRegisterCallBack("trendData");
    window.removeEventListener("resize", this.screenAdapter);
  }, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="less">
.title {
  position: absolute;
  left: 20px;
  z-index: 10;
  top: 20px;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-item {
    cursor: pointer;
  }
  .select-icon {
    background: #222733;
  }
}
/*@import url(); 引入公共css类*/
</style>