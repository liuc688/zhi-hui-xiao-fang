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
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="唯一ID" prop="id">
          <a-input v-model="form.id" :disabled="true" />
        </a-form-model-item>

        <a-form-model-item label="首页模版">
          <a-select v-model="form.home" placeholder="请选择目录模版" allowClear show-search :filter-option="filterOption">
            <a-select-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :title="item.title"
            >
              <span style="margin-right: 3px">{{ item.title }}</span>
              <a-tag v-if="item.ishare" color="cyan">享</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="目录模版">
          <a-select v-model="form.index" placeholder="请选择目录模版" allowClear show-search :filter-option="filterOption">
            <a-select-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :title="item.title"
            >
              <span style="margin-right: 3px">{{ item.title }}</span>
              <a-tag v-if="item.ishare" color="cyan">享</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="文档模板">
          <a-select v-model="form.document" placeholder="请选择文档模板" allowClear show-search :filter-option="filterOption">
            <a-select-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :title="item.title"
            >
              <span style="margin-right: 3px">{{ item.title }}</span>
              <a-tag v-if="item.ishare" color="cyan">享</a-tag>
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

      <div style="text-align: right">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { template_list } from "@/services/templates";
import { organization_edit } from "@/services/organization";

export default {
  name: "sitetemplate",
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
      form:{},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: true,
      templates: [],
      rules: {
        id: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    params(val) {
      this.loading = true;
      this.init();
    },
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.form = this.params;
      template_list({ id: this.params.id })
      .then((res) => {
        this.templates = res.data.data;
        this.$nextTick(()=>{
           var datas = {
            id: this.params.id,
            index: this.params.template ? this.params.template.index : "",
            document: this.params.template ? this.params.template.document : '',
            home: this.params.template ? this.params.template.home : '',
          };
          this.form = datas;
          this.loading = false;
        })
      });
      this.loading = false;
    },
    filterOption(input, option) {
      return option.componentOptions.propsData.title.indexOf(input) >= 0;
    },
    
    submint() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var  template= {
              index: this.form.index,
              document: this.form.document,
              home: this.form.home,
          };
          delete this.params['_modifytime'];
          delete this.params['_createtime'];
          organization_edit( Object.assign({}, this.params ,{ template :template,}) )
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