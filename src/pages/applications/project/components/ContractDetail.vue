<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color:#000000;">返回</a>
      </span>
    </a-page-header>
    <a-tabs default-active-key="default">
      <a-tab-pane key="default" tab="基本信息">
        <a-card :bordered="false">
          <a-descriptions bordered>
            <a-descriptions-item label="合同名称">
              {{ data.title }}
            </a-descriptions-item>
            <a-descriptions-item label="合同签约方">
              {{ data.customer.title }}
            </a-descriptions-item>
            <a-descriptions-item label="合同金额">
              <a-statistic
                :precision="0"
                prefix="￥"
                :value="data.money"
                :valueStyle="{
                  fontSize: '16px',
                }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="合同类型">
              {{ data.ispay ? "付款合同" : "收款合同" }}
            </a-descriptions-item>
            <a-descriptions-item label="合同签订时间">
              {{ data.start }}
            </a-descriptions-item>
            <a-descriptions-item label="合同结束时间">
              {{ data.end }}
            </a-descriptions-item>
            <a-descriptions-item label="合同详情" :span="3">
              <div v-html="data.details"></div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="extend" tab="扩展信息" force-render>
        <a-card :bordered="false">
          <k-form-build
            :value="jsonData"
            ref="form"
            :dynamicData="dynamicData"
            disabled
            class="k-form-style"
          />
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="files" tab="合同附件" force-render>
        <a-card :bordered="false">
          <a-timeline>
            <template v-for="file in data.files">
              <a-timeline-item :key="file.uid">
                <a :href="file.url" :download="file.name">{{ file.name }}</a>
              </a-timeline-item>
            </template>
          </a-timeline>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { formSetData } from "@/utils/util";
import { contract_get } from "@/services/contract";
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
      data: {
        files: [],
      },
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
        contract_get({
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
