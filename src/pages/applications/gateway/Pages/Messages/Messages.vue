<template>
  <a-card :bordered="false">
    <a-form-model :layout="layout" :model="form" :rules="rules">
      <a-form-model-item>
        <a-button type="primary" @click="onSend"> 发送消息 </a-button>
      </a-form-model-item>
      <a-col :span="11">
        <a-form-model-item label="是否发送通知">
          <a-switch v-model="form.notice" />
        </a-form-model-item>
        <a-form-model-item label="消息类型">
          <a-select v-model="form.type" allowClear placeholder="请选择消息类型">
            <a-select-option
              :value="item.id"
              v-for="(item, index) in dictmap"
              :key="index"
            >
              <a-tag :color="item.color" v-if="item.color">
                {{ item.title }}
              </a-tag>
              <template v-else>{{ item.title }}</template>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="消息标题" prop="title">
          <a-input
            allowClear
            v-model="form.title"
            placeholder="请输入消息标题"
          />
        </a-form-model-item>
        <a-form-model-item label="消息详情" prop="details">
          <a-textarea
            :auto-size="{ minRows: 3, maxRows: 6 }"
            allowClear
            v-model="form.details"
            placeholder="请输入消息详情"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="2">
        <a-form-model-item label="目标策略" prop="policy">
          <!-- <a-select v-model="form.policy" allowClear placeholder="请选择策略">
            <a-select-option
              :value="item.id"
              v-for="(item, index) in policys"
              :key="index"
            >
              {{ item.title }}
            </a-select-option>
          </a-select> -->
          <a-col :span="8">
            <a-tree-select
              :tree-data="organizations"
              showSearch
              placeholder="请选择组织"
              :replaceFields="{
                value: 'id',
                key: 'id',
              }"
              @select="onUserOrganizationSelects"
            >
            </a-tree-select>
          </a-col>
          <a-col :span="16">
            <a-tree-select
              v-model="form.policy"
              allowClear
              placeholder="请选择策略"
              :showSearch="true"
              :tree-data="policys"
              :replaceFields="{
                value: 'id',
                key: 'id',
                title: 'title',
              }"
            >
            </a-tree-select>
          </a-col>
        </a-form-model-item>
        <a-form-model-item label="目标组织" prop="policy">
          <a-tree-select
            v-model="form.organization"
            :tree-data="organizations"
            allowClear
            multiple
            showSearch
            tree-checkable
            :treeCheckStrictly="true"
            placeholder="请选择组织"
            :replaceFields="{
              value: 'id',
              key: 'id',
            }"
            @select="onOrganizationSelect"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="目标用户" prop="user">
          <a-col :span="8">
            <a-tree-select
              :tree-data="organizations"
              allowClear
              showSearch
              placeholder="请选择组织"
              :replaceFields="{
                value: 'id',
                key: 'id',
              }"
              @select="onUserOrganizationSelect"
            >
            </a-tree-select>
          </a-col>
          <a-col :span="16">
            <a-select
              v-model="form.users"
              allowClear
              mode="multiple"
              placeholder="请选择用户"
              :showSearch="true"
            >
              <a-select-option
                :value="item.id"
                v-for="(item, index) in currUsers"
                :key="index"
              >
                {{ item.realname }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-form-model-item>
        <a-form-model-item label="相关应用" prop="application">
          <a-select
            v-model="form.application.id"
            allowClear
            placeholder="请选择应用"
            @change="onApplicationSelect"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in applications"
              :key="index"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="应用数据" prop="application">
          <vue-json-editor
            v-model="form.application.data"
            :showBtns="false"
            :mode="jsonMode"
            lang="zh"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
          />
        </a-form-model-item>
      </a-col>
    </a-form-model>
  </a-card>
</template>

<script>
import { messages_add } from "@/services/messages";
import { organization_tree } from "@/services/organization";
import { policy_list, policy_tree, policy_alltree } from "@/services/policy";
import { application_list } from "@/services/application";
import { user_list } from "@/services/user";
import { dictmap_list } from "@/services/dictmap";
import vueJsonEditor from "vue-json-editor";
export default {
  components: {
    vueJsonEditor,
  },
  props: {},
  data() {
    return {
      layout: "vertical",
      jsonMode: "tree",
      form: {
        notice: true,
        organization: [],
        application: {
          data: {},
        },
      },
      organizations: [],
      policys: [],
      applications: [],
      currUsers: [],
      dictmap: [],
      rules: {
        title: [
          {
            required: true,
            message: "请输入消息标题",
            trigger: "blur",
          },
        ],
        details: [
          {
            required: true,
            message: "请输入消息详情",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    policy_tree() {
      return this.$auth("policy.alltree") ? policy_alltree : policy_tree;
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      Promise.all([
        organization_tree(),
        // policy_tree(),
        application_list(),
        dictmap_list({
          par_name: "MessageTags",
        }),
      ])
        .then((response) => {
          this.organizations = response[0].data.data;
          // this.policys = response[1].data.data;
          this.applications = response[1].data.data;
          this.dictmap = response[2].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onSend() {
      const organization = this.form.organization.map((item) => item.value);
      const formData = Object.assign({}, this.form);
      formData.organization = organization;
      console.log("formData", formData);
      messages_add(formData)
        .then((response) => {
          this.$message.success(response.data.message);
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    onUserOrganizationSelect(e) {
      user_list({
        organization: [e],
        include: ["id", "realname"],
      })
        .then((response) => {
          this.currUsers = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onUserOrganizationSelects(e) {
      if (e) {
        policy_tree({ organization: e })
          .then((response) => {
            this.policys = response.data.data;
            this.form = Object.assign({}, this.form, {
              policy: undefined,
            });
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        this.policys = [];
      }
    },
    onOrganizationSelect(e) {
      organization_tree({
        id: e.value,
      })
        .then((response) => {
          this.$nextTick(() => {
            response.data.data.forEach((item) => {
              const index = this.form.organization.findIndex((x) => {
                return x.value == item.id;
              });
              if (index === -1) {
                this.form.organization.push({
                  value: item.id,
                  label: item.title,
                });
              }
            });
            console.log("this.form.organization", this.form.organization);
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onApplicationSelect(e) {
      if (e) {
        const application = this.applications.find((x) => x.id == e);
        this.form.application.data = application.data;
      } else {
        this.form.application.data = {};
      }
    },
    onJsonChange() {},
    onJsonSave() {},
  },
};
</script>

<style>
.jsoneditor-poweredBy {
  display: none;
}
.jsoneditor-vue div.jsoneditor {
  min-height: 200px;
}
.jsoneditor-vue div.jsoneditor .jsoneditor-outer {
  min-height: 200px;
}

.jsoneditor-vue div.jsoneditor .jsoneditor-tree {
  overflow: unset;
}
</style>
