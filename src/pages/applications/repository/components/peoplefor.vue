<template>
  <div style="min-height: 90vh">
    <a-card
      :bordered="false"
      class="ant-pro-components-tag-select"
      style="margin-bottom: 24px"
    >
      <standard-form-row title="关键字检索" grid last>
        <a-row>
          <a-col :lg="8" :md="12" :sm="24" :xs="24"
            ><a-input-search
              placeholder="请输入关键字"
              :loading="searchLoading"
              enterButton
              allow-clear
              v-model="keywords"
              @search="onSearch"
          /></a-col>
          <a-col :lg="16" :md="12" :sm="24" :xs="24">
            <a-button
              type="primary"
              @click="addChannel()"
              style="margin: 0 30px; float: right"
            >
              <a-icon type="plus" />
              新增
            </a-button>
          </a-col>
        </a-row>
      </standard-form-row>

      <div class="ant-pro-pages-list-projects-cardList">
        <a-list
          :loading="loading"
          :data-source="data.items"
          style="margin: 20px 0"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <span slot="title">留言标题</span>
              <span slot="description">
                <a-popover v-if="item.title.length > 60">
                  <template slot="content">
                    <span style="width: 500px">{{ item.title }}</span>
                  </template>
                  <a @click="look(item)" style="color: #1890ff">
                    {{ item.title.substring(0, 60) }}...</a
                  >
                </a-popover>
                <a v-else @click="look(item)" style="color: #1890ff">
                  {{ item.title }}</a
                >
              </span>
            </a-list-item-meta>
            <div slot="actions" style="width: 130px; text-align: left">
              <a
                @click="addChannel(item)"
                style="color: #1890ff"
                v-if="item._extension.isSelf"
                >编辑</a
              >
              <a-divider type="vertical" v-if="item._extension.isSelf" />
              <a-popconfirm
                title="您确定要删除此条信息吗?"
                ok-text="确认"
                v-if="item._extension.isSelf"
                placement="topLeft"
                cancel-text="取消"
                @confirm="confirm(item)"
              >
                <a href="#" style="color: #1890ff">删除</a>
              </a-popconfirm>
            </div>
            <div class="list-content" style="margin-left: 0">
              <div class="list-content-item" style="width: 180px">
                <span>创建人</span>
                <p>{{ item._creator }}</p>
              </div>
              <div class="list-content-item" style="width: 160px">
                <span>创建时间</span>
                <p>{{ item._createtime }}</p>
              </div>
            </div>
          </a-list-item>
        </a-list>
        <a-pagination
          size="small"
          style="text-align: right"
          @change="changepage"
          :current="pagination.page"
          :pageSize.sync="pagination.per_page"
          @showSizeChange="changepage"
          :pageSizeOptions="pageSizeOptions"
          :total="data.total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        ></a-pagination>
      </div>
    </a-card>
    <a-modal
      title="增编留言"
      width="60%"
      :visible="channelDialog"
      :confirm-loading="confirmLoading"
      @ok="onSubmit"
      @cancel="
        () => {
          channelDialog = false;
          this.$refs.channelForm.reset();
        }
      "
    >
      <k-form-build :value="channelForm" ref="channelForm" />
    </a-modal>
  </div>
</template>

<script>
import StandardFormRow from "@/components/StandardFormRow";
import { form_get } from "@/services/forms";
import {
  manual_paginate,
  manual_add,
  manual_edit,
  manual_delete,
} from "@/services/repository";

export default {
  components: {
    StandardFormRow,
  },
  data() {
    return {
      keywords: "",
      pageSizeOptions: ["10", "20", "30", "40"],
      total: 0,
      rules: {
        name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
      },
      channelForm: {},
      data: {},
      loading: false, //list表
      searchLoading: false,
      channelDialog: false,
      forms: {},
      confirmLoading: false,
      artsId: "",
      methodes: undefined,
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page ? this.data.page : 1,
          per_page: this.data.per_page ? this.data.per_page : 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
    dynamicData() {
      let result = {
        categorylist: [],
      };
      for (let item in this.Categorys) {
        result.categorylist.push({
          value: this.Categorys[item].id,
          label: this.Categorys[item].title,
        });
      }
      return result;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      form_get({
        name: "edit_messageinfo",
      })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.list();
    },

    // 列表数据获取
    list() {
      this.loading = true;
      manual_paginate(
        Object.assign({ keyword: this.keywords }, this.pagination)
      )
        .then((res) => {
          this.loading = false;
          this.searchLoading = false;
          this.data = res.data.data;
        })
        .catch((err) => {
          this.loading = false;
          this.searchLoading = false;
          console.log(err);
        });
    },
    // 删除
    confirm(item) {
      manual_delete({
        id: item.id,
      })
        .then(() => {
          this.$message.success("操作成功！");
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    look(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "information",
          params: {
            data: item,
            keywords: this.keywords,
            pagination: this.pagination,
          },
        },
      });
    },
    onSearch(value) {
      this.keyword = value;
      this.searchLoading = true;
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.list();
    },
    // 增编
    addChannel(item) {
      this.channelDialog = true;
      if (item) {
        this.artsId = item.id;
        this.methodes = manual_edit;
        this.$nextTick(() => {
          this.$refs.channelForm.setData({
            title: item.title,
            content: item.content,
          });
        });
      } else {
        this.artsId = undefined;
        this.methodes = manual_add;
      }
    },
    onSubmit() {
      this.$refs.channelForm
        .getData()
        .then((data) => {
          this.confirmLoading = true;
          data = Object.assign({}, data, {
            id: this.artsId,
          });
          this.methodes(data)
            .then(() => {
              this.confirmLoading = false;
              this.channelDialog = false;
              this.$refs.channelForm.reset();
              this.list();
            })
            .catch((err) => {
              this.channelDialog = false;
              this.confirmLoading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.list();
    },
    onReset(){
        this.init()
    }
  },
};
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.ant-pro-pages-list-projects-cardList {
  margin-top: 24px;

  /deep/ .ant-card-meta-title {
    margin-bottom: 4px;
  }

  /deep/ .ant-card-meta-description {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
}
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>
