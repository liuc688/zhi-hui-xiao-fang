<template>
  <div>
    <a-row :gutter="24">
      <div v-for="(item, index) in laslist" :key="index" class="add_linkman">
        <a-col :span="11">
          <a-input
            v-model="item.labels"
            placeholder="键值"
            @change="onChange(laslist)"
          />
        </a-col>
        <a-col :span="13">
          <a-input
            v-model="item.value"
            placeholder="key值"
            @change="onChange(laslist)"
          >
            <a-icon slot="addonAfter" type="delete" @click="removeKeys(item)" />
          </a-input>
        </a-col>
      </div>
    </a-row>
    <a-button type="dashed" @click="addKeys"><a-icon type="plus" /></a-button>
    <span style="color: red">(*键值重复会自动覆盖)</span>
  </div>
</template>
<script>
export default {
  name: "KeyValuePair",
  props: {
    value: {
      type: Object,
      default: () => ({}),
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
  data() {
    return {
      laslist: [],
      models: {},
    };
  },
  created() {},
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          this.models = new Array();
          for (let key in value) {
            this.models.push({
              labels: key,
              value: value[key],
            });
          }
          this.laslist = this.models;
        }
      },
      deep: true,
    },
    // laslist: {
    //   handler(value) {
    //     this.onChange(value);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    onChange(value) {
      var objesc = {};
      for (let items in value) {
        if(value[items].labels){
          objesc[value[items].labels] = value[items].value;
        }
      }
      this.models = objesc;
      this.$emit("change", JSON.stringify(this.models)=='{}' ? undefined : this.models );
    },
    backchange(value) {
      var arrays = new Array();
      for (let key in value) {
        arrays.push({
          labels: value[key],
          value: key,
        });
      }
      return arrays;
    },

    // 添加键值对
    addKeys() {
      let methed = Math.round(Math.random() * 10000000);
      let metheds = Math.round(Math.random() * 10000000);
      var titles='keys_'+methed+metheds
      this.laslist.push({
        labels: titles,
        value: "",
      });
      this.onChange(this.laslist);
    },
    // 删除键值对
    removeKeys(item) {
      let index = this.laslist.indexOf(item);
      if (index !== -1) {
        this.laslist.splice(index, 1);
      }
      this.onChange(this.laslist);
    },
  },
};
</script>
