<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh', overflow: 'auto' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="border-bottom: 1px solid #ccc;margin-bottom: 10px;padding-bottom: 10px;"
        @back="backs"
      >
        <template slot="title">
          <a-button @click="backs"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <!-- <k-form-build
        :value="jsonDatas"
        ref="defaultForm"
        :dynamicData="dynamicData"
      /> -->
      <a-form-model :layout="layout" :model="form" ref="form" :rules="rules">
        <a-form-model-item label="目标目录" prop="channel">
          <a-col :span="8">
            <a-tree-select
              :tree-data="organizations"
              allowClear
              showSearch
              v-model="sites"
              placeholder="请选择组织"
              :replaceFields="{
                value: 'id',
                key: 'id',
              }"
              @select="onUserOrganizationSelect"
            >
            </a-tree-select>
          </a-col>
          <a-col :span="16">
            <a-tree-select
              :tree-data="channels"
              v-model="form.channel"
              allowClear
              showSearch
              placeholder="请选择目录"
              :replaceFields="{
                key: 'id',
                value: 'id',
                title: 'title',
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
          </a-col>
        </a-form-model-item>
      </a-form-model>

      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { channel_list, document_move } from "@/services/content";
import { organization_tree } from "@/services/organization";
import object from "lodash/object";

export default {
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
  data() {
    return {
      layout: "horizontal",
      loading: true,
      jsonDatas: {},
      dynamicData: {
        treeData: [],
      },
      form: {},
      organizations: [],
      channels: [],
      sites: undefined,
      rules: {
        channel: [
          {
            required: true,
            message: "请选择迁移目录",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      organization_tree()
        .then((res) => {
          this.organizations = res.data.data;
          this.loading = false;
          this.onUserOrganizationSelect(this.params.site);
          this.sites = this.params.site;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submint() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          document_move(
            Object.assign(this.form, { id: this.params.selectedRowKeys })
          )
            .then((response) => {
              this.loading = false;
              this.$message.success(response.data.message);
              if (this.params.channel) {
                this.backs();
              } else {
                this.back();
              }
            })
            .catch((error) => {
              this.$message.error(error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      // this.$refs.defaultForm
      //   .getData()
      //   .then((res) => {
      //     document_move(Object.assign(res, { id: this.params.selectedRowKeys }))
      //       .then((response) => {
      //         this.loading = false;
      //         this.$message.success(response.data.message);
      //         if (this.params.channel) {
      //           this.backs();
      //         } else {
      //           this.back();
      //         }
      //       })
      //       .catch((error) => {
      //         this.$message.error(error);
      //         this.loading = false;
      //       });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    onUserOrganizationSelect(e) {
      this.loading = true;
      channel_list({
        site: e,
        tree: true,
        key: Math.random().toString(36).slice(2),
      })
        .then((res) => {
          this.channels = res.data.data;
          this.form = object.assign({}, this.form, {
            channel: undefined,
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    back() {
      this.$emit("event", {
        method: "OrganizationGet",
        params: this.params.site,
      });
    },
    backs() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.channel],
      });
    },
  },
};
</script>
