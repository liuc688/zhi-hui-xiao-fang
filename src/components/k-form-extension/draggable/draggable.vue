<template>
    <draggable element="div" v-model="content" :disabled="record.options.disabled" animation="1000" @start="onStart" @end="onEnd">
      <a-tag v-for="item in !record.options.dynamic
          ? content
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []" showArrow color="blue" :key="item.value">
        {{ item.label }}
      </a-tag>
    </draggable>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "treeselect",
  components: {
    draggable,
  },
  props: {
    value: {
      type: Array,
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
  computed:{
    content: {
      get() {
        console.log('this.value', this.value)
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
        console.log('value',value)
        if (value) {
          this.content  = value;
        }
      },
      deep: true,
    },
  },
  data() {
    return {};
  },
  mounted(){
    this.content= !this.record.options.dynamic ? this.record.options.options : this.dynamicData[this.record.options.dynamicKey]
  },
  methods: {
     handleChange(value) {
      // change事件
      this.$emit("change", value);
    },
    onStart(value){
      console.log(222222222, value)
    },
    onEnd(value){
      console.log(111111111,value)
    }
  },
};
</script>
