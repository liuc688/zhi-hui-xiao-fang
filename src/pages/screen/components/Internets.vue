<template>
  <div id="hom_main">
    <div class="top_title">
      <div :class="temp == 1 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(1)">电气火灾监测</div>
      <a-divider type="vertical" />
      <div :class="temp == 2 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(2)">消防物联网值守平台</div>
      <a-divider type="vertical" />
      <div :class="temp == 3 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(3)">建筑消防水</div>
      <a-divider type="vertical" />
      <div :class="temp == 4 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(4)">智慧独立烟感</div>
      <a-divider type="vertical" />
      <div :class="temp == 5 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(5)">消防物联网可视化监测</div>
      <a-divider type="vertical" />
      <div :class="temp == 6 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(6)">可燃气体监测</div>
      <a-divider type="vertical" />
      <div :class="temp == 7 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(7)">消防物联网自动化报警</div>
      <a-divider type="vertical" />
      <div :class="temp == 8 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(8)">灭火监测系统</div>
      <a-divider type="vertical" />
      <div :class="temp == 9 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(9)">视频智能分析</div>
      <a-divider type="vertical" />
      <div :class="temp == 10 ? 'title_items title_items_select' : 'title_items'" @click="select_tems(10)">历史报警信息</div>
    </div>
    <div class="main-contents">
      <component ref="component" :is="routers" :key="key" @on-open="onOpen" :params="params" @event="event"></component>
    </div>
  </div>
</template>

<script>
import cards from './pages/cards';
import ondutyplatform from './pages/ondutyplatform';
import test from './pages/test';
import history from './pages/history';
import videos from './pages/videos';
import buildingwater from './pages/buildingwater';
import gasmonitoring from './pages/gasmonitoring';
import extinguishingsys from './pages/extinguishingsys';
import monitoringIoT from './pages/monitoringIoT';
import alarmiot from './pages/alarmiot';
import smartsmoke from './pages/smartsmoke';

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
      routers: 'cards',
      params: {},
    };
  },
  components: {
    cards,
    ondutyplatform,
    test,
    history,
    videos,
    gasmonitoring,
    buildingwater,
    extinguishingsys,
    monitoringIoT,
    alarmiot,
    smartsmoke,
  },
  created() {},
  methods: {
    select_tems(value) {
      this.temp = value;
      if (value == 1) {
        this.routers = 'cards';
      } else if (value == 2) {
        this.routers = 'ondutyplatform';
      } else if (value == 9) {
        this.routers = 'videos';
      } else if (value == 10) {
        this.routers = 'history';
      } else if (value == 6) {
        this.routers = 'gasmonitoring';
      } else if (value == 3) {
        this.routers = 'buildingwater';
      } else if (value == 8) {
        this.routers = 'extinguishingsys';
      } else if (value == 5) {
        this.routers = 'monitoringIoT';
      } else if (value == 7) {
        this.routers = 'alarmiot';
      } else if (value == 4) {
        this.routers = 'smartsmoke';
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
      letter-spacing: 1px;
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
