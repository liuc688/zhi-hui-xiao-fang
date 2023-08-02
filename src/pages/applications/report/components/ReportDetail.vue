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
        <a-descriptions-item label="摘要">
          {{ currData.summary }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <a-card>
      <a-card-grid style="width: 100%">
        <a-card-meta title="内容详情">
          <div slot="description" v-html="currData.content"></div>
        </a-card-meta>
      </a-card-grid>
    </a-card>
  </a-card>
</template>
<script>
import { report_get } from "@/services/report";
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
      report_get({
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