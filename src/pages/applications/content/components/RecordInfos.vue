<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh', overflow: 'auto' }"
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
      <k-form-build
        :value="jsonData"
        ref="defaultForm"
        :dynamicData="dynamicData"
        :config="config"
      />
      <div style="text-align: right">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { organization_edit } from "@/services/organization";
import Cookie from "js-cookie";

export default {
  name: "recordinfo",
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
      loading: true,
      jsonData: {},
      dynamicData: {},
    };
  },
  watch: {
    params(val) {
      this.loading = true;
      this.init();
    },
  },
  computed: {
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
      this.form = this.params;
      form_get({ name: "record_infos" })
        .then((res) => {
          this.jsonData = res.data.data.form;
          this.$nextTick(() => {
            this.$refs.defaultForm.setData(this.params.info);
            this.loading = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });

    },
    submint() {
      this.$refs.defaultForm.getData().then((res) => {
        var datas = res;
        delete this.params["_modifytime"];
        delete this.params["_createtime"];
        organization_edit(Object.assign({}, this.params, { info: datas }))
          .then((response) => {
            this.loading = false;
            this.$message.success(response.data.message);
            this.back();
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
          });
      });
    },
    back() {
      this.$emit("event", {
        method:  this.params.key=='2' ? "refreshes" : "refresh",
        params: {
          data: this.params.channel,
          site:this.params.id
        }
      });
    },
  },
};
</script>