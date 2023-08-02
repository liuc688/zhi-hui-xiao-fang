<template>
  <div style="width: 100%; height: 100%; display: flex">
    <div id="main" class="mainres"></div>
    <div class="contents">
      <p class="top_style">本级：{{ selectdsata.name }}</p>
      <p class="top_style">上级：</p>
      <p v-for="(item, index) in toparrys" :key="'top_' + index" class="top_styles">{{ getdatas(item) }}</p>
      <!-- <br /> -->
      <p class="top_style">下级：</p>
      <p v-for="(item, index) in buttomarrys" :key="index" class="top_styles">{{ getdatas(item) }}</p>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Vue from 'vue';
Vue.prototype.$echarts = echarts;
export default {
  name: 'gpolyline',
  data() {
    return {
      selectdsata: {
        name: '济南市',
        category: 0,
        symbolSize: 80,
        id: 0,
        number: 2903,
        draggable: false,
      },
      datas: [
        {
          name: '济南市',
          category: 0,
          symbolSize: 80,
          id: 0,
          number: 2903,
          draggable: false,
        },

        {
          name: '历下区',
          number: 394,
          category: 1,
          id: 1,
          draggable: false,
        },
        {
          name: '市中区',
          number: 434,
          category: 1,
          id: 2,
          draggable: false,
        },
        {
          name: '槐荫区',
          number: 324,
          category: 1,
          id: 3,
          draggable: false,
        },
        {
          name: '天桥区',
          number: 208,
          category: 1,
          id: 4,
          draggable: false,
        },

        {
          name: '政策文件',
          number: 594,
          category: 2,
          id: 5,
          draggable: false,
        },
        {
          name: '政府文件',
          number: 623,
          category: 2,
          id: 6,
          draggable: false,
        },
        {
          name: '政府办文件',
          number: 701,
          category: 2,
          id: 7,
          draggable: false,
        },
        {
          name: '规范性文件',
          number: 509,
          category: 2,
          id: 8,

          draggable: false,
        },
        {
          name: '部门文件',
          number: 487,
          id: 9,
          category: 2,
          draggable: false,
        },
        {
          name: '政府规章',
          number: 220,
          id: 10,
          category: 2,
          draggable: false,
        },
        {
          name: '历城区',
          number: 362,
          category: 1,
          id: 11,
          draggable: false,
        },
        {
          name: '长清区',
          number: 278,
          category: 1,
          id: 12,
          draggable: false,
        },
        {
          name: '章丘区',
          number: 209,
          category: 1,
          id: 13,
          draggable: false,
        },
        {
          name: '济阳区',
          number: 312,
          category: 1,
          id: 14,
          draggable: false,
        },
        {
          name: '莱芜区',
          number: 492,
          category: 1,
          id: 15,
          draggable: false,
        },
        {
          name: '钢城区',
          number: 394,
          category: 1,
          id: 16,
          draggable: false,
        },
        {
          name: '平阴县',
          number: 197,
          category: 1,
          id: 17,
          draggable: false,
        },
        {
          name: '高新区',
          number: 137,
          category: 1,
          id: 18,
          draggable: false,
        },
        {
          name: '南部山区',
          number: 163,
          category: 1,
          id: 19,
          draggable: false,
        },
        {
          name: '起步区',
          number: 176,
          category: 1,
          id: 20,
          draggable: false,
        },
      ],
      links: [
        {
          source: 0,
          target: 1,
          value: '区县',
        },
        {
          source: 0,
          target: 2,
          value: '区县',
        },
        {
          source: 0,
          target: 3,
          value: '区县',
        },
        {
          source: 0,
          target: 4,
          value: '区县',
        },
        {
          source: 0,
          target: 5,
          value: '业务',
        },
        {
          source: 0,
          target: 6,
          value: '业务',
        },
        {
          source: 0,
          target: 7,
          value: '业务',
        },
        {
          source: 0,
          target: 8,
          value: '业务',
        },
        {
          source: 0,
          target: 9,
          value: '业务',
        },
        {
          source: 0,
          target: 10,
          value: '业务',
        },
        {
          source: 1,
          target: 10,
          value: '业务',
        },
        {
          source: 2,
          target: 10,
          value: '业务',
        },
        {
          source: 2,
          target: 6,
          value: '业务',
        },
        {
          source: 2,
          target: 5,
          value: '业务',
        },
        {
          source: 3,
          target: 5,
          value: '业务',
        },
        {
          source: 0,
          target: 11,
          value: '区县',
        },
        {
          source: 0,
          target: 12,
          value: '区县',
        },
        {
          source: 0,
          target: 13,
          value: '区县',
        },
        {
          source: 0,
          target: 14,
          value: '区县',
        },
        {
          source: 0,
          target: 15,
          value: '区县',
        },
        {
          source: 0,
          target: 16,
          value: '区县',
        },
        {
          source: 0,
          target: 17,
          value: '区县',
        },
        {
          source: 0,
          target: 18,
          value: '区县',
        },
        {
          source: 0,
          target: 19,
          value: '区县',
        },
        {
          source: 0,
          target: 20,
          value: '区县',
        },
        {
          source: 1,
          target: 6,
          value: '区县',
        },
        {
          source: 1,
          target: 8,
          value: '区县',
        },
        {
          source: 1,
          target: 9,
          value: '区县',
        },
        {
          source: 1,
          target: 5,
          value: '区县',
        },
        {
          source: 2,
          target: 7,
          value: '区县',
        },
        {
          source: 2,
          target: 9,
          value: '区县',
        },
        {
          source: 3,
          target: 9,
          value: '区县',
        },
        {
          source: 3,
          target: 10,
          value: '区县',
        },
        {
          source: 4,
          target: 6,
          value: '区县',
        },
        {
          source: 4,
          target: 7,
          value: '区县',
        },
        {
          source: 4,
          target: 8,
          value: '区县',
        },
        {
          source: 11,
          target: 6,
          value: '区县',
        },
        {
          source: 11,
          target: 7,
          value: '区县',
        },
        {
          source: 11,
          target: 8,
          value: '区县',
        },
        {
          source: 12,
          target: 6,
          value: '区县',
        },
        {
          source: 12,
          target: 7,
          value: '区县',
        },
        {
          source: 12,
          target: 8,
          value: '区县',
        },
        {
          source: 13,
          target: 6,
          value: '区县',
        },
        {
          source: 13,
          target: 5,
          value: '区县',
        },
        {
          source: 13,
          target: 9,
          value: '区县',
        },
        {
          source: 13,
          target: 10,
          value: '区县',
        },
        {
          source: 14,
          target: 6,
          value: '区县',
        },
        {
          source: 14,
          target: 5,
          value: '区县',
        },
        {
          source: 14,
          target: 9,
          value: '区县',
        },
        {
          source: 14,
          target: 10,
          value: '区县',
        },
        {
          source: 15,
          target: 6,
          value: '区县',
        },
        {
          source: 15,
          target: 5,
          value: '区县',
        },
        {
          source: 15,
          target: 7,
          value: '区县',
        },
        {
          source: 15,
          target: 10,
          value: '区县',
        },
        {
          source: 16,
          target: 8,
          value: '区县',
        },
        {
          source: 16,
          target: 5,
          value: '区县',
        },
        {
          source: 16,
          target: 7,
          value: '区县',
        },
        {
          source: 16,
          target: 9,
          value: '区县',
        },
        {
          source: 17,
          target: 8,
          value: '区县',
        },
        {
          source: 17,
          target: 5,
          value: '区县',
        },
        {
          source: 17,
          target: 7,
          value: '区县',
        },
        {
          source: 17,
          target: 9,
          value: '区县',
        },
        {
          source: 18,
          target: 8,
          value: '区县',
        },
        {
          source: 18,
          target: 5,
          value: '区县',
        },
        {
          source: 18,
          target: 7,
          value: '区县',
        },
        {
          source: 18,
          target: 9,
          value: '区县',
        },
        {
          source: 19,
          target: 8,
          value: '区县',
        },
        {
          source: 19,
          target: 5,
          value: '区县',
        },
        {
          source: 19,
          target: 7,
          value: '区县',
        },
        {
          source: 19,
          target: 9,
          value: '区县',
        },
        {
          source: 20,
          target: 8,
          value: '区县',
        },
        {
          source: 20,
          target: 5,
          value: '区县',
        },
        {
          source: 20,
          target: 7,
          value: '区县',
        },
        {
          source: 20,
          target: 9,
          value: '区县',
        },
      ],
      toparrys: [],
      buttomarrys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    getdatas(number) {
      if (number || number == 0) {
        return this.datas[number].name;
      } else {
        return '';
      }
    },
    drawChart() {
      // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
      let myChart = this.$echarts.init(document.getElementById('main'));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '政策文件关系知识图谱',
        },
        tooltip: {
          formatter: function (x) {
            return x.data.name + '-' + (x.data.number || '');
            // + ' index:' + x.dataIndex
          },
        },
        toolbox: {
          // 显示工具箱
          show: true,
          feature: {
            mark: {
              show: true,
            },
            // 还原
            restore: {
              show: true,
            },
            // 保存为图片
            saveAsImage: {
              show: true,
            },
          },
        },
        animationDurationUpdate: 2000,
        animationEasingUpdate: 'quinticInOut',
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 14,
            },
          },
        },
        legend: {
          x: 'center',
          show: true,
          data: ['济南市', '区县', '业务'],
        },
        series: [
          {
            type: 'graph', // 类型:关系图
            layout: 'force', //图的布局，类型为力导图
            symbolSize: 70, // 调整节点的大小
            roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            focusNodeAdjacency: true,
            draggable: true, // 拖动
            categories: [
              {
                name: '济南市',
                itemStyle: {
                  normal: {
                    color: '#4592FF',
                  },
                },
              },
              {
                name: '区县',
                itemStyle: {
                  normal: {
                    color: '#00aaf0',
                  },
                },
              },
              {
                name: '业务',
                itemStyle: {
                  normal: {
                    color: 'green',
                  },
                },
              },
            ],
            // 圆框内样式
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 14,
                },
                formatter: function (x) {
                  return x.data.name + '\n' + (x.data.number || '');
                },
              },
            },
            force: {
              repulsion: 7000, //排斥力
              edgeLength: [10, 50], //边缘长度
              // initLayout: 'circular', //初始布局
              // repulsion: 20,
              // gravity: 0.2,
              // layoutAnimation: false,
            },
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0, // 0:直线，1、弧线
              },
            },
            edgeSymbolSize: [100, 180],
            edgeLabel: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                },
                formatter: '{c}', //线上内容
              },
            },
            data: this.datas,
            links: this.links,
          },
        ],
      };

      var that = this;
      myChart.on('click', function (param) {
        console.log('node节点的数组---->', param); // 打印出param, 可以看到里边有很多参数可以使用
        //获取节点点击的数组序号
        if (param.dataType == 'node') {
          // alert("点击了节点" + param.name)
          that.toparrys = [];
          that.buttomarrys = [];
          that.selectdsata = param.data;
          that.links.filter(element => {
            if (element.target == param.dataIndex) {
              that.toparrys.push(element.source);
            }
            if (element.source == param.dataIndex) {
              that.buttomarrys.push(element.target);
            }
          });
          console.log('toparrys', that.toparrys);
          console.log('buttomarrys', that.buttomarrys);
        } else {
          // alert("点击了边" + param.value)
          console.log('点击了边' + param.name);
        }
      });
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.mainres {
  width: 80%;
  height: 100%;
  border: 1px #f0f0f0 solid;
  overflow: hidden;
}
.contents {
  background-color: #f0f0f0;
  font-size: 16px;
  width: 20%;
  height: 100%;
  overflow: auto;
}
.top_style {
  line-height: 40px;
  height: 40px;
  padding: 0 20px;
  background-color: #bae7ff;
  margin-bottom: 5px;
}
.top_styles {
  line-height: 30px;
  height: 30px;
  padding: 0 20px;
  background: #f0f8ff;
  margin-bottom: 5px;
}
</style>
