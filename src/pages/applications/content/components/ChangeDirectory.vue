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
          <span style="padding:10px">当前名称：{{ params.name }}</span>
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
        <a-button type="primary" @click="submint" v-auth="`directory.editname`"
          >保存</a-button
        >
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { directory_editname, directory_verifyname } from "@/services/content";
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
    params(val) {
      this.init();
    },
  },
  data() {
    return {
      jsonData: {},
      forms: {},
      loading: true,
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
  authorize: {
    submint: "directory.editname",
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      form_get({ name: "directory_edits_detailes" })
        .then((res) => {
          this.jsonData = res.data.data.form;
          this.$nextTick(() => {
            this.$refs.defaultForm.reset();
            this.$refs.defaultForm.setData({
              id: this.params.id,
              name: this.params.name,
            });
            this.loading = false;
            //   this.$refs.defaultForm.disable(['name']);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 名称校验
    handleChange(value, key) {
      // 数据变化时触发
      if (key == "name" && value) {
        directory_verifyname({
          name: value,
        })
          .then((res) => {
            console.log(res);
            if (!res.data.status && this.params.name !== value) {
              this.$message.error(res.data.reason);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 保存
    submint() {
      this.loading = true;
      this.$refs.defaultForm
        .getData()
        .then((formData) => {
          directory_editname(formData)
            .then((response) => {
              this.loading = false;
              this.$message.success(response.data.message);
              this.back(
                this.params.id ? this.params.id : response.data.data.id,
                this.params.organization
              );
            })
            .catch((error) => {
              this.$message.error(error);
              this.loading = false;
            });
        })
        .catch((error) => {
          console.log(error);
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