<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color: #000000">返回</a>
      </span>
      <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 2 }">
        <a-descriptions-item label="标题">
          {{ currData.title }}
        </a-descriptions-item>
        <a-descriptions-item label="行业分类">
          <a-tag
            color="blue"
            v-for="item in currData.organization"
            :key="item._id"
          >
            {{ item.title }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="所属标签">
          <a-tag color="purple" v-for="item in currData.tags" :key="item._id">
            {{ item }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <a-card>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="官方回应"
          ><a-card-grid style="width: 100%">
            <a-card-meta>
              <div slot="description" v-html="currData.response"></div>
            </a-card-meta> </a-card-grid
        ></a-tab-pane>
        <a-tab-pane key="2" tab="网评引导"
          ><a-card-grid style="width: 100%">
            <a-card-meta>
              <div slot="description" v-html="currData.guide"></div>
            </a-card-meta> </a-card-grid
        ></a-tab-pane>
        <a-tab-pane key="3" tab="应急处置">
          <a-card-grid style="width: 100%">
            <a-card-meta>
              <div slot="description" v-html="currData.emergency"></div>
            </a-card-meta> </a-card-grid
        ></a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>
<script>
import { rtemplate_get } from "@/services/rtemplate";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      organization: [],
      currData: {},
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      rtemplate_get({
        id: this.params.id,
      }).then((response) => {
        this.currData = response.data.data;
      });
    },
    onBack() {
      this.$emit("event", {
        method: "onBack",
      });
    },
  },
};
</script>