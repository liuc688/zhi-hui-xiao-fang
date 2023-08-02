<template>
  <a-card :loading="loading">
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color:#000000;">返回</a>
      </span>
      <template slot="extra">
        <a-button
          icon="save"
          type="primary"
          @click="onSubmit"
          :loading="loading"
        >
          保存提交
        </a-button>
      </template>
    </a-page-header>
    <a-tabs default-active-key="1" tab-position="left">
      <a-tab-pane key="1" tab="基础表单">
        <k-form-build
          :value="defaultJsonData"
          ref="defaultForm"
          :dynamicData="dynamicData"
          :config="config"
          @change="onFormChange"
        />
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="扩展表单"
        force-render
        v-if="jsonData.list.length"
      >
        <k-form-build
          :value="jsonData"
          ref="form"
          :dynamicData="dynamicData"
          :config="config"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { human_edit, human_get } from "@/services/human";
import { formDataError } from "@/utils/util";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      data: {},
      jsonData: {
        list: [],
        config: {
          layout: "vertical",
          labelCol: {
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          },
          labelWidth: 100,
          labelLayout: "flex",
          wrapperCol: {
            xs: 18,
            sm: 18,
            md: 18,
            lg: 18,
            xl: 18,
            xxl: 18,
          },
          hideRequiredMark: false,
          customStyle: "",
        },
      },
      defaultJsonData: {},
      currDynamicData: {},
      users: [],
      action: null,
      record: {
        parent: undefined,
        phone: {},
        family: [],
        educational: [],
        train: [],
        work: [],
        administration: {
          firsttest: undefined,
          finaltest: undefined,
        },
        design: {
          ppttest: undefined,
          pstest: undefined,
          typesetting: undefined,
        },
        finance: {
          test: undefined,
        },
        sntrances: [
          {
            jnumber: undefined,
            jstatus: undefined,
            department: undefined,
            post: undefined,
            position: undefined,
            accident: undefined,
            businesscard: undefined,
            lasttime: undefined,
          },
        ],
      },
    };
  },
  computed: {
    dynamicData() {
      const result = {};
      return Object.assign(this.currDynamicData, result);
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
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.jsonData = this.params.extend.jsonData;
      this.defaultJsonData = this.params.extend.defaultJsonData;
      this.currDynamicData = this.params.extend.dynamicData;
      this.users = this.params.extend.users;

      if (this.params.record.parent) {
        this.$nextTick(() => {
          this.$refs.defaultForm.form.setFieldsValue({
            parent: this.params.record.parent,
          });
          this.onFormChange(this.params.record.parent, "parent");
        });
      }
    },
    onFormChange(value, key) {
      if (key == "parent") {
        this.loading = true;
        human_get({ parent: value })
          .then((response) => {
            const { data } = response.data;
            this.record = {
              ...data,
              parent: value,
            };
            this.loading = false;
            this.$nextTick(() => {
              this.$refs.defaultForm.setData({
                ...this.record,
                photo: data.photo ? [data.photo] : undefined,
              });
              this.$refs.form.setData(this.record);
            });
          })
          .catch((error) => {
            console.log("error", error);
            this.loading = false;
          });
      }
    },
    onSubmit() {
      const PromiseList = [this.$refs.defaultForm.getData()];
      if (this.jsonData.list.length) {
        PromiseList.push(this.$refs.form.getData());
      }
      Promise.all(PromiseList)
        .then((formDatas) => {
          let fields = {};
          let formData = {};
          formDatas.forEach((item, index) => {
            if (index != 0) {
              fields = {
                ...fields,
                ...item,
              };
            } else {
              formData = {
                ...item,
                id: this.params.record.id,
              };
            }
          });
          this.loading = true;
          human_edit({
            ...formData,
            fields: fields,
          })
            .then((response) => {
              this.$message.success(response.data.message);
              this.loading = false;
              this.visible = false;
              this.onLoad();
              this.onBack();
            })
            .catch((error) => {
              console.log("error", error);
              this.loading = false;
              this.$message.error(error.response.data.message);
            });
        })
        .catch((error) => {
          formDataError(error, this.$message.error);
          this.loading = false;
        });
    },
    onBack() {
      const last = this.crumbs.pop();
      this.$emit("event", {
        method: "onLink",
        params: {
          route: last.route,
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
    },
  },
};
</script>
