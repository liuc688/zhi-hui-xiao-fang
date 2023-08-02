<template>
  <div id="hom_main">
    <div class="top_title">
      <div :class="temp == 1 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(1)">消防档案</div>
      <a-divider type="vertical" />
      <div :class="temp == 2 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(2)">消防隐患</div>
      <a-divider type="vertical" />
      <div :class="temp == 3 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(3)">巡查痕迹</div>
      <a-divider type="vertical" />
      <div :class="temp == 4 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(4)">检查工作落实</div>
      <a-divider type="vertical" />
      <div :class="temp == 5 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(5)">通知公告</div>
      <a-divider type="vertical" />
      <div :class="temp == 6 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(6)">消防物联管理</div>
      <a-divider type="vertical" />
      <div :class="temp == 7 ? 'title_items title_items_select' : 'title_items'" @click="select_temes(7)">消防大培训</div>
    </div>
    <div class="main-contents">
      <component ref="component" :is="routers" :key="key" @on-open="onOpen" :params="params" @event="event"></component>
    </div>
  </div>
</template>

<script>
import files from './pages/files';
import test from './pages/test';
import manage from './pages/manage';
import firehazards from './pages/firehazards';
import inspectionmarks from './pages/inspectionmarks';
import training from './pages/training';
import announcement from './pages/announcement';

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
      routers: 'files',
      params: {},
    };
  },
  components: {
    files,
    test,
    manage,
    firehazards,
    inspectionmarks,
    training,
    announcement,
  },
  created() {},
  methods: {
    select_temes(value) {
      this.temp = value;
      if (value == 1) {
        this.routers = 'files';
      } else if (value == 6) {
        this.routers = 'manage';
      } else if (value == 2) {
        this.routers = 'firehazards';
      } else if (value == 3) {
        this.routers = 'inspectionmarks';
      } else if (value == 7) {
        this.routers = 'training';
      } else if (value == 5) {
        this.routers = 'announcement';
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
