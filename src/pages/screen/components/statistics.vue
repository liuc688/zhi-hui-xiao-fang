<template>
  <div id="hom_main">
    <div class="top_title">
      <div :class="temp == 1 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(1)">物联数据统计</div>
      <a-divider type="vertical" />
      <div :class="temp == 2 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(2)">按月统计火灾隐患</div>
      <a-divider type="vertical" />
      <div :class="temp == 3 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(3)">固定消防设施报警分析</div>
      <a-divider type="vertical" />
      <div :class="temp == 4 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(4)">个人消防安全评估报告</div>
      <a-divider type="vertical" />
      <div :class="temp == 5 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(5)">单位消防安全评估成绩分析</div>
      <a-divider type="vertical" />
      <div :class="temp == 6 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(6)">电气火灾隐患分析</div>
      <a-divider type="vertical" />
      <div :class="temp == 7 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(7)">单位按月隐患统计</div>
      <a-divider type="vertical" />
      <div :class="temp == 8 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(8)">单位履责分析</div>
      <a-divider type="vertical" />
      <div :class="temp == 9 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(9)">消防用水管理概况</div>
      <a-divider type="vertical" />
      <div :class="temp == 10 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(10)">检测报告</div>
    </div>
    <div class="main-contents">
      <component ref="component" style="background: none" :is="routers" :key="key" @on-open="onOpen" :params="params" @event="event"></component>
    </div>
  </div>
</template>

<script>
import IoTdata from './pages/IoTdata';
import test from './pages/test';
import history from './pages/history';
import videos from './pages/videos';
import testreport from './pages/testreport';
import workAnalysis from './pages/workAnalysis';
import workSafeAnalysis from './pages/workSafeAnalysis';
import statisticsunit from './pages/statisticsunit';
import watermanagement from './pages/watermanagement';

export default {
  name: 'Internets',
  props: {
    open: {
      type: Function,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    key() {
      return Math.random();
    },
  },
  data() {
    return {
      temp: 1,
      routers: 'IoTdata',
      params: {},
    };
  },
  components: {
    IoTdata,
    test,
    history,
    videos,
    testreport,
    workAnalysis,
    workSafeAnalysis,
    statisticsunit,
    watermanagement,
  },
  created() {},
  methods: {
    select_temes(value) {
      this.temp = value;
      if (value == 1) {
        this.routers = 'IoTdata';
      } else if (value == 8) {
        this.routers = 'workAnalysis';
      } else if (value == 10) {
        this.routers = 'testreport';
      } else if (value == 5) {
        this.routers = 'workSafeAnalysis';
      } else if (value == 7) {
        this.routers = 'statisticsunit';
      } else if (value == 9) {
        this.routers = 'watermanagement';
      } else {
        this.routers = 'test';
      }
    },
    event({ method, params }) {
      console.log(method, params);
      if (this[method] && typeof this[method] === 'function') {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit('open', params || {});
    },

    onLinks({ route, params }) {
      //跳转
      this.router = route;
      this.params = params;
    },
  },
  mounted() {},
};
</script>

<style lang="less">
#hom_main {
  padding: 10px 40px;
  height: 100%;
  .top_title {
    width: 100%;
    padding: 5px 20px;
    display: flex;
    display: -webkit-box;
    overflow-x: auto;
    background-image: url('../img/wljc_top.png');
    background-size: 100% 100%;
    line-height: 22px;
    .title_items {
      margin: 0px 5px;
      padding: 2px 10px;
      background: #103347;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #eef9ff;
      line-height: 22px;
      letter-spacing: 0px;
      cursor: pointer;
    }
    .title_items:hover {
      filter: brightness(1.5);
    }
  }
  .main-contents {
    height: calc(100% - 36px);
    width: 100%;
  }
}
.title_items_select {
  filter: brightness(1.5);
}
</style>
