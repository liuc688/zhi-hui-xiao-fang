<template>
  <a-card :body-style="{ paddingBottom: '50px' }" :bordered="false">
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
      ref="ruleForm"
      layout="horizontal"
      :model="ruleForm"
      :rules="ruleForms"
      class="ruleFormes"
    >
      <div
        class="topicArea"
        v-for="(item, index) in ruleForm.datas"
        :key="index"
      >
        <a-tag color="#2db7f5" class="icon_number">
          {{ index + 1 }}
        </a-tag>
        <a-space class="icon_close">
          <a-tooltip v-if="index > 0">
            <template slot="title"> 删除当前数据 </template>
            <a-icon
              type="close-circle"
              v-if="index > 0"
              @click="deletsruleForm(item)"
            />
          </a-tooltip>
          <a-tooltip>
            <template slot="title"> 复制当前数据 </template>
            <a-icon type="copy" @click="copysruleForm(item)" />
          </a-tooltip>
        </a-space>
        <a-form-model-item
          label="子站点组（若当前站点非一级站点，则该字段禁用）"
        >
          <a-select
            mode="multiple"
            :disabled="siteinfo.parent ? true : false"
            v-model="ruleForm.datas[index].sites"
            style="width: 100%"
            placeholder="请选择子站点组"
            :filter-option="filterOption"
          >
            <a-select-option v-for="i in sitesarrays" :key="i.id">
              {{ i.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="挂载表单（仅挂载目录最后一个）">
              <a-select
                mode="multiple"
                v-model="ruleForm.datas[index].forms"
                style="width: 100%"
                placeholder="请选择挂载表单"
                :filter-option="filterOption"
              >
                <a-select-option v-for="i in formslist" :key="i.id">
                  {{ i.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否映射">
              <a-switch
                default-checked
                :disabled="siteinfo.parent ? true : false"
                v-model="ruleForm.datas[index].isMap"
              />
              （若当前站点非一级站点，则该字段禁用）
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-alert message="目录组" type="success" style="margin-top: 20px" />
        <div
          class="topicAreas"
          v-for="(temps, ind) in ruleForm.datas[index].titles"
          :key="index + '-' + ind"
        >
          <a-tag color="blue" class="icon_numbers">
            {{ ind + 1 }} 级目录
          </a-tag>
          <a-space class="icon_close">
            <a-tooltip v-if="ind > 0">
              <template slot="title"> 删除当前数据 </template>
              <a-icon
                type="close-circle"
                v-if="ind > 0"
                @click="deletsruleFormesdatas(index, temps)"
              />
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> 复制当前数据 </template>
              <a-icon type="copy" @click="copysruleFormesdatas(index, temps)" />
            </a-tooltip>
          </a-space>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="目录标题"
                :prop="'datas.' + index + '.titles.' + ind"
                :rules="reslees"
              >
                <a-input
                  placeholder="请输入目录标题"
                  v-model="ruleForm.datas[index].titles[ind]"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div style="width: 100%; text-align: center">
          <a-button
            @click="adddirectorysdatas(index)"
            icon="plus"
            style="margin: 20px auto; width: 50%"
          >
            添加目录组
          </a-button>
        </div>
      </div>
      <div style="width: 100%; text-align: center">
        <a-button
          @click="adddatas"
          type="primary"
          icon="plus"
          style="margin: 20px auto; width: 50%"
        >
          添加目录
        </a-button>
      </div>
    </a-form-model>
    <div style="width: 100%; text-align: right">
      <a-button type="primary" @click="getforms" :loading="loading"
        >保存</a-button
      >
    </div>
  </a-card>
</template>
<script>
import {
  channel_many_insert, //目录批量创建
} from "@/services/content";
import { organization_tree } from "@/services/organization";
import { forms_list } from "@/services/forms";
export default {
  name: "BatchCreateColumns",
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
    onOpen: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      siteinfo: {},
      sitesarrays: [],
      ruleForm: {
        datas: [{ titles: [""], sites: [], isMap: false, forms: [] }],
      },
      formslist: [],
      ruleForms: {
        titles: [
          { required: true, message: "请按层级输入目录组", trigger: "blur" },
        ],
      },
      reslees: {
        required: true,
        message: "请输入目录标题",
        trigger: "blur",
      },
      organization:''
    };
  },
  created() {
    console.log("params", this.params);
    this.siteinfo = this.params;
    this.organization = this.params.id
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        forms_list(),
        organization_tree({
          id: this.organization,
        }),
      ])
        .then((res) => {
          this.formslist = res[0].data.data;
          this.sitesarrays = res[1].data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    adddatas() {
      this.ruleForm.datas.push({
        titles: [""],
        sites: [],
        forms: [],
        isMap: false,
      });
    },
    getforms() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          var datas = {
            site: this.siteinfo.id,
            datas: this.ruleForm.datas,
          };
          channel_many_insert(datas)
            .then((res) => {
              if (res.data.status == 200) {
                this.loading = false;
                this.$message.success(res.data.message);
                this.back();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
              this.$message.error(err.response.data.message);
            });
        }
      });
    },
    // 删除目录
    deletsruleForm(item) {
      let index = this.ruleForm.datas.indexOf(item);
      if (index !== -1) {
        this.ruleForm.datas.splice(index, 1);
      }
    },
    // 复制目录
    copysruleForm(item) {
      var titles=[]
      for(let i in item.titles){
        titles.push(item.titles[i])
      }
      this.ruleForm.datas.push({
        titles: titles,
        sites: item.sites,
        forms: item.forms,
        isMap: item.isMap,
      });
    },
    // 删除当前目录组
    deletsruleFormesdatas(index, temps) {
      let indexs = this.ruleForm.datas[index].titles.indexOf(temps);
      if (indexs !== -1) {
        this.ruleForm.datas[index].titles.splice(indexs, 1);
      }
    },
    // 复制当前目录组
    copysruleFormesdatas(index, temps) {
      this.ruleForm.datas[index].titles.push(temps);
    },
    // 添加目录组
    adddirectorysdatas(index) {
      console.log('index, ', index)
      this.ruleForm.datas[index].titles.push("");
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    back() {
      this.$emit("event", {
        method: this.params.key == "2" ? "refreshes" : "refresh",
        params: {
          data: this.params.channel,
          site: this.params.id,
        },
      });
    },
  },
};
</script>
<style scoped>
.ruleFormes >>> .ant-form-item {
  margin-bottom: 0px !important;
}
.topicArea {
  position: relative;
  padding: 5px 8% 5px;
  width: 90%;
  margin: 20px auto;
  border-radius: 5px;
  box-shadow: rgb(186 207 233) 0 0 5px;
}
.topicAreas {
  position: relative;
  width: 100%;
  padding: 10px 10% 10px;
  margin: 20px 0;
  border-radius: 5px;
  box-shadow: rgb(186 207 233) 0 0 5px;
}
.topicAreas:hover {
  background: #cef0ff;
}
.icon_close {
  position: absolute;
  right: 5px;
  top: 0;
  font-size: 20px;
  color: #919191;
  cursor: pointer;
}
.icon_number {
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 20px;
}
.icon_numbers {
  position: absolute;
  left: 5px;
  top: 5px;
}
</style>
