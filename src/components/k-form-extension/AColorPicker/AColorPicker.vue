<template>
  <div style="padding-top: 8px">
    <colorPicker v-model="color" @change="onChange" :disabled="disabled" />
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: "#ff0000",
    },
    record: {
      type: Object,
      required: true,
    },
    // form-item 宽度配置
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
    color: {
      get() {
        return this.value || this.record.defaultValue;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
  methods: {
    onChange(value) {
      this.$emit("update:value", value);
    },
  },
};
</script>
<style>
.colorBtn {
  height: 25px !important;
  width: 25px !important;
}
</style>