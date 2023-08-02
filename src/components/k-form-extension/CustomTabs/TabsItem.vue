<!--
 * @Description: 动态表格 用于批量填入数据
 * @Author: kcz
 * @Date: 2020-03-27 18:36:56
 * @LastEditors: kcz
 * @LastEditTime: 2021-05-14 14:04:14
 -->
<template>
  <a-form-model
    ref="dynamicValidateForm"
    layout="inline"
    :model="dynamicValidateForm"
    :labelAlign="'left'"
  >
    <a-tabs
      class="grid-row"
      :default-active-key="0"
      v-model="activeKey"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane
        v-for="(tabItem, index) in dynamicValidateForm.domains"
        :key="index"
        :tab="`第${index + 1}页`"
      >
        <template v-for="item in record.list">
          <KFormModelItem
            :key="item.key + '1'"
            :record="item"
            :config="config"
            :parentDisabled="disabled"
            :index="index"
            :domains="dynamicValidateForm.domains"
            :dynamicData="dynamicData"
            v-model="dynamicValidateForm.domains[index][item.model]"
            @input="handleInput"
            :formConfig="formConfig"
          />
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-form-model>
</template>



<script>
import KFormModelItem from "./module/KFormModelItem";
export default {
  name: "KBatch",
  props: {
    record: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    dynamicData: {
      type: Object,
      required: true,
    },
    parentDisabled: {
      type: Boolean,
      default: false,
    },

    validatorError: {
      type: [Object, null],
      default: () => ({}),
    },
  },

  components: {
    KFormModelItem,
  },
  watch: {
    value: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        this.dynamicValidateForm.domains = val || [];
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      activeKey: 0,
      dynamicValidateForm: {
        domains: [{}],
      },
    };
  },

  computed: {
    listLength() {
      return this.record.list.filter((item) => !item.options.hidden).length;
    },
    columns() {
      const columns = [];
      if (!this.record.options.hideSequence) {
        columns.push({
          title: "序号",
          dataIndex: "sequence_index_number",
          width: "60px",
          align: "center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        });
      }

      columns.push(
        ...this.record.list
          .filter((item) => !item.options.hidden)
          .map((item, index) => {
            return {
              title: item.label,
              dataIndex: item.key,
              width: index === this.record.list.length - 1 ? "" : "190px",
              scopedSlots: { customRender: item.key },
            };
          })
      );

      columns.push({
        title: "操作",
        dataIndex: "dynamic-opr-button",
        fixed: "right",
        width: "80px",
        align: "center",
        scopedSlots: { customRender: "dynamic-opr-button" },
      });

      return columns;
    },
    disabled() {
      return this.record.options.disabled || this.parentDisabled;
    },
  },
  methods: {
    validationSubform() {
      let verification;
      this.$refs.dynamicValidateForm.validate((valid) => {
        verification = valid;
      });
      return verification;
    },
    resetForm() {
      this.$refs.dynamicValidateForm.resetFields();
    },

    onEdit(targetKey, action) {
      this[`${action}Domain`](targetKey);
    },

    removeDomain(item) {
      this.dynamicValidateForm.domains.splice(item, 1);
      this.activeKey = this.dynamicValidateForm.domains.length - 1;
    },

    addDomain() {
      const data = {};
      this.record.list.forEach((item) => {
        data[item.model] = item.options.defaultValue;
      });

      this.dynamicValidateForm.domains.push({
        ...data,
        key: Date.now(),
      });
      this.handleInput();
      this.activeKey = this.dynamicValidateForm.domains.length - 1;
    },
    handleInput() {
      this.$emit("change", this.dynamicValidateForm.domains);
    },
  },
};
</script>
<style scoped>
.dynamic-opr-button:last {
  margin-left: 0px;
}
.dynamic-opr-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 16px;
  color: #999;
  transition: all 0.3s;
  margin-left: 6px;
}
.dynamic-opr-button:hover {
  color: #e89;
}
.dynamic-opr-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
