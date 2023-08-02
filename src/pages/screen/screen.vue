<template>
  <div id="data-view">
    <!-- <dv-full-screen-container style="height: 100% !important"> -->
    <top-header style="height: 140px" @on-open="onOpen" :params="params" @event="event" />
    <div class="main-content">
      <component ref="component" style="background: none" :is="router" :key="key" @on-open="onOpen" :params="params" @event="event"></component>
    </div>
    <!-- </dv-full-screen-container> -->
  </div>
</template>

<script>
import Internets from './components/Internets';
import home from './components/home';
import setUp from './components/setUp';
import topHeader from './components/topHeader';

import analysis from './components/analysis';
import Patrol from './components/Patrol';
import statistics from './components/statistics';

// import dataV from '@jiaminghi/data-view';
// import Vue from 'vue';

// Vue.use(dataV);

export default {
  name: 'DataView',
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
  components: {
    topHeader,
    analysis,
    Patrol,
    statistics,
    Internets,
    home,
    setUp,
  },
  data() {
    return {
      router: 'home',
      params: {},
    };
  },
  methods: {
    event({ method, params }) {
      console.log(method, params);
      if (this[method] && typeof this[method] === 'function') {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit('open', params || {});
    },
    selects(data) {
      if (data == 1) {
        this.router = 'home';
      } else if (data == 2) {
        this.router = 'Internets';
      } else if (data == 6) {
        this.router = 'setUp';
      } else if (data == 4) {
        this.router = 'analysis';
      } else if (data == 3) {
        this.router = 'Patrol';
      } else if (data == 5) {
        this.router = 'statistics';
      }
    },
    onLink({ route, params }) {
      //跳转
      this.router = route;
      this.params = params;
    },
  },
};
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100vh;
  background-color: #030409;
  color: #fff;
  background-image: url('./img/bg_all.png');
  background-size: 100% 100%;

  #dv-full-screen-container {
    background-image: url('./img/bg1.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 140px);
    background-size: 100% 100%;
    overflow: hidden;
  }

  .block-left-right-content {
    flex: 1;
    display: flex;
    margin-top: 20px;
  }

  .block-top-bottom-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 20px;
  }

  .block-top-content {
    height: 55%;
    display: flex;
    flex-grow: 0;
    box-sizing: border-box;
    padding-bottom: 20px;
  }
}
</style>
