<template>
  <a-card>
    <div>
      <a-page-header>
        <a-form layout="horizontal" :model="searchform" ref="searchform">
          <div :class="'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="关键字"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="请输入"
                    v-model="searchform.keyword"
                    allowClear
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="行业分类"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-tree-select
                    show-search
                    :treeData="organization"
                    :replaceFields="{
                      key: 'id',
                      value: 'id',
                    }"
                    v-model="searchform.organization"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择行业分类"
                    allow-clear
                    multiple
                    tree-default-expand-all
                  ></a-tree-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="onSearch" :loading="loading"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="
                () => {
                  searchform = {};
                  init();
                }
              "
              >重置</a-button
            >
          </span>
        </a-form>
      </a-page-header>
    </div>
    <div style="width: 100%; padding: 5px 0px">
      <a-dropdown-button
        @click="onAdd()"
        v-auth="`classroom.add`"
        v-if="$auth('classroom.add')"
        >创建课件</a-dropdown-button
      >
    </div>
    <div>
      <a-card>
        <template v-for="item in data.items">
          <a-card-grid
            class="card-grid"
            :key="item.id"
            @click="onClick(item)"
            @contextmenu.prevent="onRightClick(item)"
          >
            <a-card-meta>
              <span slot="title">
                <a-tooltip>
                  <template slot="title">
                    <p>{{ item.title }}</p>
                  </template>
                  <p>{{ item.title.slice(0, 10) }}</p>
                </a-tooltip>
              </span>
              <div slot="description">
                <a-tooltip>
                  <template slot="title">
                    <p>{{ item.summary }}</p>
                  </template>
                  <p>{{ item.summary.slice(0, 10) }}</p>
                </a-tooltip>
                <p>{{ item._createtime }}</p>
                <p>
                  <a-rate v-model="item.grades" disabled allow-half />
                </p>
              </div>
              <template v-if="item.images.length">
                <a-avatar
                  slot="avatar"
                  :src="item.images[0].url || avatar"
                  class="avatar"
                />
              </template>
              <template v-else>
                <a-avatar slot="avatar" :src="avatar" class="avatar" />
              </template>
            </a-card-meta>
          </a-card-grid>
        </template>
      </a-card>
      <a-pagination
        size="small"
        style="text-align: right; padding: 15px 0"
        :current="pagination.page"
        :defaultPageSize="pagination.per_page"
        @change="onChangePage"
        @showSizeChange="onChangePage"
        :pageSizeOptions="['10', '20', '30', '40']"
        :total="data.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
  </a-card>
</template>

<script>
import { organization_tree } from "@/services/organization";
import { classroom_paginate, classroom_delete } from "@/services/classroom";
export default {
  components: {},
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
      visible: false,
      avatar: require("@/assets/images/empty.png"),
      title: null,
      jsonData: {},
      data: {
        page: 1,
        per_page: 10,
      },
      organization: [],
      searchform: {},
      selectedRows: [],
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {};

      return result;
    },
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
  },
  authorize: {
    onAdd:"classroom.add"
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.paginate();
      Promise.all([organization_tree()])
        .then((response) => {
          this.organization = response[0].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    paginate() {
      this.loading = true;
      let organization = this.userinfo.organization;
      if (this.searchform.organization && this.searchform.organization.length) {
        organization = this.searchform.organization;
      }
      const params = Object.assign(
        Object.assign(this.pagination, this.searchform),
        {
          organization: organization,
        }
      );

      classroom_paginate(params)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.data.message);
          this.loading = false;
        });
    },

    onClick(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "class-room-show",
          params: record || {},
        },
      });
    },
    onRightClick(record) {
      this.$contextmenu({
        items: [
          {
            label: "编辑课件",
            divided: true,
            icon: "anticon anticon-file-add",
            onClick: () => {
              this.onEdit(record);
            },
          },
          {
            label: "删除课件",
            divided: true,
            icon: "anticon anticon-file-add",
            onClick: () => {
              this.onDelete(record);
            },
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 20001,
        minWidth: 230,
      });
      return false;
    },
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "class-room-detail",
          params: {},
        },
      });
    },
    onEdit(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "class-room-detail",
          params: record || {},
        },
      });
    },
    onDelete(record) {
      let ids = [];
      if (record.id) {
        //单选
        ids.push(record.id);
      } else {
        //多选
        ids = this.selectedRows.map((item) => {
          return item.id;
        });
      }
      classroom_delete({
        id: ids,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.init();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onSearch() {
      this.paginate();
    },
    onClear() {},
    onSelectChange() {},
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
  },
};
</script>

<style lang="less" scoped>
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 5%;
}

.card-grid {
  width: 350px;
  cursor: pointer;
}

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
</style>