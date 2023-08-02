<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color: #000000">返回</a>
      </span>
      <template slot="extra">
        <a-button type="primary" icon="cloud-upload" @click="onSubmit">
          保存提交
        </a-button>
      </template>
    </a-page-header>
    <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { classroom_add, classroom_edit } from "@/services/classroom";
import { organization_tree } from "@/services/organization";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      jsonData: {},
      organization: []
    };
  },
  computed: {
    dynamicData() {
      return {
          organization:this.organization
      };
    },
    parameter() {
      return this.params;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({
          name: "add_class_room",
        }),
        organization_tree()
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
          this.organization = response[1].data.data;
          this.$nextTick(() => {
            this.$refs.form.reset();
            let formData = {};
            for (let field in this.$refs.form.form.formItems) {
              formData[field] = this.parameter[field];
            }
            this.$refs.form.setData(formData);
          });
        })
        .catch((error) => {});
    },
    onSubmit() {
      this.loading = true;
      this.$refs.form
        .getData()
        .then((formData) => {
          if (formData.id) {
            //编辑
            classroom_edit(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.onBack();
              })
              .catch((error) => {
                console.log("error", error);
                this.loading = false;
              });
          } else {
            //添加
            classroom_add(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.onBack();
              })
              .catch((error) => {
                console.log("error", error);
                this.loading = false;
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onBack() {
      this.$emit("event", {
        method: "onBack",
      });
    },
  },
};
</script>