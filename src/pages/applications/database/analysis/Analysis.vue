<template>
  <div class="analysis">
    <a-spin tip="Loading..." :spinning="spinning">
      <a-row style="margin-top: 0" :gutter="12">
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card title="查询量" :total="datas.select"> </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card title="数据量" :total="datas.value"> </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card title="报表量" :total="datas.report"> </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card title="字段量" :total="datas.fields"> </chart-card>
        </a-col>
      </a-row>
      <div class="charts">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col
            style="padding: 0 12px"
            :xl="11"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
            class="charts_a_col_one"
          >
            <div class="title">查询统计图</div>
            <div id="fillInTheLineChart"></div>
          </a-col>
          <a-col
            style="padding: 0 12px"
            :xl="11"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
            class="charts_a_col_two"
          >
            <div class="title">数据录入统计图</div>
            <div id="proportionOfEachCategory"></div>
          </a-col>
        </a-row>
        <div style="height: 30px"></div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import ChartCard from "@/components/card/ChartCard";
import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import Bar from "@/components/chart/Bar";
import RankingList from "@/components/chart/RankingList";
import HotSearch from "./HotSearch";
import SalesData from "./SalesData";
import Trend from "@/components/chart/Trend";
import dataV from "@jiaminghi/data-view";
import Vue from "vue";
import { Column, Area } from "@antv/g2plot";

import { value_sum, filter_select, create_select } from "@/services/database";
Vue.use(dataV);
export default {
  name: "Analysis",
  i18n: require("./i18n"),
  data() {
    return {
      indxt: 0,
      linePlot: {},
      piePlot2: {},
      spinning: false, // 默认不出于加载中
      datas: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    // this.initMap();
  },
  components: {
    Trend,
    SalesData,
    HotSearch,
    RankingList,
    Bar,
    MiniProgress,
    MiniBar,
    MiniArea,
    ChartCard,
  },
  methods: {
    init() {
      this.spinning = true;
      Promise.all([value_sum(), filter_select(), create_select()]).then(
        (res) => {
          this.indxt++;
          this.datas = res[0].data.data;
          this.fillInTheLineChart(res[1].data.data.reverse());
          this.enterpriseScale(res[2].data.data.reverse());
        }
      );
      this.spinning = false;
    },
    // 企业填报折线图
    fillInTheLineChart(item) {
      if (this.indxt == 1) {
        this.linePlot = new Column("fillInTheLineChart", {
          data: item,
          xField: "name",
          yField: "count",
          point: {
            size: 5,
            shape: "diamond",
            style: {
              fill: "white",
              stroke: "#5B8FF9",
              lineWidth: 2,
            },
          },
        });
        this.linePlot.render();
      } else {
        this.linePlot.update({ data: item });
      }
    },
    // 企业规模饼形图
    enterpriseScale(item) {
      if (this.indxt == 1) {
        this.piePlot2 = new Area("proportionOfEachCategory", {
          appendPadding: 10,
          data: item,
          xField: "name",
          yField: "count",
          xAxis: {
            range: [0, 1],
          },
        });
        this.piePlot2.render();
      } else {
        this.piePlot2.update({ data: item });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}
@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}
@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}
#zhongdiancontainer {
  width: 92%;
  height: 450px;
  margin: 10px auto;
  box-shadow: 5px 5px 3px #666;
  border-radius: 30px;
}
</style>
<style>
.map {
  position: relative;
  margin: 0 auto;
  width: 21vw;
  height: 25vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.city {
  position: absolute;
  right: 223px;
  top: 201px;
}
.citys {
  position: absolute;
  right: 162px;
  top: 225px;
}
.cityss {
  position: absolute;
  right: 240px;
  top: 245px;
}
.city_one {
  font-size: 14px;
  font-weight: 600;
  color: #444;
  position: absolute;
  right: 200px;
  top: 211px;
}
.city_two {
  font-size: 14px;
  font-weight: 600;
  color: #444;
  position: absolute;
  right: 144px;
  top: 235px;
}
.city_three {
  font-size: 14px;
  font-weight: 600;
  color: #444;
  position: absolute;
  right: 218px;
  top: 255px;
}
.dotted {
  width: 6px;
  height: 6px;
  background-color: #c66584;
  border-radius: 50%;
}
.city div[class^="pulse"] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  box-shadow: 0 0 12px #7937e4;
  border-radius: 50%;
  animation: pulse 1.8s ease-in infinite;
}
.citys div[class^="pulse"] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  box-shadow: 0 0 12px #7937e4;
  border-radius: 50%;
  animation: pulse 2s ease-in infinite;
}
.cityss div[class^="pulse"] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  box-shadow: 0 0 12px #7937e4;
  border-radius: 50%;
  animation: pulse 2.6s ease-in infinite;
}
.pulse2 {
  animation-delay: 1s !important;
}
.pulse3 {
  animation-delay: 1.6s !important;
}
@keyframes pulse {
  0% {
  }
  70% {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
  100% {
    width: 70px;
    height: 70px;
    opacity: 0;
  }
}
.rank .list li {
  margin-top: 22px !important;
}
/* 去除高德地图的logo */
.amap-logo {
  display: none;
  opacity: 0 !important;
}
.amap-copyright {
  opacity: 0;
}
</style>
<style scoped>
.analysis >>> .chart-card-footer {
  border-top: 0px;
}
.analysis >>> .ant-row {
  margin: 20px !important;
}
.analysis >>> .chart-card-content {
  height: 0px;
}
.analysis >>> .chart-card-title {
  font-size: 20px;
}
/* 中间一层（第二层），公司分布 */
.CompanyDistribution .CompanyDistributionOne {
  height: 540px;
  margin: 0 0 0 17px;
}
/* 中间一层（第二层），公司排名 */
.CompanyDistribution .CompanyDistributionTwo {
  height: 540px;
  float: right;
  margin: 0 17px 0 0;
}
/* 最下面一层（第三层），承装数据可视化部分 */
.charts {
  margin: 25px 0px;
}
/* 数据可视化的第一个图,第二个图 */
.charts_a_col_one,
.charts_a_col_two {
  background: #fff;
}
/* 数据可视化的第一个图 */
.charts_a_col_one {
  margin-right: 10px;
}
/* 第一个图中的标题样式 */
.charts_a_col_one .title {
  font-size: 24px;
  padding: 15px;
  text-align: center;
}
/* 数据可视化的第二个图 */
.charts_a_col_two {
  margin-left: 10px;
}
/* 第二个图中的标题样式 */
.charts_a_col_two .title {
  font-size: 24px;
  padding: 15px;
  text-align: center;
}
/* 数据可视化图中的第一个 */
#fillInTheLineChart {
  padding: 32px;
  height: 500px;
}
/* 可视化图中的第二个 */
#proportionOfEachCategory {
  padding: 32px;
  height: 500px;
}
</style>
