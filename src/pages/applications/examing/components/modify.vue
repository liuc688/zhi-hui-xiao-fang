<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <!-- <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div> -->

    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
            >清空</a
          >
        </div>
      </a-alert>
    </div>

    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      rowKey="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a-button type="dashed" @click="details(record)">修改试卷</a-button>
      </span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      @change="onChangePage"
      @showSizeChange="onChangePage"
      :pageSizeOptions="['10', '20', '30', '40']"
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>
    <div v-if="showCard">
      <a-button @click="back()" class="logo"
        ><a-icon type="arrow-left" />返回</a-button
      >
    </div>
  </a-card>
</template>

<script>
import { examinees_paginate, short_get } from "@/services/knowledge";
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
      showCard:false,
      loading: false,
      dataSource: {},
      columns: [
        {
          title: "姓名",
          dataIndex: "user",
          align: "center", //显示列表单元格的中间
          scopedSlots: { customRender: "user" },
          ellipsis: true,
        },

        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
          ellipsis: true,
        },
      ],
      selectedRowKeys: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {};
      return result;
    },
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.init();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    details(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "shortmodify",
          params: {
            card: this.params.card,
            data: this.params.data,
            userId: item.id,
          },
        },
      });
    },
    init() {
      examinees_paginate({
        examination: this.params.data.id,
        page: this.pagination.page,
        per_page: this.pagination.per_page,
      })
        .then((res) => {
          this.dataSource = res.data.data;
          this.loading = false;
          this.showCard = true;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
  },
};
</script>



<style scoped>
.logo {
  margin: 10px 0 0 0;
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  border-radius: 20px;
  background-size: 400%;
  font-size: 18px;
  text-transform: uppercase;
}
.logo:hover {
  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400%;
  }
}
.logo::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  /* background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); */
  border-radius: 40px;
  background-size: 400%;
  opacity: -1;
  transition: 0.5s;
}
.logo:hover::before {
  filter: blur(20px);
  opacity: 1;
}
</style>