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
        @back="back"
      >
        <template slot="title">
          <a-button @click="back"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <!-- 增编站点 -->
      <a-form-model
        :model="form"
        ref="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="组织机构代码" prop="code"
          ><a-input placeholder="请输入组织机构代码，否则会在站点框内有提醒图标" v-model="form.code"
        /></a-form-model-item>
        <a-form-model-item label="域名" prop="domain">
          <a-select
            mode="tags" placeholder="请输入域名"
            v-model="form.domain"
            style="width: 100%"
            :token-separators="[',']"
          ></a-select>
        </a-form-model-item>
        <a-form-model-item label="站点分类" prop="status">
          <a-select :default-value="0" v-model="form.status">
            <a-select-option :key="0">0、市本级选此项</a-select-option>
            <a-select-option :key="1">1、区县选此项</a-select-option>
            <a-select-option :key="2">2、市直部门选此项</a-select-option>
            <a-select-option :key="3">3、市级企事业单位选此项</a-select-option>
            <a-select-option :key="4">4、街道办事处选此项</a-select-option>
            <a-select-option :key="5">5、区县部门选此项</a-select-option>
            <a-select-option :key="6">6、县级企事业单位选此项</a-select-option>
            <a-select-option :key="7">7、市政府派出机构选此项</a-select-option>
            <a-select-option :key="8">8、县、区政府派出机构选此项</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="标题">
          <a-input placeholder="请输入站点标题" v-model="form.title" />
        </a-form-model-item>
        <a-form-model-item label="是否隐藏">
          <a-switch v-model="form.hidden" :defaultChecked="false" />
        </a-form-model-item>
         <a-form-model-item label="logo">
          <a-upload
            name="file"
            list-type="picture-card"
            :show-upload-list="false"
            :action="action"
            :headers="headers"
            @change="upLoadChange"
          >
            <img
              v-if="avatar.url"
              :src="avatar.url"
              alt="avatar"
              style="width: 90px;height: 90px;object-fit: cover;"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传LOGO</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
          <a-button type="primary" @click="saveSite">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>
<script>
import { organization_edit } from "@/services/organization";
import { FormUpload } from "@/services/api";
import Cookie from "js-cookie";
export default {
  name: "infosite",
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    headers() {
      return {
        Authorization: Cookie.get("Authorization"),
      };
    },
  },
  data() {
    return {
      loading: true,
      datas: {},
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
          },
        ],
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
       action: FormUpload,
       avatar:{
        name: null,
        status: null,
        type: null,
        uid: null,
        url: null,
       }
    };
  },
  watch: {
    params(val) {
      this.loading = true;
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    upLoadChange(info) {
      if (info.file.status === "done") {
        var data = info.file.response.data;
        this.avatar = {
          name: info.file.name,
          status: info.file.status,
          type: info.file.type,
          uid: info.file.uid,
          url: data.url,
        };
      }
    },
    init() {
      console.log('this.params', this.params)
      this.form = this.params;
      this.avatar = this.params.logo || this.avatar
      this.loading = false;
    },
    saveSite() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          delete this.params["_modifytime"];
          delete this.params["_createtime"];
          organization_edit(Object.assign({}, this.params, this.form,{logo: this.avatar}))
            .then((response) => {
              this.loading = false;
              this.$message.success(response.data.message);
              this.back();
            })
            .catch((err) => {
              this.$message.error(err);
              this.loading = false;
            });
        }
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