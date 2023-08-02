<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color:#000000;">返回</a>
      </span>
    </a-page-header>
    <a-tabs default-active-key="default">
      <a-tab-pane key="default" tab="基本信息">
        <a-descriptions bordered>
          <a-descriptions-item label="项目名称">
            {{ data.title }}
          </a-descriptions-item>
          <a-descriptions-item label="所属组织">
            {{ data.parent ? data.parent.title : "N/A" }}
          </a-descriptions-item>
          <a-descriptions-item label="标签">
            <template v-if="data.tags && data.tags.length">
              <a-tag color="blue" v-for="item in data.tags" :key="item">
                {{ item }}
              </a-tag>
            </template>
            <template v-else>N/A</template>
          </a-descriptions-item>
          <a-descriptions-item label="项目编号"
            :span="3"
          >
            {{ `${data.number.prefix}-${data.number.year}-${data.number.index}` }}
          </a-descriptions-item>
          <a-descriptions-item
            label="时间轴"
            :span="3"
            v-if="data.timeline && data.timeline.length"
          >
            <a-timeline-item v-for="item in data.timeline" :key="item.key">
              <a-icon
                slot="dot"
                type="clock-circle-o"
                style="font-size: 16px;"
              />
              <p>{{ item.time }}</p>
              <p>执行人 : {{ item.person }}</p>
              <p>描述 : {{ item.details }}</p>
            </a-timeline-item>
          </a-descriptions-item>
          <a-descriptions-item label="项目描述" :span="3">
            <div v-html="data.content"></div>
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane
        key="extend"
        tab="扩展信息"
        force-render
      >
        <k-form-build
          :value="jsonData"
          ref="form"
          :dynamicData="dynamicData"
          disabled
          class="k-form-style"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { formSetData } from "@/utils/util";
import { project_get } from "@/services/project";
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
    return {
      data: {},
      jsonData: {},
      currDynamicData: {},
    };
  },
  computed: {
    dynamicData() {
      const result = {};
      return Object.assign(this.currDynamicData, result);
    },
  },
  created() {
    this.onload();
  },
  methods: {
    onload() {
      Promise.all([
        project_get({
          id: this.params.record.id,
        }),
      ])
        .then((response) => {
          this.data = response[0].data.data;
          this.jsonData = this.params.extend.jsonData;
          this.currDynamicData = this.params.extend.dynamicData;
          this.$nextTick(() => {
            formSetData(this.$refs.form, this.data);
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
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
<style>
.k-form-style .ant-input[disabled] {
  background-color: #ffffff;
  color: #000000;
  border: 0px;
  border-bottom: 1px solid;
  border-radius: 0px;
}
.k-form-style .ant-select-selection {
  background-color: #ffffff;
  color: #000000;
  border: 0px;
  border-bottom: 1px solid;
  border-radius: 0px;
}
</style>
