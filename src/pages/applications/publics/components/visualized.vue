<template>
  <div class="main">
    <a-back-top />
    <a-row :gutter="24">
      <a-col :span="8" class="col_style">
        <h3>状态</h3>
        <div style="height: 400px" v-show="show">
          <a-skeleton active :paragraph="{ rows: 5 }" />
        </div>
        <div v-show="!show" id="pie" style="height: 400px"></div>
      </a-col>
      <a-col :span="16" class="col_style">
        <h3>每月收件总量</h3>
        <div style="height: 400px" v-show="monthshow">
          <a-skeleton active :paragraph="{ rows: 5 }" />
        </div>
        <div v-show="!monthshow" id="lin" style="height: 400px"></div>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24" class="col_style">
        <h3>复议中平均每月数量</h3>
        <div style="height: 400px" v-show="lineshow">
          <a-skeleton active :paragraph="{ rows: 5 }" />
        </div>
        <div id="lins" v-show="!lineshow" style="height: 400px"></div>
      </a-col>
      <a-col :span="24" class="col_style">
        <h3>部门受理总数</h3>
        <div style="height: 400px" v-show="plotshow">
          <a-skeleton active :paragraph="{ rows: 5 }" />
        </div>
        <div id="plotLine" v-show="!plotshow" style="height: 400px"></div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Area, Pie, Line } from "@antv/g2plot";
import { count, reconsidercount, organstatus } from "@/services/public";
export default {
  data() {
    return {
      organization: [],
      pielist: [],
      show: true,
      monthshow: true,
      lineshow: true,
      plotshow: true,
      status:[],
      month:[],
      reconsider:[],
      reconsiders:[],
      index: 0,
      area:{},
      piePlot:{},
      line:{},
      lines:{}
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      Promise.all([count(), reconsidercount(), organstatus()])
        .then((res) => {
          this.index++;
          this.status= res[0].data.data.status
          this.month= res[0].data.data.month
          this.reconsider= res[1].data.data.reconsider
          this.reconsiders= res[2].data.data.reconsider
          // 状态及每月收件数
          for (let item in this.status) {
            this.pielist.push({
              value: this.status[item].count,
              type: this.status[item]._id,
            });
          }
          this.pieplot(this.pielist); //环形图
          this.antLine(this.month); //折线图
          // 复议中平均每月数量
          this.antLines(this.reconsider);
          // 组织获取
          this.plotLine(this.reconsiders);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 折线面积图
    plotLine(data) {
      if (this.index == 1) {
      this.area = new Area("plotLine", {
        data: data,
        height: 400,
        xField: "date",
        yField: "count",
        seriesField: "title",
        appendPadding: [24, 8, 24, 8],
        smooth: true,
        tooltip: {
          shared: false,
        },
        legend: {
          position: "right",
          layout: "optional",
          itemName: {
            style: {
              shadowOffsetY: 5,
            },
          },
        },
        scrollbar: {
          type: "horizontal",
        },
      });
      }
      this.area.render();
      this.plotshow = false;
    },
    // 圆环图-状态
    pieplot(data) {
      if (this.index == 1) {
      this.piePlot = new Pie("pie", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        height: 400,
        innerRadius: 0.6, //环形宽比
        content: "{percentage}",
        label: {
          type: "inner",
          offset: -20,
          offsetX: -5,
          autoRotate: false, //显示文字旋转
          content: "{value}件", //显示文字内容
          style: {
            fill: "#000000",
            fontSize: 18,
            stroke: "#ffffff",
            lineWidth: 2,
          },
        },
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
          content: {
            offsetY: 10,
            style: {
              fontSize: 40,
            },
            formatter: (datum, data) =>
              datum
                ? `${datum.value}`
                : `${data.reduce((r, d) => r + d.value, 0)}`,
          },
        },
        // 添加 中心统计文本 交互
        interactions: [{ type: "pie-statistic-active" }],
      });
      }
      this.piePlot.render();
      this.show = false;
    },
    // 折线图-每月
    antLine(data) {
      if (this.index == 1) {
      this.line = new Line("lin", {
        data,
        xField: "date",
        yField: "count",
        smooth: true,
        padding: [50],
        label: {
          offsetY: 5,
        },
        point: {
          size: 2,
          style: {
            fill: "white",
            stroke: "#2593fc",
            lineWidth: 2,
          },
        },
        tooltip: {
          formatter: (datum) => {
            return { name: "总计", value: datum.count };
          },
        },
        yAxis: {
          min: 0,
        },
      });
      }
      this.line.render();
      this.monthshow = false;
    },
    // 折线图-复议
    antLines(data) {
      if (this.index == 1) {
      this.lines = new Line("lins", {
        data,
        xField: "date",
        yField: "count",
        padding: [30, 30, 30, 30],
        label: {
          offsetY: 5,
        },
        point: {
          size: 2,
          style: {
            fill: "white",
            stroke: "#2593fc",
            lineWidth: 2,
          },
        },
        tooltip: {
          formatter: (datum) => {
            return { name: "总计", value: datum.count };
          },
        },
        yAxis: {
          min: 0,
        },
      });
      }
      this.lines.render();
      this.lineshow = false;
    },
    onReset() {
      this.show =true,
      this.monthshow= true,
      this.lineshow= true,
      this.plotshow= true,
      this.$nextTick(() => {
        setTimeout(() => {
          this.init()
        }, 500);
      });
    },
  },
};
</script>
<style scoped>
.col_style {
  background: #ffffff;
  border-radius: 5px;
  border: 6px solid #f0f2f5;
}
.main {
  padding: 12px 24px;
  margin: 0;
  min-height: 100%;
  background: #f0f0f0;
}
.main h3 {
  margin: 10px;
  font-weight: 600;
}
</style>