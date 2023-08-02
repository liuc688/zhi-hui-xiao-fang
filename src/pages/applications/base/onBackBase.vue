<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-page-header @back="onBack">
        <span slot="title">
          <a @click="onBack" style="color:#000000;">返回</a>
        </span>
      </a-page-header>
    </div>
  </a-card>
</template>
<script>
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    this.onload();
  },
  methods: {
    onload() {},
    onBack() {
      const last = this.crumbs.pop();
      this.$emit("event", {
        method: "onLink",
        params: {
          route: last.route,
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
    },
  },
};
</script>
