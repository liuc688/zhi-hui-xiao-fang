<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="rollback" />返回</a>
    </div>
    <div>
      报表管理
      <!-- <a-table
        ref="table"
        bordered
        class="table_content"
        size="middle"
        rowKey="_id"
        :loading="loading"
        :columns="columns"
        :pagination="{ pageSize: 10 }"
        :dataSource="dataSource"
        :scroll="{ x: 2000 }"
      >
      </a-table> -->
    </div>
  </a-card>
</template>
<script>
import { report_paginate } from "@/services/database";
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
  data() {
    return {
      loading: false,
      columns: [],
      dataSource: [],
      columnsdata: [],
      selectedRowKeys: [],
    };
  },
  created() {
    console.log("this.params", this.params);
    // this.id = this.params.data.id ? this.params.data.id : undefined;
    this.init();
  },
  methods: {
    init() {

      report_paginate()
        .then((res) => {
          console.log("res", res);
          this.dataSource = res.data.ids;
          this.columnsdata = res.data.table.fields;
          this.columns = [];
          for (let index = 0; index < this.columnsdata.length; index++) {
            this.columns.push({
              title: this.columnsdata[index].title,
              dataIndex: this.columnsdata[index].name,
              ellipsis: true,
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style scoped>
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.title_back a {
  color: #1890ff;
}
.page_paper {
  background: #f0f8ff;
  padding: 20px;
}
</style>