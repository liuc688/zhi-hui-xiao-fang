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
import { dictmap_tree } from "@/services/dictmap";
import { organization_tree } from "@/services/organization";
import { riskinfo_get, riskinfo_add, riskinfo_edit } from "@/services/risk";
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
    level() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "LEVEL";
        });
        return maps.children;
      }
      return [];
    },
    status() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "STATUS";
        });
        return maps.children;
      }
      return [];
    },
    division() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "DIVISION";
        });
        return maps.children;
      }
      return [];
    },
    industrial() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "INDUSTRIAL";
        });
        return maps.children;
      }
      return [];
    },
    dynamicData() {
      let result = {
        division: this.division,
        organization: this.organization,
        status: this.status.map((item) => {
          return {
            key: item.id,
            title: item.title,
          };
        }),
        level: this.level.map((item) => {
          return {
            key: item.id,
            title: item.title,
          };
        }),
        industrial: this.industrial.map((item) => {
          return {
            key: item.id,
            title: item.title,
          };
        }),
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
          name: "riskinfo_add",
        }),
        dictmap_tree(),
        organization_tree(),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
          this.dictmaps = response[1].data.data;
          this.organization = response[2].data.data;
          if (this.params.id) {
            riskinfo_get({
              id: this.params.id,
            }).then((response) => {
              this.currData = response.data.data;

              this.$nextTick(() => {
                this.$refs.form.reset();

                let currData = {};
                for (const field in this.$refs.form.form.formItems) {
                  currData[field] = this.currData[field];
                }
                this.$refs.form.setData(currData);
              });
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
            riskinfo_edit(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.obBack();
              })
              .catch((error) => {
                this.$message.error(response.data.message);
                this.loading = false;
              });
          } else {
            //新增
            riskinfo_add(formData)
              .then((response) => {
                this.$message.success(response.data.message);
                this.loading = false;
                this.obBack();
              })
              .catch((error) => {
                this.$message.error(response.data.message);
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
