<template>
  <div class="box_root">
    <a-list :loading="loading">
      <header>
        <h1>可视化统计</h1>
        <div class="showTime"></div>
      </header>
      <section class="mainbox">
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="panel line">
              <h2>签审超期评估</h2>
              <div class="chart" id="pygu"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>发文量</h2>
              <div class="chart" id="fawfld"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel pie2">
              <h2>站点发文量</h2>
              <div class="chart" id="site_fawf"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel grlmlv">
              <h2>文件关联率</h2>
              <div class="chart" id="grlmlv"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel bar">
              <h2>多媒体使用评估</h2>
              <div class="chart" id="bar"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel">
              <h2>多媒体使用评估</h2>
              <div class="chart" id="domzti_pie"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel">
              <h2>访问量评估-折线图</h2>
              <div class="chart" id="viwes_line"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="panel">
              <h2>访问量评估-柱状图</h2>
              <div class="chart" id="viwes_bar"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
        </a-row>
      </section>
    </a-list>
  </div>
</template>

<script>
import { Pie, Line, Column } from "@antv/g2plot";
import {
  daycounts,
  organizations,
  relevance,
  chart_frequency,
  chart_multimedi,
  chart_visit,
} from "@/services/evaluation";
export default {
  data() {
    return {
      loading: true,
      time: 3000,
      organizations: [],
      indext: 0,
      relevancelist: [],
      areaPlot: {},
      donutPlot: {},
      fawfld_xvb: [],
      fawfld_yvb: [],
      depart_eff: [],
      pygu_time: [],
      multimedia: [],
      pygu_data: [
        {
          lasttime: "6月",
          avg: 24,
          name: "市人民政府",
        },
        {
          lasttime: "7月",
          avg: 40,
          name: "市人民政府",
        },
        {
          lasttime: "8月",
          avg: 100,
          name: "市人民政府",
        },
        {
          lasttime: "9月",
          avg: 98,
          name: "市人民政府",
        },
        {
          lasttime: "10月",
          avg: 80,
          name: "市人民政府",
        },
        {
          lasttime: "11月",
          avg: 65,
          name: "市人民政府",
        },
        {
          lasttime: "12月",
          avg: 25,
          name: "市人民政府",
        },
        {
          lasttime: "1月",
          avg: 56,
          name: "市人民政府",
        },
        {
          lasttime: "2月",
          avg: 78,
          name: "市人民政府",
        },
        {
          lasttime: "3月",
          avg: 23,
          name: "市人民政府",
        },
        {
          lasttime: "4月",
          avg: 210,
          name: "市人民政府",
        },
        {
          lasttime: "5月",
          avg: 120,
          name: "市人民政府",
        },

        {
          lasttime: "6月",
          avg: 40,
          name: "市发展改革委",
        },
        {
          lasttime: "7月",
          avg: 64,
          name: "市发展改革委",
        },
        {
          lasttime: "8月",
          avg: 191,
          name: "市发展改革委",
        },
        {
          lasttime: "9月",
          avg: 324,
          name: "市发展改革委",
        },
        {
          lasttime: "10月",
          avg: 290,
          name: "市发展改革委",
        },
        {
          lasttime: "11月",
          avg: 330,
          name: "市发展改革委",
        },
        {
          lasttime: "12月",
          avg: 310,
          name: "市发展改革委",
        },
        {
          lasttime: "1月",
          avg: 213,
          name: "市发展改革委",
        },
        {
          lasttime: "2月",
          avg: 180,
          name: "市发展改革委",
        },
        {
          lasttime: "3月",
          avg: 200,
          name: "市发展改革委",
        },
        {
          lasttime: "4月",
          avg: 180,
          name: "市发展改革委",
        },
        {
          lasttime: "5月",
          avg: 79,
          name: "市发展改革委",
        },

        {
          lasttime: "6月",
          avg: 55,
          name: "市教育体育局",
        },
        {
          lasttime: "7月",
          avg: 40,
          name: "市教育体育局",
        },
        {
          lasttime: "8月",
          avg: 101,
          name: "市教育体育局",
        },
        {
          lasttime: "9月",
          avg: 134,
          name: "市教育体育局",
        },
        {
          lasttime: "10月",
          avg: 90,
          name: "市教育体育局",
        },
        {
          lasttime: "11月",
          avg: 436,
          name: "市教育体育局",
        },
        {
          lasttime: "12月",
          avg: 222,
          name: "市教育体育局",
        },
        {
          lasttime: "1月",
          avg: 0,
          name: "市教育体育局",
        },
        {
          lasttime: "2月",
          avg: 32,
          name: "市教育体育局",
        },
        {
          lasttime: "3月",
          avg: 78,
          name: "市教育体育局",
        },
        {
          lasttime: "4月",
          avg: 95,
          name: "市教育体育局",
        },
        {
          lasttime: "5月",
          avg: 66,
          name: "市教育体育局",
        },

        {
          lasttime: "6月",
          avg: 123,
          name: "市科技局",
        },
        {
          lasttime: "7月",
          avg: 175,
          name: "市科技局",
        },
        {
          lasttime: "8月",
          avg: 112,
          name: "市科技局",
        },
        {
          lasttime: "9月",
          avg: 197,
          name: "市科技局",
        },
        {
          lasttime: "10月",
          avg: 121,
          name: "市科技局",
        },
        {
          lasttime: "11月",
          avg: 67,
          name: "市科技局",
        },
        {
          lasttime: "12月",
          avg: 98,
          name: "市科技局",
        },
        {
          lasttime: "1月",
          avg: 21,
          name: "市科技局",
        },
        {
          lasttime: "2月",
          avg: 43,
          name: "市科技局",
        },
        {
          lasttime: "3月",
          avg: 64,
          name: "市科技局",
        },
        {
          lasttime: "4月",
          avg: 76,
          name: "市科技局",
        },
        {
          lasttime: "5月",
          avg: 38,
          name: "市科技局",
        },

        {
          lasttime: "6月",
          avg: 143,
          name: "市工业和信息化局",
        },
        {
          lasttime: "7月",
          avg: 131,
          name: "市工业和信息化局",
        },
        {
          lasttime: "8月",
          avg: 165,
          name: "市工业和信息化局",
        },
        {
          lasttime: "9月",
          avg: 123,
          name: "市工业和信息化局",
        },
        {
          lasttime: "10月",
          avg: 178,
          name: "市工业和信息化局",
        },
        {
          lasttime: "11月",
          avg: 21,
          name: "市工业和信息化局",
        },
        {
          lasttime: "12月",
          avg: 82,
          name: "市工业和信息化局",
        },
        {
          lasttime: "1月",
          avg: 64,
          name: "市工业和信息化局",
        },
        {
          lasttime: "2月",
          avg: 43,
          name: "市工业和信息化局",
        },
        {
          lasttime: "3月",
          avg: 60,
          name: "市工业和信息化局",
        },
        {
          lasttime: "4月",
          avg: 19,
          name: "市工业和信息化局",
        },
        {
          lasttime: "5月",
          avg: 34,
          name: "市工业和信息化局",
        },
      ],
      viwes_arr: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.list();
    });
  },
  beforeDestroy(){
    clearTimeout(this.t);
    this.t = null;
  },
  methods: {
    list() {
      Promise.all([
        daycounts(),
        organizations(),
        relevance(),
        // chart_frequency(),
        chart_multimedi(),
        chart_visit(),
      ])
        .then((res) => {
          this.charts6Arr = res[0].data.data;
          this.fawfld_vexm(this.charts6Arr);

          this.organizations = res[1].data.data;
          this.site_post(this.organizations);

          this.relevancelist = res[2].data.data;
          this.correlation_rate(this.relevancelist);

          // this.depart_eff = res[3].data.data;
          this.pygu(this.depart_eff);

          this.multimedia = res[3].data.data.organization;
          this.domzti(this.multimedia);
          this.domzti_pie(res[3].data.data.multimedi);

          this.viwes_line(res[4].data.data.visit);
          this.viwes_bar(res[4].data.data.organization);

          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //折线图-超期评估
    pygu() {
      const line = new Line("pygu", {
        data: this.pygu_data,
        xField: "lasttime",
        yField: "avg",
        seriesField: "name",
        legend: {
          position: "top-right",
          itemName: {
            style: {
              fontSize: 14,
              fill: "#fff",
            },
          },
        },
        xAxis: {
          label: {
            style: {
              fill: "#fff",
              fontSize: 12,
            },
            rotate: -1,
          },
          range: [0, 1],
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                lineDash: [4, 5],
                strokeOpacity: 0.3,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        yAxis: {
          label: {
            style: {
              fill: "#fff",
            },
          },
          line: {
            stroke: "#fff",
            lineWidth: 1,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                strokeOpacity: 0.5,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        color: [
          "#1979C9",
          "#D62A0D",
          "#FAA219",
          "#00f2f1",
          "#ed3f35",
          "#006cff",
        ],
        smooth: true,
      });
      line.render();
    },
    domzti(data) {
      const stackedColumnPlot = new Column("bar", {
        data,
        isStack: true,
        xField: "title",
        yField: "value",
        seriesField: "type",
        legend: {
          itemHeight: 15,
          marker: {
            style: {
              symbol: "diamond",
              r: 7,
            },
          },
          itemName: {
            style: {
              fontSize: 14,
              fill: "#fff",
            },
          },
        },
        xAxis: {
          label: {
            style: {
              fill: "#fff",
              fontSize: 12,
            },
            // rotate: -1,
            // labelLine:true,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                lineDash: [4, 5],
                strokeOpacity: 0.3,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        yAxis: {
          label: {
            style: {
              fill: "#fff",
            },
          },
          line: {
            stroke: "#fff",
            lineWidth: 1,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                // lineDash: [4, 5],
                strokeOpacity: 0.5,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        slider: {
          start: 0,
          end: 0.3,
          textStyle: {
            fill: "#fff",
          },
        },
        label: {
          // 可手动配置 label 数据标签位置
          position: "middle", // 'top', 'bottom', 'middle'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: "interval-adjust-position" },
            // 数据标签防遮挡
            { type: "interval-hide-overlap" },
            // 数据标签文颜色自动调整
            { type: "adjust-color" },
          ],
        },
      });
      stackedColumnPlot.render();
    },

    // 多媒体评估-饼状图
    domzti_pie(data) {
      const piePlot = new Pie("domzti_pie", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.7,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        legend: {
          layout: "horizontal",
          position: "top-right",
          itemName: {
            style: {
              fontSize: 14,
              fill: "#fff",
            },
          },
          marker: {
            style: {
              symbol: "triangle",
              r: 6,
            },
          },
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              color: "#fff",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            content: "多媒体评估",
          },
        },
      });

      piePlot.render();
    },

    fawfld_vexm(data) {
      const linePlot = new Line("fawfld", {
        data,
        xField: "_id",
        yField: "count",
        color: "#00d887",
        meta: {
          _id: {
            alias: "时间",
          },
          count: {
            alias: "发文量",
          },
        },
        xAxis: {
          label: {
            style: {
              fill: "#fff",
              fontSize: 12,
            },
            rotate: -1,
          },
          range: [0, 1],
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                lineDash: [4, 5],
                strokeOpacity: 0.2,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
          // range: [0, 1],
        },
        yAxis: {
          label: {
            style: {
              fill: "#fff",
            },
          },
          line: {
            stroke: "#fff",
            lineWidth: 1,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                strokeOpacity: 0.5,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },

        legend: {
          position: "top",
        },
        smooth: true,
        // 配置折线趋势填充
        area: {
          style: {
            fillOpacity: 0.15,
          },
        },
        // animation: {
        //   appear: {
        //     animation: "wave-in",
        //     duration: 3000,
        //   },
        // },
      });
      linePlot.render();
    },

    // 关联率

    correlation_rate(data) {
      const data_s = [
        { type: "关联", value: parseInt(data.relevance) },
        { type: "未关联", value: parseInt(data.nrelevance) },
      ];
      const piePlot = new Pie("grlmlv", {
        appendPadding: 10,
        data: data_s,
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        label: {
          type: "inner",
          offset: "-30%",
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: "center",
          },
        },
        legend: {
          position: "top-right",
          marker: {
            style: {
              symbol: "triangle-down",
              r: 6,
            },
          },
          itemName: {
            style: {
              fontSize: 14,
              fill: "#fff",
            },
          },
        },
        interactions: [{ type: "element-active" }],
      });

      piePlot.render();
    },

    //站点发文量
    site_post(data) {
      const piePlot = new Pie("site_fawf", {
        appendPadding: 10,
        data: data,
        angleField: "value",
        colorField: "name",
        radius: 0.75,
        color: ["#56D0E3", "#F8B448", "#8B78F6"],

        label: {
          type: "spider",
          labelHeight: 30,
          content: "{name}",
          style: {
            fontSize: 14,
            fill: "#fff",
          },
        },
        legend: {
          layout: "vertical",
          itemName: {
            style: {
              fontSize: 14,
              fill: "#fff",
            },
          },
          marker: {
            style: {
              r: 6,
            },
          },
        },
        tooltip: {
          follow: true,
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      });

      piePlot.render();
    },

    // 访问量评估-折线图
    viwes_line(data) {
      const linePlot = new Line("viwes_line", {
        data: data,
        xField: "_id",
        yField: "count",
        color: "deeppink",
        legend: {
          position: "top",
        },
        smooth: true,
        // 配置折线趋势填充
        area: {
          style: {
            fillOpacity: 0.15,
          },
        },
        xAxis: {
          label: {
            style: {
              fill: "#fff",
              fontSize: 12,
            },
            rotate: -1,
          },
          range: [0, 1],
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                lineDash: [4, 5],
                strokeOpacity: 0.3,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        yAxis: {
          label: {
            style: {
              fill: "#fff",
            },
          },
          line: {
            stroke: "pink",
            lineWidth: 1,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                strokeOpacity: 0.5,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        meta: {
          _id: {
            alias: "时间",
          },
          count: {
            alias: "访问量",
          },
        },
        animation: {
          appear: {
            animation: "wave-in",
            duration: 3000,
          },
        },
      });

      linePlot.render();
    },
    // 访问量评估-柱状图
    viwes_bar(data) {
      const column = new Column("viwes_bar", {
        data: data,
        xField: "title",
        yField: "status",
        xAxis: {
          label: {
            style: {
              fill: "#fff",
              fontSize: 12,
            },
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                lineDash: [4, 5],
                strokeOpacity: 0.3,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        yAxis: {
          label: {
            style: {
              fill: "#fff",
            },
          },
          line: {
            stroke: "#fff",
            lineWidth: 1,
          },
          grid: {
            line: {
              style: {
                stroke: "skyblue",
                lineWidth: 1,
                strokeOpacity: 0.5,
                shadowColor: "pink",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        meta: {
          title: {
            alias: "类别",
          },
          status: {
            alias: "访问量",
          },
        },
        slider: {
          start: 0,
          end: 0.7,
          textStyle: {
            fill: "#fff",
          },
        },
      });

      column.render();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
.box_root {
  background: linear-gradient(#091440,#0b27a1,#00124b);
  line-height: 1.15;
}
header {
  position: relative;
  height: 100px;
}
header h1 {
  color: #fff;
  text-align: center;
  font-size: 38px;
  line-height: 80px;
}
header .showTime {
  position: absolute;
  right: 30px;
  top: 0;
  line-height: 75px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
}
.mainbox {
  overflow: hidden;
  min-width: 1024px;
  max-width: 1920px;
  margin: 0 auto;
  padding: 10px 10px 0;
}

.mainbox .panel {
  position: relative;
  height: 410px;
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 0 15px 40px;
  margin-bottom: 15px;
}
.mainbox .panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
}
.mainbox .panel::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border-right: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
}
.mainbox .panel .panel-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.mainbox .panel .panel-footer::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 15px;
  height: 15px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
}
.mainbox .panel .panel-footer::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
}
.mainbox .panel h2 {
  height: 48px;
  line-height: 48px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  font-weight: 400;
}
.mainbox .panel a {
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
}
.mainbox .panel .chart {
  height: 340px;
}
</style>
