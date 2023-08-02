<template>
  <div class="side-setting">
    <!-- 配置/模板 -->
    <a-radio-group
      default-value="config"
      class="radio_change"
      button-style="solid"
      @change="onChange"
    >
      <a-radio-button value="config">配置</a-radio-button>
      <a-radio-button value="modal">模板</a-radio-button>
    </a-radio-group>
    <!-- 配置 -->
    <div v-if="visibal">
      <a-form-item
        label="组织"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <!-- <a-select
          v-model="organiz"
          @change="handleChange"
          show-search
          :filter-option="filterOption"
          style="width: 100%"
        >
          <a-select-option
            v-for="item in organizations"
            :key="item.id"
            :value="item.id"
            >{{ item.title }}</a-select-option
          >
        </a-select> -->
        <a-tree-select
          style="width: 100%"
          show-search
          @change="handleChange"
          v-model="organiz"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="organizations"
          placeholder="请选择查询部门"
          allow-clear
          :replaceFields="{
            title: 'title',
            key: 'id',
            value: 'id',
          }"
          :filterTreeNode="
            (value, node) => {
              const data = node.componentOptions.propsData.dataRef;
              return (
                data.title.indexOf(value) !== -1 ||
                data.name.indexOf(value) !== -1
              );
            }
          "
        >
          <span slot="title" slot-scope="{ key, value }" style="color: #08c">{{
            value
          }}</span>
        </a-tree-select>
      </a-form-item>
      <!-- <k-form-build
        :value="configData"
        ref="forms"
        :dynamicData="dynamicData"
      /> -->
      <a-spin tip="Loading..." :spinning="loading">
        <a-form-model
          ref="forms"
          :model="forms"
          :label-col="labelCol"
          :rules="rules"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="答复天数范围" prop="reply">
            <a-slider v-model="forms.reply" range :min="1" :max="60" />
          </a-form-model-item>
          <a-form-model-item label="补证天数范围" prop="repair">
            <a-slider v-model="forms.repair" range :min="1" :max="60" />
          </a-form-model-item>
          <a-form-model-item label="申请复议时间范围" prop="reconsider">
            <a-slider v-model="forms.reconsider" range :min="1" :max="60" />
          </a-form-model-item>
          <a-form-model-item label="协同办理时间范围" prop="teamwork">
            <a-slider v-model="forms.teamwork" range :min="1" :max="60" />
          </a-form-model-item>
          <a-form-model-item label="第三方意见时间范围" prop="opinion">
            <a-slider v-model="forms.opinion" range :min="1" :max="60" />
          </a-form-model-item>
          <a-form-model-item label="延期天数" prop="defer">
            <a-slider v-model="forms.defer" :min="1" :max="20" />
          </a-form-model-item>
          <a-form-model-item label="补证之前天数" prop="berepair">
            <a-slider v-model="forms.berepair" :min="1" :max="20" />
          </a-form-model-item>
          <a-form-model-item label="短信接受手机号" prop="mobile">
            <a-input v-model="forms.mobile" placeholder="请输入手机号码" />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
      <a-button @click="submit" type="primary" v-auth="`apply.config`"
        >保存</a-button
      >
    </div>
    <!-- 模板 -->
    <div v-else>
      <h3 :style="{ marginBottom: '16px' }">模板上传：</h3>
      <k-form-build
        :value="modalData"
        ref="loadForms"
        :dynamicData="dynamicData"
        :config="config"
        @change="changes"
      ></k-form-build>
      <a-button
        @click="submitLoad"
        type="primary"
        v-auth="`module.upload`"
        style="margin-bottom: 20px"
        >保存</a-button
      >
      <h3 :style="{ marginBottom: '16px' }">模板展示：</h3>
      <div class="list_block">
        <a-list
          item-layout="horizontal"
          class="scroll_list"
          :data-source="modalList"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a
              target="_blank"
              rel="noopener noreferrer"
              :title="item.title"
              :href="item.module"
              :download="item.title"
              class="
                ant-upload-list-item-name ant-upload-list-item-name-icon-count-1
              "
              >{{ item.title }}</a
            >
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>
<script>
import {
  config,
  apply_config,
  module_upload,
  module_list,
  site_list,
} from "@/services/public";
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
import { organization_tree } from "@/services/organization";
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      loading: true,
      visibal: true,
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      forms: {
        reply: [20, 40],
        repair: [15, 20],
        reconsider: [7, 20],
        teamwork: [15, 20],
        opinion: [15, 20],
        defer: 20,
        berepair: 7,
      },
      organizations: [],
      organiz: "",
      modalData: {},
      form: {},
      defaultFileList: [],
      modalList: [],
      status: [
        { value: 20, label: "受理" },
        { value: 25, label: "补证" },
        { value: 31, label: "征求第三方意见" },
        { value: 32, label: "协同办理" },
        { value: 50, label: "延期" },
        { value: 60, label: "答复" },
        { value: 70, label: "行政复议" },
        { value: 75, label: "诉讼" },
        { value: 110, label: "撤销" },
      ],
      rules: {
        mobile: [
          {
            min: 11,
            max: 11,
            message: "手机长度为11",
            trigger: "blur",
          },
          {
            pattern: "^1[3-9]\\d{9}$",
            message: "请输入正确的手机号",
          },
        ],
      },
    };
  },
  authorize: {
    submit: "apply.config",
    submitLoad: "module.upload",
  },
  created() {
    this.organizations = this.$store.getters["account/user"].organization;
    this.organiz = this.organizations[0].id;
    this.init();
  },
  mounted() {},
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
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
    dynamicData() {
      let result = {
        // organizations: [],
        status: [
          { value: 20, label: "受理" },
          { value: 25, label: "补证" },
          { value: 31, label: "征求第三方意见" },
          { value: 32, label: "协同办理" },
          { value: 50, label: "延期" },
          { value: 60, label: "答复" },
          { value: 70, label: "行政复议" },
          { value: 75, label: "诉讼" },
          { value: 110, label: "撤销" },
        ],
      };
      // for (let item in this.organizations) {
      //   result.organizations.push({
      //     value: this.organizations[item].id,
      //     label: this.organizations[item].title,
      //   });
      // }
      return result;
    },
  },
  methods: {
    init() {
      Promise.all([form_get({ name: "modal_y" }), organization_tree()])
        .then((Response) => {
          this.modalData = Response[0].data.data.form;
          this.organizations = Response[1].data.data;
          this.handleChange(this.organizations[0].id);
        })
        .catch((error) => {
          console.log("erroe", error);
        });
      this.fileList();
    },
    // 模板列表
    fileList() {
      module_list({
        status: [20, 25, 31, 32, 50, 60, 70, 75, 110],
      })
        .then((Response) => {
          this.modalList = Response.data.data;
        })
        .catch((error) => {
          console.log("erroe", error);
        });
    },
    // 站点-配置获取
    handleChange(value) {
      this.loading = true;
      this.organiz = value;
      var params = {
        organization: value,
      };
      config(params)
        .then((response) => {
          this.loading = false;
          if (response.data.data) {
            this.forms = response.data.data;
          } else {
            this.forms = {
              reply: [20, 40],
              repair: [15, 20],
              reconsider: [7, 20],
              teamwork: [15, 20],
              opinion: [15, 20],
              defer: 20,
              berepair: 7,
              mobile: undefined,
            };
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    changes(value, key) {
      if (key == "modal") {
        for (let index = 0; index < value.length; index++) {
          if (value[index].name.indexOf("docx") < 0) {
            this.$message.error("请选择格式为.docx的文件!");
            this.$nextTick(() => {
              this.$refs.loadForms.setData({
                modal: [],
              });
            });
          }
        }
      }
    },
    onChange(e) {
      var choose = e.target.value;
      if (choose == "config") {
        this.visibal = true;
      } else {
        this.visibal = false;
      }
    },
    // 配置保存
    submit() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.forms.organization = this.organiz;
          apply_config(this.forms)
            .then(() => {
              this.$message.success("设置成功！");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    // 模板保存
    submitLoad() {
      var that = this;
      this.$refs.loadForms
        .getData()
        .then((res) => {
          var params = {
            title: res.title,
            module: res.modal[0].url,
            status: res.status,
          };
          module_upload(params)
            .then(() => {
              that.$refs.loadForms.reset();
              this.fileList();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.side-setting {
  min-height: 100%;
  //   width: 400px;
  background-color: @base-bg-color;
  //   padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
  .flex {
    display: flex;
  }
  .select-item {
    width: 80px;
  }
  .radio_change {
    padding: 0 0 20px;
  }
  .list_block {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid #f0f0f0;
    // background: #f0f0f0;
  }
  .scroll_list {
    padding: 10px;
    max-height: 260px;
    overflow-y: auto;
    background: #ffffff;
  }
}
.ant-list-item:hover {
  background: #f5f5f5;
}
.ant-upload-list-item-name-icon-count-1 {
  padding: 12px;
}
.ant-list-split .ant-list-item {
  border-bottom: 0px !important;
  padding: 0px;
}
</style>