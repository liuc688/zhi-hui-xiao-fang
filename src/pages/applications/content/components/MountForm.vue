<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        "
        @back="back"
      >
        <template slot="title">
          <a-button @click="back"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="唯一标识(id)">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item label="选择表单">
          <a-input-group compact>
            <a-tree-select
              show-search
              allow-clear
              style="width: 20%"
              v-model="formstype"
              @change="researchchannel"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="formstypeData"
              placeholder="查询表单类型"
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
            <a-select
              style="width: 80%"
              mode="multiple"
              placeholder="请选择挂载表单"
              v-model="form.forms"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="item in formslists"
                :key="item.id"
                :value="item.id"
                >{{ item.title }}</a-select-option
              >
            </a-select>
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <!-- <a-button type="primary" @click="onChannelSyncMaps"
            >一键同步映射目录扩展表单</a-button
          > -->
          <a-button>
            <a-checkbox v-model="onRecycle" >是否一键同步映射目录扩展表单</a-checkbox>
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <div style="text-align: right">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get, forms_list } from "@/services/forms";
import { channel_get, channel_forms, sync_maps } from "@/services/content";

import { dictmap_tree } from "@/services/dictmap";
export default {
  name: "mountforms",
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
  },
  watch: {
    params(val) {
      this.loading = true;
      this.init();
    },
  },
  data() {
    return {
      formslist: [],
      formslists: [],
      loading: true,
      sync_mapsId: "", //挂载表单所需id
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        id: undefined,
        forms: undefined,
      },
      formstype: undefined,
      formstypeData: [],
      onRecycle: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.sync_mapsId = this.params.id;
      Promise.all([forms_list(), dictmap_tree({ name: "FormsType" })])
        .then((res) => {
          this.formslist = res[0].data.data;
          this.formslists = res[0].data.data;
          this.formstypeData = res[1].data.data;
          this.contentget();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    researchchannel(id) {
      if (id) {
        forms_list({ parent: id })
          .then((res) => {
            this.formslists = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.formslists = this.formslist;
      }
    },
    contentget() {
      channel_get({ id: this.params.id })
        .then((res) => {
          this.$nextTick(() => {
            this.form = {
              id: res.data.data.id,
              forms: res.data.data.forms,
            };
            this.loading = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 同步
    onChannelSyncMaps() {
      this.loading = true;
      sync_maps({
        id: this.sync_mapsId,
      })
        .then(() => {
          this.loading = false;
          this.$message.success("操作成功！");
          this.back();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 保存
    submint() {
      this.$nextTick(() => {
        this.loading = true;
        channel_forms(this.form)
          .then((response) => {
            this.loading = false;
            if(this.onRecycle){
              this.onChannelSyncMaps()
            }else{
              this.$message.success(response.data.message);
              this.back();
            }
          })
          .catch((error) => {
            this.$message.error(error);
            this.loading = false;
          });
      });
    },
     filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    back() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.id],
      });
    },
  },
};
</script>