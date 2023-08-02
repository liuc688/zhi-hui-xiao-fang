<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="开始月份"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-month-picker
              @change="onChange"
              v-model="startValue"
              :disabled-date="disabledStartDate"
              style="width: 100%"
              placeholder="请选择开始月份"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="结束月份"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-month-picker
              @change="onChanges"
              v-model="endValue"
              :disabled-date="disabledEndDate"
              style="width: 100%"
              placeholder="请选择结束月份"
            />
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24" :offset="1">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingsearch" @click="onSearch"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="resetForm()"
              :loading="loadingreset"
              >重置</a-button
            >
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <a-space style="margin: 0px 0px 20px">
      <a-button type="primary" @click="onAdd">
        <a-icon type="plus" />新增
      </a-button>
      <a-button class="button_chheckbox">
        <a-checkbox v-model="searchform.delete" @change="onRecycles"
          >回收站</a-checkbox
        >
      </a-button>
    </a-space>

    <div class="alert">
      <a-alert
        message="该数据仅限园区统计使用，不作为任何部门的上报依据。"
        type="warning"
        style="font-size: 18px; padding-left: 50px"
        show-icon
      />
    </div>

    <a-list
      :data-source="dataSource.items"
      :loading="loading"
      :grid="{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card class="itemd">
          <a-card-meta
            class="items_card"
            :style="{
              backgroundImage: item.jyxxfm.length
                ? 'url(' + item.jyxxfm[0].url + ')'
                : 'url(/resources/public/20220906/6316e717d4363cd8d75cff75.jpg)',
            }"
            @click="todetails(item)"
          >
            <a-avatar
              v-if="item.logo.length"
              slot="avatar"
              class="avatars"
              :src="item.logo[0].url"
              :size="42"
            />
            <a-avatar slot="avatar" v-else> 嘉明</a-avatar>
            <span slot="title" class="title_data">
              {{ item.release.substring(0, 7) }}
            </span>
          </a-card-meta>
          <template slot="actions" class="ant-card-actions">
            <a-tooltip v-if="!item._delete">
              <template slot="title"> 编辑 </template>
              <a-icon key="edit" type="edit" disabled @click="edit(item)" />
            </a-tooltip>
            <a-tooltip v-else>
              <template slot="title">还原</template>
              <a-popconfirm
                placement="topRight"
                title="您确定要还原这条经营信息吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="restores(item)"
              >
                <a-icon type="retweet" />
              </a-popconfirm>
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> 删除</template>
              <a-popconfirm
                placement="topRight"
                title="您确定要删除这条经营信息吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deletes(item)"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </a-tooltip>
          </template>
        </a-card>
      </a-list-item>
    </a-list>

    <a-pagination
      size="small"
      style="text-align: right"
      @change="changepage"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      @showSizeChange="changepage"
      :pageSizeOptions="pageSizeOptions"
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>
    <a-modal
      :title="titles"
      width="50%"
      :visible="businessvisible"
      @ok="getOk()"
      @cancel="
        () => {
          businessvisible = false;
          this.$refs.ruleForm.resetFields();
        }
      "
    >
      <a-form-model
        ref="ruleForm"
        :model="forms"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="release" label="上报时间" prop="release">
          <a-month-picker
            v-model="forms.release"
            format="YYYY-MM"
            style="width: 100%"
            placeholder="请选择填报月份"
            :disabled-date="disabledDate"
            @change="onChange_s"
          />
        </a-form-model-item>
      </a-form-model>
      <k-form-build
        :value="jsonData"
        @change="handleChange"
        :config="config"
        ref="jsonDatas"
      />
    </a-modal>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
import moment from "moment";
import {
  manage_paginate,
  manage_create,
  manage_edit,
  manage_delete,
  manage_restore,
  manage_verify,
} from "@/services/infofilling";
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
  components: {},
  data() {
    return {
      id: undefined,
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {
        page: 1,
        per_page: 12,
        delete: false,
      },
      startValue: null,
      endValue: null,
      dataSource: {},
      jsonData: {},
      pageSizeOptions: ["12", "24", "36", "48"],
      draftId: "",
      titles: "经营信息新增",
      businessvisible: false,
      manageid: undefined,
      methodes: undefined,
      release: undefined,
      forms: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      rules: {
        release: [
          { required: true, message: "请选择填月份", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 12,
        };
      },
      set(val) {
        this.dataSource.page = val.page || 1;
        this.dataSource.per_page = val.per_page || 12;
      },
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
    this.id = this.params.id;
    this.init();
  },
  methods: {
    handleChange(key, value) {
      if (value == "release") {
        manage_verify({
          company: this.id,
          release: key,
        })
          .then((res) => {
            if (!res.data.data) {
              this.$message.error("已创建当前上报时间的企业填报");
              this.$nextTick(() => {
                this.$refs.jsonDatas.setData({
                  release: undefined,
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      }
    },
    onChange(date, dateString) {
      console.log("123", date, dateString);
      // this.searchform.month = month;
      this.searchform.start = dateString;
    },
    onChanges(date, dateString) {
      console.log("123", date, dateString);
      // this.searchform.month = month;
      this.searchform.end = dateString;
    },
    onChange_s(date, dateString) {
      if (dateString) {
        manage_verify({
          company: this.id,
          release: dateString,
        })
          .then((res) => {
            this.release = dateString;
            if (!res.data.data) {
              this.$message.error("已创建当前上报时间的企业填报");
              this.forms.release = undefined;
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error(err.response.data.message);
          });
      } else {
      }
    },
    onOks(value) {
      console.log("onOk: ", value);
    },
    openChangeOne(status) {
      console.log("status", status);
      this.yearShowOne = !this.yearShowOne;
    },
    // 填报月份
    disabledDate(current) {
      return (
        new Date(current).getMonth() + 1 >
        new Date(moment().endOf("month")).getMonth()
      );
    },
    // 添加
    onAdd() {
      this.businessvisible = true;
      this.manageid = undefined;
      this.methodes = manage_create;
      this.titles = "经营信息新增";
      this.$nextTick(() => {
        this.forms = {
          release: undefined,
        };
        this.release=undefined
        this.$refs.jsonDatas.show(["last_month"]);
        this.$refs.jsonDatas.reset();
      });
    },
    // 编辑
    edit(data) {
      this.businessvisible = true;
      this.titles = "经营信息编辑";
      this.methodes = manage_edit;
      this.manageid = data.id;
      this.$nextTick(() => {
        this.forms = {
          release: data.release ? data.release.substring(0, 7) : "",
        };
        this.release = data.release ? data.release.substring(0, 7) : "",
        this.$refs.jsonDatas.hide(["last_month"]);
        this.$refs.jsonDatas.setData({
          images: data.jyxxfm,
        });
      });
    },
    // 保存
    getOk() {
      this.$refs.jsonDatas
        .getData()
        .then((res) => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              var datas = Object.assign(res, {
                company: this.id,
                comeform: "PC端",
                id: this.manageid,
                release: this.release,
              });
              this.methodes(datas)
                .then((response) => {
                  this.businessvisible = false;
                  this.$message.success(response.data.message);
                  this.loadDataSrouce();
                })
                .catch((err) => {
                  console.log(err);
                  this.$message.error(err.response.data.message);
                });
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除
    deletes(record) {
      manage_delete({ id: record.id })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    //还原
    restores(record) {
      manage_restore({ id: record.id })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      form_get({ name: "zdxf_jyxxzb" })
        .then((Response) => {
          this.jsonData = Response.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },

    loadDataSrouce() {
      this.loading = true;
      manage_paginate(Object.assign(this.searchform, { company: this.id }))
        .then((res) => {
          this.dataSource = res.data.data;
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.response.data.message);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 12;
      this.loadDataSrouce();
    },
    onRecycles() {
      this.loadDataSrouce();
    },

    resetForm() {
      this.searchform = {};
      this.startValue = undefined;
      this.endValue = undefined;
      this.loading = true;
      this.loadingreset = true;
      this.loadDataSrouce();
    },
    //查看
    todetails(record) {
      console.log("record查看", record);
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "managedetails",
          params: {
            ids: record.id,
          },
        },
      });
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
  },
  mounted() {},
};
</script>

<style>
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.alert {
  margin-bottom: 16px;
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
.itemd {
  width: 100%;
  border-radius: 5px;
  transition: 0.8s;
  background-repeat: round;
  margin: 10px 0;
}
.itemd:hover {
  transform: scale(1.05);
  box-shadow: 2px 2px 10px 2px #8b8b8b;
  width: 100%;
}
.content_style {
  font-size: 38px;
  font-weight: 600;
  text-align: left;
  font-style: italic;
  color: #ffffff;
  margin-right: 60px;
}

.items_card {
  padding: 20px;
  cursor: pointer;
  height: 160px;
  background-repeat: round;
}

.avatars {
  background: #c9c9c9;
  border: 2px solid #918f8f;
}
</style>
<style scoped>
.itemd >>> .ant-card-body {
  padding: 0 !important;
}
.title_data {
  color: #ffffff;
  font-size: 28px;
  background: #7a909c62;
  padding: 0 10px;
  border-radius: 10px;
}
</style>
