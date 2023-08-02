<template>
  <div id="index">
    <a-tree-select
      style="width: 100%"
      show-search
      allowClear
      @change="treeSelectChange"
      v-model="organization"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :treeData="channeltree"
      placeholder="请选择搜索站点"
      :replaceFields="{
        key: 'id',
        value: 'id',
        title: ``,
      }"
      :filterTreeNode="
        (value, node) => {
          const data = node.componentOptions.propsData.dataRef;
          return (
            data.title.indexOf(value) !== -1 || data.name.indexOf(value) !== -1
          );
        }
      "
    >
      <span slot="title" slot-scope="record">
        {{ record.title }}
        <a-tag color="blue" v-if="record.maps && record.maps.length">映</a-tag>
      </span>
    </a-tree-select>
  </div>
</template>
<script>
import { channel_list } from "@/services/content";
export default {
  data() {
    return {
      channeltree: [],
      organization: undefined,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      channel_list({
        site: "624d45f2122953d39d9a7f35",
        tree: true,
      })
        .then((res) => {
          this.channeltree = res.data.data;
          // this.spinning = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    treeSelectChange(i){
      console.log(i)
    },
  },
};
</script>
<style lang="less" scoped>
#index {
  width: 50%;
  height: 50vh;
  margin: 50px auto;
}
</style>
