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
        @back="backs"
      >
        <template slot="title">
          <a-button @click="backs"><span>返回</span></a-button>
          <span style="padding:10px">{{titles}}</span>
        </template>
      </a-page-header>
      <k-form-build
        :value="jsonDatas"
        ref="defaultForm"
        :dynamicData="dynamicData"
      />
      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import { channel_list } from "@/services/content";
import { document_source } from "@/services/content";
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
      loading: true,
      jsonDatas: {},
      dynamicData: {
        treeData: [],
      },
      titles:"文章抄送"
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let promises=[
        form_get({ name: "docment_source" }),
      ]
      if(this.params.batch){
        this.titles="文章抄送"
        promises.push(
          channel_list({
          site: this.params.site,
          tree: true,
        }),
        )
      }else{
        this.titles="文章呈送"
        promises.push(
          channel_list({
          site: this.params.siteinfo.parent,
          tree: true,
        }),
        )
      }
      Promise.all(promises)
        .then((res) => {
          this.jsonDatas = res[0].data.data.form;
          this.dynamicData.treeData = res[1].data.data;
          this.$refs.defaultForm.reset();
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submint() {
      this.$refs.defaultForm
        .getData()
        .then((res) => {
          document_source(
            Object.assign(res, { id: this.params.selectedRowKeys })
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
        })
        .catch((err) => {
          console.log(err);
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