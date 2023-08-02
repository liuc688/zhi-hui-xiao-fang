<template>
  <div class="mini-chart">
    <div class="chart-content" :style="{ height: 46 }">
      <v-chart
        :force-fit="true"
        :height="height"
        :data="value"
        :padding="[36, 5, 18, 5]"
      >
        <v-tooltip />
        <v-bar position="record*count" />
      </v-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: "MiniBar",
  data() {
    return {
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
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
