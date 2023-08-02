<template>
  <div class="bar">
    <h4>{{ title }}</h4>
    <div class="chart">
      <v-chart
        :force-fit="true"
        height="312"
        :data="value"
        :padding="[24, 0, 0, 0]"
      >
        <v-tooltip />
        <v-axis />
        <v-bar position="record*count" />
      </v-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bar",
  props: {
    title: {
      Type: String,
    },
    value: {
      Type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
.bar {
  position: relative;
  .chart {
  }
}
</style>
