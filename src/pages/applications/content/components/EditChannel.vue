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
        :dynamicData="dynamicData"
        :config="config"
        @change="handleChange"
      />
      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint" :loading="loading">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import {
  channel_get,
  channel_list,
  channel_edit,
  channel_insert,
  channel_verifsort
} from "@/services/content";
import Cookie from "js-cookie";

export default {
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
      this.loading = true;
      this.contentget();
    },
  },
  data() {
    return {
      jsonData: {},
      forms: {},
      loading: true,
      methodes: channel_insert,
      id: undefined,
      site: undefined
    };
  },
  computed: {
    dynamicData() {
      let result = {
        channels: [],
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
    console.log('params', this.params)
    this.id = this.params.id || undefined
    this.site = this.params.site || undefined
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        form_get({ name: "channel_add_edit" }),
        channel_list({ site: this.params.site, tree: true }),
      ])
        .then((res) => {
          this.jsonData = res[0].data.data.form;
          this.dynamicData.channels = res[1].data.data;
          this.contentget();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 数据获取
    contentget() {
      if (this.id) {
        this.methodes = channel_edit;
        channel_get({ id: this.id })
          .then((res) => {
            this.forms = res.data.data;
            this.$nextTick(() => {
              this.$refs.defaultForm.reset();
              this.$refs.defaultForm.setData({
                id: this.forms.id,
                title: this.forms.title,
                parent: this.forms.parent,
                logo: this.forms.logo,
                link: this.forms.link,
                icon: this.forms.icon,
                mome: this.forms._mome, //目录描述
                name: this.forms.name,
                sort: this.forms.sort
              });
              this.loading = false;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.methodes = channel_insert;
        this.$nextTick(() => {
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
    // 保存
    submint() {
      this.$nextTick(() => {
        this.loading = true;
        this.$refs.defaultForm
          .getData()
          .then((formData) => {
            this.methodes(
              Object.assign(formData, {
                id: this.params.id ? formData.id : undefined,
                site: this.params.site,
              })
            )
              .then((response) => {
                this.loading = false;
                this.$message.success(response.data.message);
                this.back(
                  this.params.id ? formData.id : response.data.data.id,
                  this.params.site
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
      });
    },
    // 排序权重
    handleChange(value, key){
      if(key == 'sort' && value){
        channel_verifsort({
          site: this.site,
          sort: value
        }).then(response=>{
          console.log('response',response)
          if(response.data.data == '不可用'){
            this.$message.error("当前排序数值不可用！")
          }
        }).catch(error=>{
          console.log('error', error)
        })
      }else{
      }
    },
    back(data, site) {
      this.$emit("event", {
        method: "refresh",
        params: {
          data: data,
          site: site,
        },
      });
    },
    backs() {
      this.$emit("event", {
        method: "treeSelect",
        params: [this.params.id],
      });
    },
  },
};
</script>
