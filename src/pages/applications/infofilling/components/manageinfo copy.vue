<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="日期"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-month-picker
              placeholder="请输入日期查询"
              :disabled-date="disabledDate"
              style="width: 100%"
              v-model="searchform.month"
              allowClear
              @change="onChange"
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
    <a-button type="primary" @click="onAdd" style="margin: 0px 0px 20px">
      <a-icon type="plus" />新增
    </a-button>
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
        <a-card
          class="itemd"
          :style="{ backgroundImage: item.jyxxfm.length ? 'url(' + item.jyxxfm[0].url + ')'  : ''}"
        >
          <a-card-meta class="items_card" @click="todetails(item)">
            <a-avatar
                v-if="item.logo.length"
                slot="avatar"
                :src="item.logo[0].url"
              />
            <a-avatar slot="avatar" v-else> 嘉明</a-avatar>
            <span slot="title" style="color: #fff; font-size: 20px">
              {{ item.year }}年
            </span>
          </a-card-meta>
          <!-- <template slot="actions" class="ant-card-actions">
            <a-tooltip>
              <template slot="title"> 表格编辑 </template>
              <a-icon key="edit" type="edit" disabled />
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> 表格模板生成</template>
              <a-icon key="download" type="download" />
            </a-tooltip>
            <a-tooltip>
              <template slot="title">接口文档</template>
              <a-icon key="file-done" type="file-done" />
            </a-tooltip>
          </template> -->
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
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";
import moment from "moment";
import { manage_paginate } from "@/services/infofilling";
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
      id: "63008e727815e604efcbb67d",
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {},
      dataSource: {},
      jsonData: {},
      pageSizeOptions: ["12", "24", "36", "48"],
      draftId: "",
      titles: "新增产品",
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
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
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
    this.init();
  },
  methods: {
    onChange(value, month) {
      this.searchform.month = month;
    },
    disabledDate(current) {
      return current && current > moment().endOf("day");
    },
    // 添加
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "managedetails",
          params: {
            edicts: true,
            shedows: true,
          },
        },
      });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      
      form_get({ name: "zdxf_products" })
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
      manage_paginate({company: this.id}).then(res=>{
        this.dataSource = res.data.data;
        this.loading = false;
        this.loadingsearch = false;
        this.loadingreset = false;
      }).catch(err=>{
        console.log('err',err)
        this.$message.error(err.response.data.message)
      })






      // setTimeout(() => {
      //   this.dataSource = {
      //     items: [
      //       {
      //         id: 12,
      //         name: "产品2",
      //         month: "8",
      //         year: "2022",
      //         url: require("../imges/8.jpeg"),
      //       },
      //       {
      //         id: 1,
      //         name: "产品1",
      //         month: "7",
      //         year: "2022",
      //         url: require("../imges/7.jpeg"),
      //       },
      //       {
      //         id: 2,
      //         name: "产品2",
      //         month: "6",
      //         year: "2022",
      //         url: require("../imges/6.jpeg"),
      //       },
      //       {
      //         id: 3,
      //         name: "产品3",
      //         month: "5",
      //         year: "2022",
      //         url: require("../imges/5.jpeg"),
      //       },
      //       {
      //         id: 4,
      //         name: "产品4",
      //         month: "4",
      //         year: "2022",
      //         url: require("../imges/4.jpeg"),
      //       },
      //       {
      //         id: 5,
      //         name: "产品5",
      //         month: "3",
      //         year: "2022",
      //         url: require("../imges/3.jpeg"),
      //       },

      //       {
      //         id: 6,
      //         name: "产品5",
      //         month: "2",
      //         year: "2022",
      //         url: require("../imges/2.jpeg"),
      //       },
      //       {
      //         id: 7,
      //         name: "矿泉水",
      //         month: "1",
      //         year: "2022",
      //         url: require("../imges/1.jpeg"),
      //       },
      //       {
      //         id: 8,
      //         name: "产品5",
      //         month: "12",
      //         year: "2021",
      //         url: require("../imges/12.jpeg"),
      //       },
      //       {
      //         id: 9,
      //         name: "产品5",
      //         month: "11",
      //         year: "2021",
      //         url: require("../imges/11.jpeg"),
      //       },
      //       {
      //         id: 10,
      //         name: "产品4",
      //         month: "10",
      //         year: "2021",
      //         url: require("../imges/10.jpeg"),
      //       },

      //       {
      //         id: 11,
      //         name: "产品3",
      //         month: "9",
      //         year: "2021",
      //         url: require("../imges/9.jpeg"),
      //       },
      //     ],
      //     page: this.searchform.page,
      //     per_page: this.searchform.per_page,
      //     total: 30,
      //   };
      //   this.loading = false;
      //   this.loadingsearch = false;
      //   this.loadingreset = false;
      // }, 500);
    
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },

    resetForm() {
      this.searchform = {};
      this.loading = true;
      this.loadingreset = true;
      this.loadDataSrouce();
    },
    //查看
    todetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "managedetails",
          params: {
            edicts: record.month == "8" ? true : false,
            shedows: false,
          },
        },
      });
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
// .loading {
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100vw;
//   height: 100%;
//   z-index: 990;
//   padding: 45vh 0;
//   background: #ffffff;
// }
// .span_loading {
//   align-items: center;
//   display: block;
// }
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
// ::-webkit-scrollbar {
//   width: 0 !important;
// }
// ::-webkit-scrollbar {
//   width: 0 !important;
//   height: 0;
// }
.itemd {
  width: 100%;
  // background-image: linear-gradient(
  //   to right,
  //   #a1c4fd 0%,
  //   #d9f3ff 51%,
  //   #a1c4fd 100%
  // );
  border-radius: 5px;
  transition: 0.8s;
  background-repeat: round;
  margin: 10px 0;
}
.itemd:hover {
  // background-position: right center;
  transform: scale(1.05);
  box-shadow: 2px 2px 10px 2px #8b8b8b;
  width: 100%;
  // background-size: over;
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
  padding: 20px 0;
  cursor: pointer;
  height: 160px;
}
</style>
