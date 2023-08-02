<!-- 宏观经济统计页面(可视化部分)(第八项) -->
<template>
  <div class="box_root">
    <a-list :loading="loading">
      <section class="mainbox">
        <a-row :gutter="[24, 24]">
          <!-- <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>各企业产品品类占比</h2>
              <div class="chart" id="container_one"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col> -->
          
          <!-- <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel line">
              <h2>企业规模详情</h2>
              <div class="chart" id="container_three"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col> -->
          <!-- <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel line panel1">
              <h2>企业产品分类产值产量</h2>
              <div class="chart chart1" id="container_four"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col> -->
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>营业收入总计</h2>
              <div class="chart" id="yingyeshouru"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>纳税额总计</h2>
              <div class="chart" id="nashui"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>利润总计</h2>
              <div class="chart" id="lirun"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>研发费用总计</h2>
              <div class="chart" id="yanfa"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel fawfld">
              <h2>工业总产值</h2>
              <div class="chart" id="chanzhi"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <div class="panel bar">
              <h2>企业状态详情</h2>
              <div class="chart" id="enterpriseStatus"></div>
              <div class="panel-footer"></div>
            </div>
          </a-col>
        </a-row>
      </section>
    </a-list>
  </div>
</template>
<script>
import { Pie, Line, DualAxes,Column  } from "@antv/g2plot";
import { 
company_manage_scale,  // 企业规模分类
company_manage_status,  // 企业状态分类
product_company_category,  // 企业产品分类
product_company_run,  // 企业产品分类产值产量
company_yingyee_sum,  // 企业按月营业额总计
manage_year_yingyee,  // 营业额折线图
manage_year_nashui,  // 纳税
manage_year_lirun,  // 利润
manage_year_yanfa,  // 研发
manage_year_chanzhi  // 产值
} from "@/services/datacenter"
export default {
  data() {
    return {
      loading: true,
      // 查询
      searchform: {},
      advanced: false,
      loadingsearch: false,
      loadingreset: false,
      piePlot1: {},
      piePlot2: {},
      linePlot: {},
      line: {},
      dualAxes: {},
      indxt: 1,
      companyScale:[],  // 企业规模的data
      // 渲染图表时的对象
      profitSituationLine:{},
      nashuiLine:{},
      lirunLine:{},
      yanfaList:{},
      chanzhiList:{}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.list();
    });
  },
  // 即将销毁的生命钩子
  beforeDestroy() {
    // 企业状态分类销毁
    this.piePlot1.destroy();
    // 企业按月营业额总计销毁
    this.profitSituationLine.destroy();
    this.nashuiLine.destroy();
    this.lirunLine.destroy();
    this.yanfaList.destroy();
    this.chanzhiList.destroy();
  },
  methods: {
    // 页面初始执行的函数
    list() {
      Promise.all([
        // 企业按月营业额总计
        manage_year_yingyee(),
        // 纳税
        manage_year_nashui(),
        // 利润
        manage_year_lirun(),
        // 研发
        manage_year_yanfa(),
        // 产值
        manage_year_chanzhi(),
        // 企业状态分类接口
        company_manage_status(),
      ])
      .then(res => {
        console.log("this.res",res)
        this.profitSituation(res[0].data.data);
        this.nashuimethod(res[1].data.data);
        this.lirunmethod(res[2].data.data);
        this.yanfamethod(res[3].data.data);
        this.chanzhimethod(res[4].data.data);
        this.enterpriseStatus(res[5].data.data);
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      })
    },
    // 企业状态分类
    enterpriseStatus(item) {
      console.log('企业状态分类',item)
      this.piePlot1 = new Pie("enterpriseStatus", {
        appendPadding: 10,
        data:item,
        angleField: "count",
        colorField: "_id",
        radius: 0.9,
        legend: {
          position: "top-right",
          itemName: {
            style: {
              fill: "#000",
            },
          },
        },
        // 悬浮提示
        tooltip: {
          formatter: (datum) => {
            /* 
            datum 其实相当于 data 对应的数据
            */
            return { name: datum._id, value: datum.count + '\t' + '个' };
          },
        },
        label: {
          type: "inner",
          offset: "-30%",
          content: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
          style: {
            fontSize: 14,
            textAlign: "center",
          },
        },
        color: [
          '#025DF4',
          '#DB6BCF',
          '#2498D1',
          '#BBBDE6',
          '#4045B2',
          '#21A97A',
          '#FF745A',
          '#007E99',
          '#FFA8A8',
          '#2391FF',
        ],
      });
      this.piePlot1.render();
    },
    // 营业收入
    profitSituation(item) {
      this.profitSituationLine = new Line("yingyeshouru", {
        data: item,
        xField: "_id",
        yField: "count",
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        tooltip: {
          // 这里的 datum 其实就是 data 中的每一条数据
          formatter: (datum) => {
            // 这里我们给 value 加了一个单位，而对 name 字段没有做修改
            return { name: '营业收入 ', value: datum.count + '\t' + '万元' };
          },
        },
        smooth: true,
        // color: '#FFA8A8',
      });
      this.profitSituationLine.render();
    },
    // 纳税
    nashuimethod(item) {
      this.nashuiLine = new Line("nashui", {
        data: item,
        xField: "_id",
        yField: "count",
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        tooltip: {
          // 这里的 datum 其实就是 data 中的每一条数据
          formatter: (datum) => {
            // 这里我们给 value 加了一个单位，而对 name 字段没有做修改
            return { name: '纳税额 ', value: datum.count + '\t' + '万元' };
          },
        },
        smooth: true,
        // color: '#BBBDE6',
      });
      this.nashuiLine.render();
    },
    // 利润
    lirunmethod(item) {
      this.lirunLine = new Line("lirun", {
        data: item,
        xField: "_id",
        yField: "count",
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        tooltip: {
          // 这里的 datum 其实就是 data 中的每一条数据
          formatter: (datum) => {
            // 这里我们给 value 加了一个单位，而对 name 字段没有做修改
            return { name: '利润额 ', value: datum.count + '\t' + '万元' };
          },
        },
        smooth: true,
        // color: '#4045B2',
      });
      this.lirunLine.render();
    },
    // 研发
    yanfamethod(item) {
      this.yanfaList = new Line("yanfa", {
        data: item,
        xField: "_id",
        yField: "count",
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        tooltip: {
          // 这里的 datum 其实就是 data 中的每一条数据
          formatter: (datum) => {
            // 这里我们给 value 加了一个单位，而对 name 字段没有做修改
            return { name: '研发费用 ', value: datum.count + '\t' + '万元' };
          },
        },
        smooth: true,
        // color: '#21A97A',
      });
      this.yanfaList.render();
    },
    // 产值
    chanzhimethod(item) {
      this.chanzhiList = new Line("chanzhi", {
        data: item,
        xField: "_id",
        yField: "count",
        statistic: {
          title: {
            offsetY: 0,
            style: {
              fontSize: 26,
            },
            formatter: (datum) => (datum ? datum.type : "总计"),
          },
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        tooltip: {
          // 这里的 datum 其实就是 data 中的每一条数据
          formatter: (datum) => {
            // 这里我们给 value 加了一个单位，而对 name 字段没有做修改
            return { name: '工业总产值 ', value: datum.count + '\t' + '万元' };
          },
        },
        smooth: true,
        // color: '#FFA8A8',
      });
      this.chanzhiList.render();
    },
  },
};
</script>
<style scoped>
li {
  list-style: none;
}
.box_root {
  background-color: #fff;
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
  height: 510px;
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 0 15px 40px;
  margin-bottom: 15px;
}
.mainbox .panel1 {
  position: relative;
  height: 510px;
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
  color: #000;
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
  height: 440px;
}
.mainbox .panel .chart1 {
  height: 440px !important;
}
</style>
