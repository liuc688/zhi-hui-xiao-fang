<template>
  <div class="mini-chart">
    <div class="chart-content" :style="{ height: 46 }">
      <v-chart
        :force-fit="true"
        :height="height"
        :data="data"
        :padding="[36, 5, 18, 5]"
      >
        <v-tooltip />
        <v-smooth-area position="record*count" />
      </v-chart>
    </div>
  </div>
</template>
<script>
export default {
  name: "MiniArea",
  data() {
    return {
      data: [],
      height: 100,
    };
  },
  props: {
    value: {
      Type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {
    setTimeout(() => {
      this.$nextTick(() => {

        this.data = this.value;
      });
    }, 500);
  },
};
</script>

<style scoped>
.mini-chart {
  position: relative;
  width: 100%;
}
.mini-chart .chart-content {
  position: absolute;
  bottom: -28px;
  width: 100%;
}
</style>
