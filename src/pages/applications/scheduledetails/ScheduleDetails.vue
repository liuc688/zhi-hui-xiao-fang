<template>
  <a-card style="border: none">
    <a-descriptions bordered :column="1">
      <a-descriptions-item label="发布时间">
        {{ currData._createtime }}
      </a-descriptions-item>
      <a-descriptions-item label="开始时间">
        {{ currData.start }}
      </a-descriptions-item>

      <a-descriptions-item label="结束时间" v-if="currData.end">
        {{ currData.end }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
        {{ currData.title }}
      </a-descriptions-item>
      <a-descriptions-item label="详情">
        <div v-if="types == '删改型'" v-html="currData.description"></div>
        <div v-else>
          {{ currData.description }}
        </div>
      </a-descriptions-item>
      <a-descriptions-item v-if="types" label="完成进度">
        <a-progress
          style="padding: 0 10px; width: 80%"
          :percent="
            (currData._extension.finish / currData._extension.taskload).toFixed(
              2
            ) * 100
          "
        />
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
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认删除此任务吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="deletes(currData)"
          @cancel="cancel"
        >
          <a href="javascript:;" style="margin-left: 8px; color: #1890ff"
            >删除</a
          >
        </a-popconfirm>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import {
  schedule_get,
  schedule_riskget,
  schedule_riskdelete,
} from "@/services/schedule";
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      currData: {},
      types: undefined,
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      schedule_riskget({
        id: this.data.data,
      })
        .then((response) => {
          this.currData = response.data.data;
          this.types = this.currData._extension
            ? this.currData._extension.types
            : undefined;
        })
        .catch((error) => {
          console.log("error", error);
        });
      schedule_get({
        id: this.data.data,
      })
        .then((response) => {
          this.currData = response.data.data;
          this.types = this.currData._extension
            ? this.currData._extension.types
            : undefined;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onAction(record) {
      var datas = Object.assign(record.application, {
        data:
          record.application.name == "supervision"
            ? { riskid: record.record, types: this.types }
            : record.application.data,
      });
      this.$emit("open", datas || {});
    },
    deletes(record) {
      schedule_riskdelete({ id: record.id }).then(() => {
        this.$emit("refresh", {});
        this.$layer.closeAll();
      });
    },
    cancel() {},
  },
};
</script>