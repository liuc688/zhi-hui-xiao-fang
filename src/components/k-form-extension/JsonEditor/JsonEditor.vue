<template>
    <vue-json-editor
        v-model="content"
        :showBtns="false"
        :mode="config.mode"
        :disabled="config.disabled"
        lang="zh"
        @json-change="onChange"
        @json-save="onJsonSave"
    />
</template>

<script>
import vueJsonEditor from "vue-json-editor";
export default {
  name: "json-editor",
  components: {
    vueJsonEditor
  },
  props: {
    value: {
      type: Object
    },
    record: {
      type: Object,
      required: true
    },
    formConfig: {
      type: Object,
      required: false
    },
    dynamicData: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      }
    },
    config() {
      return (
        this.dynamicData.config || {
          mode: "tree"
        }
      );
    }
  },

  watch: {
    value: {
      handler(value) {
        if (value) {
          this.content = value;
        }
      },
      deep: true
    },
    record: {
      handler(value) {
        this.config.disabled = value.options.disabled;
      },
      deep: true
    }
  },
  data() {
    return {};
  },
  methods: {
    onChange(value) {
      this.$emit("change", value);
    },
    onJsonSave(value) {
      this.$emit("change", value);
    }
  }
};
</script>
