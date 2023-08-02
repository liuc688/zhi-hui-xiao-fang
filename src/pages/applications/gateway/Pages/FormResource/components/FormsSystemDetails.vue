<template>
  <div class="body" ref="body">
    <a-form-model
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="form-form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-model-item label="表单标题" prop="title">
            <a-input
              v-model="ruleForm.title"
              placeholder="请输入表单标题!"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="表单名称" prop="name">
            <a-input
              v-model="ruleForm.name"
              placeholder="请输入表单名称!"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="6">
          <a-form-model-item label="表单类型">
            <a-select
              @change="changeselect" v-model="ruleForm.formtypes" placeholder="请选择表单类型!"
            >
              <a-select-option
                v-for="item in formTypeList"
                :key="item.id"
                :value="item.id"
              >{{item.title}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="4">
          <a-form-model-item
            label="是否主表"
            :label-col="{ span: 12 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-switch v-model="ruleForm.main" />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="表单分类">
            <a-tree-select
              show-search
              style="width: 100%"
              v-model="ruleForm.parent"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="channelData"
              placeholder="请选择表单分类"
              :replaceFields="{
                key: 'id',
                value: 'id',
              }"
              :filterTreeNode="
                (value, node) => {
                  const data = node.componentOptions.propsData.dataRef;
                  return (
                    data.title.indexOf(value) !== -1 ||
                    data.name.indexOf(value) !== -1
                  );
                }
              "
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="4">
          <a-form-model-item label="是否异步" :label-col="{span: 12}" :wrapper-col="{span: 12}">
            <a-switch  v-model="ruleForm.sync" />
          </a-form-model-item>
        </a-col>
		<a-col :span="4">
          <a-form-model-item label="是否创建" :label-col="{span: 12}" :wrapper-col="{span: 12}">
            <a-switch  v-model="ruleForm.create" />
          </a-form-model-item>
        </a-col> -->
      </a-row>
    </a-form-model>
    <k-form-design
      title="表单编辑"
      :toolbarsTop="false"
      :showToolbarsText="true"
      :value="jsonData"
      ref="kfd"
      :toolbars="[
        'preview',
        'save',
        'importJson',
        'exportJson',
        'exportCode',
        'reset',
      ]"
      :showHead="false"
      @save="handleSave"
    >
    </k-form-design>
  </div>
</template>

<script>
import { system_add, system_edit } from "@/services/forms";
import { dictmap_tree } from "@/services/dictmap";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
  },
  data() {
    return {
      dynamicData: {},
      jsonData: {},
      ruleForm: {
        name: undefined,
        title: undefined,
        main: false,
        parent: undefined,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入表单标题",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入表单名称",
          },
            {
            pattern: "^[a-zA-Z][a-zA-Z0-9_]*$",
            message: "请输入字母开头包括数字、下划线的字符串",
          },
        ],
      },
      formTypeList: [],
      color: "#1890ff", //主题色
      methodss: Function,
      channelData: [],
    };
  },
  mounted() {
    this.$refs.body.style.setProperty("--theme", this.color);
    if (this.params.id != undefined) {
      this.jsonData = this.params.form;
      this.ruleForm = this.params;
      this.$refs.kfd.handleSetData(this.jsonData);
      this.methodss = system_edit;
    } else {
      this.methodss = system_add;
    }
  },
  created() {
    dictmap_tree({ name: "FormsType" })
        .then((response) => {
          this.channelData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
  },
  methods: {
    //  表单类型选择
    changeselect() {},
    //   保存
    handleSave(values) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var data = {
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            title: this.ruleForm.title,
            main: this.ruleForm.main,
            parent: this.ruleForm.parent,
            form: JSON.parse(values),
          };

          this.methodss(data)
            .then(() => {
              this.$message.success("操作成功！");
              this.back();
            })
            .cacth((err) => {
              console.log(err);
            });
        }
      });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "forms-system-list",
          params: Object.assign(
            {},
            {
              pagination: this.params.pagination,
              searchForm: this.searchForm,
            }
          ),
        },
      });
    },
  },
};
</script>
<style scoped>
.form-form {
  width: 100%;
  clear: both;
}
</style>
<style>
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box:hover {
  background: #cae7ff;
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  .show-key-box {
  color: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  > .copy {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box
  > .delete {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box:before {
  background: var(--theme);
}
.form-designer-container-9136076486841527
  .content
  section
  .form-panel
  .draggable-box
  .list-main
  .drag-move-box.active {
  background: #cae7ff;
}
.form-designer-container-9136076486841527
  .content
  aside.right
  .form-item-properties
  .close-box {
  background: var(--theme);
}
.form-designer-container-9136076486841527 .content aside.left ul li:hover {
  color: var(--theme);
  border: 1px solid var(--theme);
  -webkit-box-shadow: 0 2px 6px var(--theme);
  box-shadow: 0 2px 6px var(--theme);
}
.form-designer-container-9136076486841527 .operating-area a:hover {
  color: var(--theme);
}
</style>
