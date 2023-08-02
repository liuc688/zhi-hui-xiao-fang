<template>
  <div class="container">
    <a-row>
      <a-card :bordered="false">
        <div slot="extra">
          <a-radio-group
            v-model="value"
            button-style="solid"
            @change="onChange"
          >
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="system">系统应用</a-radio-button>
            <a-radio-button value="router">路由应用</a-radio-button>
            <a-radio-button value="iframe">外部应用</a-radio-button>
          </a-radio-group>
          <a-input-search
            style="margin-left: 16px; width: 272px"
            allowClear
            @search="onSearch"
          />
        </div>
        <a-button
          type="dashed"
          style="width: 100%"
          icon="plus"
          v-auth="`application.edit`"
          @click="onSetting"
          :loading="loading"
          >添加</a-button
        >
        <a-list :loading="loading" size="large" :pagination="false">
          <a-list-item :key="item.id" v-for="item in application_list">
            <a-list-item-meta>
              <div slot="description">
                <span>名称：{{ item.name }}</span>
                <span>路由地址：{{ item.router }}</span>
              </div>
              <a-avatar
                slot="avatar"
                size="large"
                shape="square"
                :src="item.icon.url"
              />
              <a
                slot="title"
                @click="onSetting(item)"
                v-auth="`application.edit`"
                style="color: #1890ff"
                >{{ item.title }}</a
              >
            </a-list-item-meta>
            <div slot="actions">
              <a
                @click="onDelete(item)"
                v-auth="`application.delete`"
                style="color: #1890ff"
                >删除</a
              >
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <span>更新时间：{{ item._modifytime }}</span>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-card>
    </a-row>
    <a-modal
      v-model="visible"
      :title="title"
      ok-text="确认"
      cancel-text="取消"
      @ok="onOk"
      centered
      width="70%"
      :confirmLoading="loading"
      :z-index="1002"
    >
      <k-form-build
        :value="jsonData"
        ref="form"
        :dynamicData="dynamicData"
        :config="config"
      />
    </a-modal>
  </div>
</template>

<script>
import {
  application_list,
  application_delete,
  application_add,
  application_edit,
} from "@/services/application";
import { icon_list } from "@/services/icons";

import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
export default {
  name: "application",
  props: {
    id: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
      default: () => {
        return {};
      },
    },
    refresh: {
      type: Function,
      default: () => {
        console.log("refresh");
      },
    },
  },
  computed: {
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
      return {
        config: {},
        IconList: this.IconList,
      };
    },
  },
  data() {
    return {
      title: "设置应用",
      jsonData: {},
      IconList: [],
      visible: false,
      application_list: [],
      record: {},
      loading: false,
      value: "all",
    };
  },

  authorize: {
    onDelete: "application.delete",
    onSetting: "application.edit",
    onAdd: "user.add",
    onEdit: "user.edit",
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        application_list(),
        icon_list(),
        form_get({ name: "applications" }),
      ]).then((response) => {
        //设置表单内容
        
        this.application_list = response[0].data.data;
        this.datas = this.application_list;
        this.IconList = response[1].data.data;
        this.jsonData = response[2].data.data.form;
      });
    },
    onSetting(record) {
      this.visible = true;
      if (record.id) {
        this.title = "编辑";
        this.record = record;
        this.$nextTick(() => {
          this.$refs.form.reset();
          let formData = {};
          for (let key in this.$refs.form.form.formItems) {
            formData[key] = record[key];
          }
          formData = Object.assign(formData, {
            icon: formData.icon.url ? [formData.icon] : [],
          });
          this.$refs.form.setData(formData);
        });
        //编辑
      } else {
        //新增
        this.title = "新增";
        this.record = {
          icon: {
            url: undefined,
          },
        };
        this.$nextTick(() => {
          this.$refs.form.reset();
          const formData = Object.assign(this.record, {
            icon: this.record.icon.url ? [this.record.icon] : [],
          });
          this.$refs.form.setData(formData);
        });
      }
    },
    onOk() {
      this.$refs.form
        .getData()
        .then((formData) => {
          this.loading = true;
          formData.icon = formData.icon.length ? formData.icon[0] : undefined;
          formData.data = formData.data ? formData.data : {};
          formData._extension = formData._extension ? formData._extension : {};
          let commit = null;
          if (!this.record.id) {
            commit = application_add(formData);
          } else {
            formData.id = this.record.id;
            commit = application_edit(formData);
          }
          commit
            .then((response) => {
              const data = response.data;
              if (data.status) {
                this.$message.success(data.message);
              } else {
                this.$message.error(data.message);
              }
              this.onClose();
            })
            .catch((error) => {
              console.log(error);
              this.onClose();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onDelete(record) {
      this.$confirm({
        title: "删除确认",
        content: "确认要删除接口吗?该操作不可逆,请谨慎操作!",
        okText: "确认",
        cancelText: "取消",
        confirmLoading: this.loading,
        onOk: () => {
          this.loading = true;
          application_delete({ ids: [record.id] })
            .then((response) => {
              this.$message.success(response.data.message);
              this.onClose();
            })
            .catch(() => {
              this.onClose();
            });
        },
      });
    },
    onClose() {
      this.init();
      this.visible = false;
      this.loading = false;
      this.$refs.form.reset();
      this.$emit("refresh", {});
    },
    onSearch(value) {
      this.application_list = this.datas.filter((item) => {
        return (
          item.name.indexOf(value) !== -1 || item.title.indexOf(value) !== -1
        );
      });
    },
    onChange(e) {
      this.value = e.target.value;
      if (this.value !== "all") {
        this.application_list = this.datas.filter((item) => {
          return item.type == this.value;
        });
      } else {
        this.application_list = this.datas.filter((item) => {
          return item;
        });
      }
    },
  },
};
</script>

<style scoped="lang">
.container {
  width: 100%;
}
</style>
