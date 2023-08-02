<template>
  <div>
    <a-tag color="#00aaf0">{{ content }}</a-tag>
  </div>
</template>

<script>
export default {
  name: "tags",
  props: {
    value: {
      type: String,
    },
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
    onChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>
