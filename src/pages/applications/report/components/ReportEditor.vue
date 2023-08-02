<template>
  <div>
    <a-page-header
      :title="params.id ? '编辑' : '录入'"
      sub-title=""
      @back="obBack"
    >
      <template slot="extra">
        <a-button
          type="primary"
          icon="cloud-upload"
          @click="onSubmit"
          :loading="loading"
          >保存提交</a-button
        >
      </template>
    </a-page-header>
    <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
  </div>
</template>
<script>
import { form_get } from "@/services/forms";
import { organization_tree } from "@/services/organization";
import { report_add, report_edit } from "@/services/report";
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
      loading: false,
      jsonData: {},
      dictmaps: [],
      organization: [],
      currData: {},
    };
  },
  computed: {
    dynamicData() {
      let result = {
        organization: this.organization,
      };
      return result;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;

      Promise.all([
        form_get({
          name: "report_editor",
        }),
        organization_tree(),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
          this.organization = response[1].data.data;
          if (this.params.id) {
            this.currData = this.params;
            this.$nextTick(() => {
              this.$refs.form.reset();
              let currData = {};
              for (const field in this.$refs.form.form.formItems) {
                currData[field] = this.currData[field];
              }
              this.$refs.form.setData(currData);
            });
          } else {
            this.$nextTick(() => {
              this.$refs.form.reset();
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    obBack() {
      this.$emit("event", {
        method: "onBack",
      });
    },
    onSubmit() {
      this.loading = true;
      this.$refs.form
        .getData()
        .then((formData) => {
          if (formData.id) {
            //编辑
            report_edit(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.obBack();
              })
              .catch((error) => {
                this.$message.error(error);
                this.loading = false;
              });
          } else {
            //新增
            report_add(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.obBack();
              })
              .catch((error) => {
                this.$message.error(error);
                this.loading = false;
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
  },
};
</script>
