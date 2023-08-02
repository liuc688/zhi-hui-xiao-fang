<template lang="">
  <a-card :title="data.title">
    <a slot="extra" @click="onEdit" v-if="data.id && $auth('usenote.edit')" ><a-icon type="edit"/>编辑</a>
    <a-empty v-if="!data.note">
    <div slot="description">
      <div>无描述信息</div>
    </div>
  </a-empty>
  <div v-else>
    <mark-down-editor
      v-model="data.note"
      :readonly="true"
    >
  </mark-down-editor>
  </div>
</a-card>
</template>
<script>
import MarkDownEditor from "@/components/MarkDownEditor";
export default {
  components: {
    MarkDownEditor
  },
  props: {
    data: {
      type: Object,
      defualt: () => {
        return {}
      }
    },
    event: {
      type: Function,
    },
  },
  created(){
    console.log(1111111111111111, this.data)
  },
  methods: {
    onEdit() {
      console.log("edir");
      this.$emit("event", {
        "method": "onLink",
        "params": {
          router: "edit",
          params: this.data
        }
      })
    }
  },
}
</script>
<style lang="">
  
</style>