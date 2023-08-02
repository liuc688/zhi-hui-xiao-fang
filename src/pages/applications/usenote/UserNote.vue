<template>
  <a-layout class="use-note-layout-content">
    <a-page-header title="工作培训" sub-title=" -- 政务公开线上培训知识库" v-if="appdata.status">
      <template slot="extra">
        <a-button key="3" icon="redo" @click="resets"> 刷新 </a-button>
        <a-button key="1" type="primary" icon="plus" @click="onAdd" v-if="$auth('usenote.add')">
          添加
        </a-button>
      </template>
    </a-page-header>
    <a-layout style="height: calc(100% - 64px)" v-if="appdata.status">
      <a-layout-sider class="silders_s">
        <a-tree
          showLine
          defaultExpandAll
          :selectedKeys.sync="defaultCheckedKeys"
          :treeData="tree"
          :blockNode="true"
          @select="onSelect"
          :replaceFields="{
            title: 'title',
            key: 'id',
          }"
          @check="onCheck"
          @load="onTreeLoad"
        >
        </a-tree>
      </a-layout-sider>
      <a-layout-content>
        <page-toggle-transition
          :disabled="animate.disabled"
          :animate="animate.name"
          :direction="animate.direction"
        >
          <component
            :is="router"
            :data="params"
            :key="params.id"
            @event="event"
            @on-open="onOpen"
          >
          </component>
        </page-toggle-transition>
      </a-layout-content>
    </a-layout>
    <maintain v-else/>
  </a-layout>
</template>
<script>
// import MenuTree from '@/components/MenuTree'
import check from "./components/check.vue";
import edit from "./components/edit.vue";
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import { application_get } from "@/services/application";
import {
  usenote_add,
  usenote_edit,
  usenote_tree,
  usenote_delete,
} from "@/services/usenote";
import maintain from "@/pages/applications/maintain"
export default {
  components: {
    // MenuTree,
    check,
    edit,
    maintain,
    PageToggleTransition,
  },
  props: {
    appid: {
      type: String,
    },
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
  },
  data() {
    return {
      router: "check",
      tree: [],
      defaultCheckedKeys: [],
      params: {},
      back: {
        router: null,
        params: null,
      },
      appdata: {
        status: true
      },
    };
  },
  created() {
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
      if (this.appdata.status) {
        this.onLoad();
      }
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })
    
  },
  methods: {
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onLink({ router, params }) {
      this.router = router;
      this.params = params;
    },
    onReload() {
      const func = this.$refs.component.init;
      if (typeof func == "function") {
        func();
      }
    },
    onLoad() {
      usenote_tree()
        .then((response) => {
          this.tree = response.data.data;
          this.$nextTick(() => {
            if (this.tree.length) {
              this.defaultCheckedKeys = [this.tree[0].id];
              this.params = this.tree[0];
              console.log(this.defaultCheckedKeys);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onTreeLoad() {
      console.log("onTreeLoad");
    },
    onSelect(selectedKeys, e) {
      console.log("selectedKeys, e", selectedKeys, e);
      this.defaultCheckedKeys = selectedKeys;
      const data = e.node.dataRef;
      this.params = data;
      this.router = "check";
      console.log(data);
    },
    resets() {
      usenote_tree()
        .then((response) => {
          this.tree = response.data.data;
          this.$nextTick(() => {
            if (this.tree.length) {
              this.params = this.tree[0];
              this.defaultCheckedKeys = [this.tree[0].id];
              console.log(this.defaultCheckedKeys);
              this.router = "check";
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onAdd() {
      this.onLink({
        router: "edit",
        params: {},
      });
    },
    onCheck(e) {},
  },
};
</script>
<style lang="less">
.use-note-layout-content {
  background: #fff;

  .ant-tree li {
    margin-bottom: 10px;
  }

  .ant-page-header {
    background: #fff;
  }

  .ant-layout-sider {
    background: #fff;
  }

  .ant-menu {
  }
}
.headers_border {
  box-shadow: 2px 2px 10px 2px #eee;
  z-index: 1;
}
.silders_s {
  height: 100%;
  overflow: auto;
  max-width: 250px !important;
  min-width: 250px !important;
  width: 250px !important;
  padding: 10px 20px;
  background: #fafafa !important;
}
</style>

