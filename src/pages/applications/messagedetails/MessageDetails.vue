<template>
  <a-card>
    <a-descriptions bordered :column="1">
      <a-descriptions-item label="标题">
        {{ currData.title }}
      </a-descriptions-item>
      <a-descriptions-item label="详情">
        {{ currData.details }}
      </a-descriptions-item>
      <a-descriptions-item label="操作">
        <a-tooltip v-if="currData.application">
          <template slot="title">
            跳转到 -- > {{ currData.application.title }}</template
          >
          <a
            style="margin-right: 8px; color: #1890ff"
            @click="onAction(currData)"
          >
            {{ currData.application.title }}
          </a>
        </a-tooltip>
        <template v-else> N/A </template>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import { messages_get } from "@/services/messages";
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      currData: {},
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      messages_get({
        id: this.data.data.id,
      })
        .then((response) => {
          this.currData = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onAction(record) {
      this.$emit("open", record.application || {});
    },
  },
};
</script>