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
        <a-col :span="5">
          <a-form-model-item label="表单类型">
            <!-- <a-select
              @change="changeselect"
              v-model="ruleForm.formtypes"
              placeholder="请选择表单类型!"
            >
              <a-select-option
                v-for="item in formTypeList"
                :key="item.id"
                :value="item.id"
                >{{ item.title }}</a-select-option
              >
            </a-select> -->
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
        <a-col :span="4">
          <a-form-model-item
            :label-col="{ span: 12 }"
            :wrapper-col="{ span: 12 }"
          >
            <span slot="label">
              是否主表
              <a
                slot="help"
                @click="
                  () => {
                    fieldsVisible = !fieldsVisible;
                  }
                "
                ><a-icon type="exclamation-circle"
              /></a>
            </span>
            <a-switch v-model="ruleForm.main" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-alert
      message="注意"
      description="数据字段使用英文字母开头，不要使用特殊符号!，可用下划线书写驼峰格式 ,例如: lcsjyj_title,lcsjyj_biaoti "
      type="info"
      show-icon
    />
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
    <a-modal
      title="主表字段说明"
      :visible="fieldsVisible"
      :confirm-loading="loading"
      @ok="
        () => {
          fieldsVisible = !fieldsVisible;
        }
      "
      @cancel="
        () => {
          fieldsVisible = !fieldsVisible;
        }
      "
    >
      <a-alert
        message="注意"
        description="当[是否主表]开关打开时,控件的数据字段填写要符合下标右列才可生效 !"
        type="info"
        show-icon
      />
      <a-descriptions bordered size="small">
        <a-descriptions-item :span="3">
          <span slot="label">
            标题[字符串类型]
          </span>
          <span>
            title
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            副标题[字符串类型]
          </span>
          <span>
            subtitle
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            三级标题[字符串类型]
          </span>
          <span>
            lowtitle
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            发布时间[日期时间字符串类型,1971-01-01 00:00:00]
          </span>
          <span>
            release
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            文章摘要[字符串类型,纯文本]
          </span>
          <span>
            summary
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            关键字[字符串数组类型]
          </span>
          <span>
            keyword
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            文章正文[字符串类型,带HTML标签的富文本]
          </span>
          <span>
            content
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            文章外链[字符串类型,外链URL地址]
          </span>
          <span>
            link
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            文章LOGO[仅支持"上传图片"控件]
          </span>
          <span>
            logo
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            主题分类[字符串数组类型]
          </span>
          <span>
            subject
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            作者[字符串类型]
          </span>
          <span>
            author
          </span>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <span slot="label">
            发布机构[字符串类型]
          </span>
          <span>
            organization
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { forms_add, forms_edit } from "@/services/forms";
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
      loading: false,
      dynamicData: {},
      jsonData: {},
      ruleForm: {
        name: undefined,
        title: undefined,
        parent:undefined,
        main: false,
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
      fieldsVisible: false,
      channelData:[]
    };
  },
  mounted() {
    this.$refs.body.style.setProperty("--theme", this.color);
    if (this.params.id != undefined) {
      this.jsonData = this.params.form;
      this.ruleForm = this.params;
      this.$refs.kfd.handleSetData(this.jsonData);
      this.methodss = forms_edit;
    } else {
      this.methodss = forms_add;
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
          route: "forms-list",
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
.body {
  background: #ffffff !important;
  padding: 10px;
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
.conter ant-layout-content {
  background: none !important;
}
</style>
