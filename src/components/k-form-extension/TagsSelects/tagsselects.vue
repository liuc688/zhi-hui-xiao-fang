<template>
  <div>
    <a-select
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :showSearch="record.options.showSearch"
      :options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      :mode="record.options.multiple ? 'tags' : 'default'"
      @change="handleChange($event, record.model)"
      :value="value"
    />
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
