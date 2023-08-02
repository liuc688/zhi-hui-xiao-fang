<template>
  <div id="main" class="mainres"></div>
</template>

<script>
import * as echarts from 'echarts';
import Vue from 'vue';
Vue.prototype.$echarts = echarts;
export default {
  name: 'gpolyline',
  data() {
    return {
      datas: '',
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
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
            console.log('x', x);
            return x.data.name + '-' + (x.data.number || 32) + ' index:' + x.dataIndex;
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
              fontSize: 12,
            },
          },
        },
        legend: {
          x: 'center',
          show: true,
          data: ['市本级', '市中区', '历下区', '槐荫区', '天桥区'],
        },
        series: [
          {
            type: 'graph', // 类型:关系图
            layout: 'force', //图的布局，类型为力导图
            symbolSize: 50, // 调整节点的大小
            roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            focusNodeAdjacency: true,
            draggable: false, // 拖动
            categories: [
              {
                name: '市本级',
                itemStyle: {
                  normal: {
                    color: '#4592FF',
                  },
                },
              },
              {
                name: '历下区',
                itemStyle: {
                  normal: {
                    color: '#4592FF',
                  },
                },
              },
              {
                name: '市中区',
                itemStyle: {
                  normal: {
                    color: '#00aaf0',
                  },
                },
              },

              {
                name: '槐荫区',
                itemStyle: {
                  normal: {
                    color: '#3f592F',
                  },
                },
              },
            ],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                },
                formatter: function (x) {
                  console.log('x', x);
                  return x.data.name + '\n' + (x.data.number || 32) + '\n index:' + x.dataIndex;
                },
              },
            },
            force: {
              repulsion: 2500, //排斥力
              edgeLength: [10, 50], //边缘长度
            },
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0,
              },
            },
            edgeSymbolSize: [7, 50],
            edgeLabel: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                },
                formatter: '', //线上内容
              },
            },
            data: [
              {
                name: '济南政策文件',
                category: 0,
                symbolSize: 60,
                id: 0,
                draggable: false,
              },
              {
                name: '市本级',
                category: 0,
                number: 452,
                id: 1,
                draggable: false,
              },
              {
                name: '历下区',
                number: 394,
                category: 1,
                id: 2,
                draggable: false,
              },
              {
                name: '市中区',
                category: 1,
                id: 3,
                draggable: false,
              },
              {
                name: '槐荫区',
                category: 1,
                id: 4,
                draggable: false,
              },
              {
                name: '天桥区',
                category: 1,
                id: 5,
                draggable: false,
              },
              {
                name: '历城区',
                category: 1,
                id: 6,
                draggable: false,
              },
              {
                name: '长清区',
                category: 1,
                id: 7,
                draggable: false,
              },
              {
                name: '章丘区',
                category: 1,
                id: 8,
                draggable: false,
              },
              {
                name: '济阳区',
                category: 1,
                id: 9,
                draggable: false,
              },
              {
                name: '莱芜区',
                category: 1,
                id: 10,
                draggable: false,
              },
              {
                name: '钢城区',
                category: 1,
                id: 11,
                draggable: false,
              },
              {
                name: '平阴区',
                category: 1,
                id: 12,
                draggable: false,
              },
              {
                name: '商河县',
                category: 1,
                id: 13,
                draggable: false,
              },
              {
                name: '高新区',
                category: 1,
                id: 14,
                draggable: false,
              },
              {
                name: '南山部区',
                category: 1,
                id: 15,
                draggable: false,
              },
              {
                name: '起步区',
                category: 1,
                id: 16,
                draggable: false,
              },
              {
                name: '政府规章',
                category: 0,
                id: 17,
                draggable: false,
                number: 54,
              },
              {
                name: '规范性文件',
                category: 0,
                id: 18,
                draggable: false,
                number: 58,
              },
              {
                name: '政府文件',
                category: 0,
                id: 19,
                draggable: false,
                number: 192,
              },
              {
                name: '政府规范性文件',
                category: 0,
                draggable: false,
                id: 20,
                number: 41,
              },
              {
                name: '部门规范性文件',
                category: 0,
                id: 21,
                draggable: false,
                number: 17,
              },
              {
                name: '政府办文件',
                category: 0,
                id: 22,

                draggable: false,
                number: 113,
              },
              {
                name: '部门文件',
                category: 0,
                id: 23,
                draggable: false,
                number: 1,
              },
              {
                name: '其他文件',
                category: 0,
                id: 24,
                draggable: false,
                number: 3,
              },
              {
                name: '规范性文件备案目录',
                category: 0,
                id: 25,
                draggable: false,
                number: 18,
              },
              {
                name: '规范性文件清理结果',
                category: 0,
                id: 26,
                draggable: false,
                number: 13,
              },
              {
                name: '政府文件',
                category: 0,
                id: 27,
                draggable: false,
                number: 29,
              },
              {
                name: '政府办文件',
                category: 0,
                id: 28,
                draggable: false,
                number: 84,
              },
              {
                name: '规范性文件',
                category: 0,
                id: 29,
                draggable: false,
                number: 15,
              },
              {
                name: '规范性文件备案目录',
                category: 0,
                id: 30,
                draggable: false,
                number: 9,
              },
              {
                name: '规范性文件备案目录',
                category: 0,
                id: 31,
                draggable: false,
                number: 10,
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
                value: '区县',
              },
              {
                source: 0,
                target: 6,
                value: '区县',
              },
              {
                source: 0,
                target: 7,
                value: '区县',
              },
              {
                source: 0,
                target: 8,
                value: '区县',
              },
              {
                source: 0,
                target: 9,
                value: '区县',
              },
              {
                source: 0,
                target: 10,
                value: '区县',
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
                source: 1,
                target: 17,
                value: '履职依据',
              },
              {
                source: 1,
                target: 18,
                value: '履职依据',
              },
              {
                source: 1,
                target: 19,
                value: '履职依据',
              },
              {
                source: 1,
                target: 20,
                value: '履职依据',
              },
              {
                source: 1,
                target: 21,
                value: '履职依据',
              },
              {
                source: 1,
                target: 22,
                value: '履职依据',
              },
              {
                source: 1,
                target: 23,
                value: '履职依据',
              },
              {
                source: 1,
                target: 24,
                value: '履职依据',
              },
              {
                source: 1,
                target: 25,
                value: '履职依据',
              },
              {
                source: 1,
                target: 26,
                value: '履职依据',
              },
              {
                source: 2,
                target: 27,
                value: '履职依据',
              },
              {
                source: 2,
                target: 28,
                value: '履职依据',
              },
              {
                source: 2,
                target: 29,
                value: '履职依据',
              },
              {
                source: 2,
                target: 30,
                value: '履职依据',
              },
              {
                source: 2,
                target: 31,
                value: '履职依据',
              },
            ],
          },
        ],
      };
      myChart.on('click', function (param) {
        console.log('param', param);
      });
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style>
.mainres {
  width: 100%;
  height: 100%;
  border: 1px #868586 solid;
  overflow: hidden;
}
</style>
