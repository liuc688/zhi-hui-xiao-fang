<template>
  <a-card>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <component
        ref="component"
        :is="route"
        :params="params"
        @event="event"
        :key="key"
      ></component>
    </page-toggle-transition>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import SamplePagenate from "./components/SamplePagenate.vue";
import SampleEditor from "./components/SampleEditor.vue";
import SampleDetail from "./components/SampleDetail.vue";
import RTemplatePagenate from "./components/RTemplatePagenate.vue";
import RTemplateEditor from "./components/RTemplateEditor.vue";
import RTemplateDetail from "./components/RTemplateDetail.vue";

export default {
  props: {
    open: {
      type: Function,
    },
  },
  components: {
    PageToggleTransition,
    SamplePagenate,
    SampleEditor,
    SampleDetail,
    RTemplatePagenate,
    RTemplateEditor,
    RTemplateDetail
  },
  data() {
    return {
      loading: false,
      route: null,
      params: {},
      back: {
        route: null,
        params: null,
      },
      currData: {},
    };
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random();
    },
  },
  authorize: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.onLink({
        route: "sample-pagenate",
        params: this.params,
      });
    },
    onBack() {
      if (this.back.route) {
        this.route = this.back.route;
        this.params = this.back.params;
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onRefresh() {
      if (
        this.$refs.component &&
        typeof this.$refs.component.onReset === "function"
      ) {
        this.$refs.component.onReset();
      }
    },
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.params = params;
      this.route = route;

    },

    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
