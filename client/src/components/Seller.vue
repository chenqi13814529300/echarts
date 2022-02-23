<!-- 商家销售横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapState } from "vuex";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      showData: null,
      timerId: null, //定时器的标识
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapState(["theme"]),
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
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme);
      // 拆分图表的option->>>>>>>1.初始化配置 2.获取数据后的配置 3.分辨率适配的配置
      // ****对图表进行初始化配置的控制*****
      const initOption = {
        title: {
          text: "｜商家销售量统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          //   图表与周围的距离，如果要包含文字设置如下
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        // 鼠标选定后的样式
        tooltip: {
          trigger: "axis",
          axisPointer: {
            z: 0,
            type: "line",
            lineStyle: {
              width: 66,
              color: "#2d3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            barWidth: 66,
            // 每条的数据
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            // 设置每个小柱条
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              // 渐变颜色
              // x1 y1 x2 y2
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0%状态下的颜色值
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };

      this.chartInstance.setOption(initOption);

      //   对图表进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },

    // 获取服务器的数据
    async getData(ret) {
      // const { data: ret } = await this.$http.get("seller");
      this.allData = ret;
      //   从小到大 a-b
      this.allData.sort((a, b) => a.value - b.value);
      // 每五个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? (this.totalPage = this.allData.length / 5)
          : (this.totalPage = this.allData.length / 5 + 1);
      this.updateChart();
      this.startInterval();
    },

    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => item.name);
      const sellerValues = showData.map((item) => item.value);

      // *****  获取数据后的配置****
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };

      this.chartInstance.setOption(dataOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },

    // 屏幕适配
    
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },

        // 鼠标选定后的样式
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            // 设置每个小柱条
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
      //   完整的需要拆解3个
      // const initOption = {
      // 	title: {
      // 		text: '▎商家销售统计',
      // 		textStyle: {
      // 			fontSize: 66
      // 		},
      // 		left: 20,
      // 		top: 20
      // 	},
      // 	grid: {
      // 		top: '20%',
      // 		left: '3%',
      // 		right: '6%',
      // 		bottom: '3%',
      // 		// 包含坐标轴中的文字
      // 		containLabel: true
      // 	},
      // 	xAxis: {
      // 		type: 'value'
      // 	},
      // 	yAxis: {
      // 		type: 'category'
      // 	},
      // 	tooltip: {
      // 		show: true,
      // 		trigger: 'axis',
      // 		axisPointer: {
      // 			type: 'line',
      // 			z: 0,
      // 			lineStyle: {
      // 				width: 66,
      // 				color: '#2d3443',
      // 				type: 'solid'
      // 			}
      // 		}
      // 	},
      // 	series: [
      // 		{
      // 			type: 'bar',
      // 			barWidth: 66,
      // 			label: {
      // 				show: true,
      // 				position: 'right',
      // 				textStyle: {
      // 					color: 'white'
      // 				}
      // 			},
      // 			itemStyle: {
      // 				barBorderRadius: [0, 33, 33, 0],
      // 				// 颜色的线性渐变
      // 				// 指明颜色渐变的方向  指明不同百分比之下颜色的值
      // 				color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
      // 					{
      // 						// 0% 状态下的颜色值
      // 						offset: 0,
      // 						color: '#505211'
      // 					},
      // 					{
      // 						// 100% 状态下的颜色值
      // 						offset: 1,
      // 						color: '#ab6ee5'
      // 					}
      // 				])
      // 			}
      // 		}
      // 	]
      // };
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.$socket.registerCallBack("sellerData", this.getData);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
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
    clearInterval(this.timerId);
    this.$socket.unrRegisterCallBack("sellerData");

    // 在组件销毁的时候，把监听器取消掉
    window.removeEventListener("resize", this.screenAdapter);
  }, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>