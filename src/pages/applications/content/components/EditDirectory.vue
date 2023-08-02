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
        @back="backs"
      >
        <template slot="title">
          <a-button @click="backs"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <k-form-build
        :value="jsonData"
        ref="defaultForm"
        @change="handleChange"
        :dynamicData="dynamicData"
        :config="config"
      />
      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint" :loading="loadings"
          >保存</a-button
        >
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import {
  directory_list,
  directory_insert,
  directory_edit,
  directory_verifyname,
} from "@/services/content";
import Cookie from "js-cookie";

export default {
  title: "栏目增编",
  name: "editchannel",
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
    params() {
      this.contentget();
    },
  },
  data() {
    return {
      jsonData: {},
      forms: {},
      loading: true,
      loadings: false,
      methodes: directory_edit,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        directorys: [],
      };
      return result;
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({ name: "directory_add_edit" }),
        directory_list({ site: this.params.organization, tree: true }),
      ])
        .then((res) => {
          this.jsonData = res[0].data.data.form;
          this.dynamicData.directorys = res[1].data.data;
          this.loading = false;
          this.contentget();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 数据获取
    contentget() {
      if (this.params.id) {
        console.log("this.params", this.params);
        this.methodes = directory_edit;
        this.$nextTick(() => {
          this.$refs.defaultForm.reset();
          this.$refs.defaultForm.setData({
            id: this.params.id,
            title: this.params.title,
            name: this.params.name,
            parent: this.params.parent,
            logo: this.params.logo,
            link: this.params.link,
            icon: this.params.icon,
            sort: this.params.sort,
            mome: this.params._mome, //目录描述
          });
          this.loading = false;
          this.$refs.defaultForm.disable(["name"]);
        });
      } else {
        this.methodes = directory_insert;

        this.$nextTick(() => {
          this.$refs.defaultForm.enable(["name"]);
          this.$refs.defaultForm.reset();
          if (this.params.parent) {
            this.$refs.defaultForm.setData({
              parent: this.params.parent,
            });
          }
          this.loading = false;
        });
      }
    },
    // 名称校验
    handleChange(value, key) {
      // 数据变化时触发
      if (key == "name" && value) {
        var pattern_1 = /^[^\u4e00-\u9fa5]+$/;
        if (pattern_1.test(value)) {
          // 非汉字字符串
          directory_verifyname({
            name: value,
          })
            .then((res) => {
              if (!res.data.status==200) {
                this.$message.error(res.data.reason);
              } else {
                this.$message.success("当前栏目名称可用");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("当前栏目名称不可用")
            });
        } else {
          return false;
        }
      }
    },
    // 保存
    submint() {
      var that = this;
      this.loadings = true;
      this.$refs.defaultForm
        .getData()
        .then((formData) => {
          this.loading = true;
          formData.site = this.params.organization;
          that
            .methodes(formData)
            .then((response) => {
              this.loading = false;
              this.loadings = false;
              this.$message.success(response.data.message);
              this.back(
                this.params.id ? this.params.id : response.data.data.id,
                this.params.organization
              );
            })
            .catch((error) => {
              this.$message.error(error.response.data.message);
              this.loading = false;
              this.loadings = false;
            });
        })
        .catch((error) => {
          console.log(error);
          this.loadings = false;
        });
    },
    back(data, site) {
      this.$emit("event", {
        method: "refreshes",
        params: {
          data: data,
          site: site,
        },
      });
    },
    backs() {
      this.$emit("event", {
        method: "treeSelectdire",
        params: [this.params.id],
      });
    },
  },
};
</script>