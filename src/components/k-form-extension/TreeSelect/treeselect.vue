<template>
  <div>
    <a-tree-select
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :dropdown-style="{ maxHeight: '320px', overflow: 'auto' }"
      :treeCheckable="record.options.treeCheckable"
      searchPlaceholder="请输入查询内容"
      :treeData="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      :value="value"
      @change="handleChange"
      :replaceFields="record.options.dynamic ? { key: 'id', value: 'id' } : {}"
      :filterTreeNode="(value, node) => {
          const data = node.componentOptions.propsData.dataRef;
          return  record.options.dynamic ? (
            data.title.indexOf(value) !== -1 || data.name.indexOf(value) !== -1
          ) : {}
        }
      "
    >
      <span slot="title" slot-scope="{ value }" style="color: #08c"
        >Child Node1 {{ value }}</span
      >
    </a-tree-select>
  </div>
</template>
<script>
export default {
  name: "treeselect",
  props: {
    value: {},
    record: {
      type: Object,
      required: true,
    },
    formConfig: {
      type: Object,
      required: false,
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
    config() {
      return this.dynamicData.config || {};
    },
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          this.content = value;
        }
      },
      deep: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleChange(value) {
      // change事件
      this.$emit("change", value);
    },
  },
};
</script>
