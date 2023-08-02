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
      ref="ruleFormes"
      layout="horizontal"
      :model="ruleFormes"
      :rules="ruleForms"
      class="ruleFormes"
    >
      <div
        class="topicArea"
        v-for="(item, index) in ruleFormes.datas"
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
              @click="deletsruleFormes(item)"
            />
          </a-tooltip>
          <a-tooltip>
            <template slot="title"> 复制当前数据 </template>
            <a-icon type="copy" @click="copysruleFormes(item)" />
          </a-tooltip>
        </a-space>
        <a-form-model-item label="站点组">
          <a-select
            mode="multiple"
            :disabled="siteinfo.parent ? true : false"
            v-model="ruleFormes.datas[index].sites"
            style="width: 100%"
            placeholder="请选择子站点组"
            :filter-option="filterOption"
          >
            <a-select-option v-for="i in sitesarrays" :key="i.id">
              {{ i.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-alert
          message="栏目组（栏目名称不填时后台自动生成24位随机字符串，填写时后台会拼接：站点名称+'_'+栏目名称）"
          type="success"
          style="margin-top: 20px"
        />
        <div
          class="topicAreas"
          v-for="(temps, ind) in ruleFormes.datas[index].titles"
          :key="index + '-' + ind"
        >
          <a-tag color="blue" class="icon_numbers">
            {{ ind + 1 }} 级栏目
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

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item
                label="栏目标题"
                :prop="'datas.' + index + '.titles.' + ind + '.title'"
                :rules="reslees"
              >
                <a-input
                  placeholder="请输入栏目标题"
                  v-model="ruleFormes.datas[index].titles[ind].title"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="栏目名称">
                <a-input
                  placeholder="请输入栏目名称"
                  v-model="ruleFormes.datas[index].titles[ind].name"
                >
                  <span
                    slot="addonBefore"
                    v-if="ruleFormes.datas[index].titles[ind].name"
                    >站点名称_</span
                  >
                </a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div
            v-if="ruleFormes.datas[index].titles[ind].judged"
            style="margin: 10px auto"
          >
            <a-alert banner>
              <template slot="message">
                <div>当前栏目名称在下列站点内已存在！</div>
                <a-tag
                  v-for="its in ruleFormes.datas[index].titles[ind].judge"
                  :key="its"
                  >{{ its }}</a-tag
                >
              </template>
            </a-alert>
          </div>
        </div>
        <div style="width: 100%; text-align: center">
          <a-button
            @click="adddirectorysdatas(index)"
            icon="plus"
            style="margin: 20px auto; width: 50%"
          >
            添加栏目组
          </a-button>
        </div>
      </div>
      <div style="width: 100%; text-align: center">
        <a-button
          @click="adddirectorys"
          type="primary"
          icon="plus"
          style="margin: 20px auto; width: 50%"
        >
          添加栏目
        </a-button>
      </div>
    </a-form-model>
    <div style="width: 100%; text-align: right; margin: 50px auto">
      <a-space>
        <a-button disabled style="color: #000000"
          ><a-icon type="warning" /> 必须触发一次验证，才能创建！</a-button
        >
        <a-button type="primary" @click="verifications">验证</a-button>
        <a-button
          type="primary"
          @click="directorymanyOks"
          :loading="directorymanyLoading"
          v-if="verifys"
          >确定</a-button
        >
      </a-space>
    </div>
  </a-card>
</template>
<script>
import {
  directory_many_verify,
  directory_many_insert, // 栏目批量创建
} from "@/services/content";
import { organization_tree } from "@/services/organization";
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
      ruleForms: {
        titles: [
          { required: true, message: "请按层级输入目录组", trigger: "blur" },
        ],
      },
      ruleFormes: {
        datas: [{ sites: [], titles: [{ title: "", name: "" }] }],
      },
      reslees: {
        required: true,
        message: "请输入栏目标题",
        trigger: "blur",
      },
      verifys: false,
      directorymanyLoading: false,
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
      organization_tree({
        id: this.organization,
      })
        .then((res) => {
          this.sitesarrays = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 添加栏目
    adddirectorys() {
      this.ruleFormes.datas.push({
        sites: [],
        titles: [{ title: "", name: "" }],
      });
    },
    // 删除栏目
    deletsruleFormes(item) {
      let index = this.ruleFormes.datas.indexOf(item);
      if (index !== -1) {
        this.ruleFormes.datas.splice(index, 1);
      }
    },
    // 复制栏目
    copysruleFormes(item) {
      var titles = [];
      for (let i in item.titles) {
        titles.push({
          title: item.titles[i].title,
          name: item.titles[i].name,
        });
      }
      this.ruleFormes.datas.push({
        sites: item.sites,
        titles: titles,
      });
    },

    // 栏目验证
    verifications() {
      this.$refs.ruleFormes.validate((valid) => {
        if (valid) {
          var datas = {
            site: this.siteinfo.id,
            datas: this.ruleFormes.datas,
          };
          directory_many_verify(datas)
            .then((res) => {
              var datas = res.data.data.datas;
              this.verifys = true;
              this.$nextTick(() => {
                for (let i in datas) {
                  for (let j in datas[i].titles) {
                    this.ruleFormes.datas[i].titles[j].judge = [];
                    this.ruleFormes.datas[i].titles[j].judge =
                      datas[i].titles[j].exists;
                    if (datas[i].titles[j].exists.length) {
                      this.ruleFormes.datas[i].titles[j].judged = true;
                    } else {
                      this.ruleFormes.datas[i].titles[j].judged = false;
                    }
                  }
                }
                console.log("this.ruleFormes", this.ruleFormes);
                this.$forceUpdate();
              });
            })
            .catch((error) => {
              console.log("error", error);
              this.$message.error(error.response.data.message);
            });
        }
      });
    },
    // 栏目保存
    directorymanyOks() {
      this.$refs.ruleFormes.validate((valid) => {
        if (valid) {
          var datas = {
            site: this.siteinfo.id,
            datas: this.ruleFormes.datas,
          };
          this.directorymanyLoading = true;
          directory_many_insert(datas)
            .then((res) => {
              console.log("res", res);
              if (res.data.status == 200) {
                this.directorymanyLoading = false;
                this.$message.success(res.data.message);
                this.back();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((error) => {
              console.log("error", error);
              this.directorymanyLoading = false;
              this.$message.error(error.response.data.message);
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
      var titles = [];
      for (let i in item.titles) {
        titles.push(item.titles[i]);
      }
      this.ruleForm.datas.push({
        titles: titles,
        sites: item.sites,
        forms: item.forms,
        isMap: item.isMap,
      });
    },
    // 删除栏目组
    deletsruleFormesdatas(index, temps) {
      let indexs = this.ruleFormes.datas[index].titles.indexOf(temps);
      if (indexs !== -1) {
        this.ruleFormes.datas[index].titles.splice(indexs, 1);
      }
    },
    // 复制栏目组
    copysruleFormesdatas(index, temps) {
      this.ruleFormes.datas[index].titles.push({
        title: temps.title,
        name: temps.name,
      });
    },
    // 添加栏目组
    adddirectorysdatas(index) {
      this.ruleFormes.datas[index].titles.push({
        title: "",
        name: "",
      });
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
