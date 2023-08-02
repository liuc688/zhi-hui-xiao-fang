<template>
  <div style="padding: 0 12px">
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" layout="inline">
        <standard-form-row title="所属类目" block style="line-height: 40px">
          <a-form-item>
            <template v-for="tag in Categorys">
              <a-checkable-tag
                :key="tag.id"
                style="font-size: 14px"
                :checked="selectCategory.indexOf(tag) > -1"
                @change="(checked) => CategorysChanges(tag, checked)"
              >
                {{ tag.title }}
              </a-checkable-tag>
            </template>
          </a-form-item>
        </standard-form-row>
        <standard-form-row title="所属标签" block style="line-height: 40px">
          <a-form-item>
            <template v-for="tag in crowds">
              <a-checkable-tag
                :key="tag.id"
                style="font-size: 14px"
                :checked="selectcrowd.indexOf(tag) > -1"
                @change="(checked) => crowdsChanges(tag, checked)"
              >
                {{ tag.title }}
              </a-checkable-tag>
            </template>
          </a-form-item>
        </standard-form-row>
        <a-row>
          <a-col :span="18">
            <standard-form-row title="关键字检索" grid last>
              <a-row>
                <a-col :lg="8" :md="10" :sm="10" :xs="24"
                  ><a-input-search
                    placeholder="请输入关键字"
                    :loading="searchLoading"
                    enterButton
                    allow-clear
                    @search="onSearch"
                /></a-col>
              </a-row>
            </standard-form-row>
          </a-col>
          <a-col :span="6">
            <a-button
              type="primary"
              @click="addChannel()"
              style="margin-bottom: 20px; float: right"
            >
              <a-icon type="plus" />
              新增
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <div class="ant-pro-pages-list-projects-cardList">
      <a-list
        :loading="loading"
        :data-source="data.items"
        :grid="{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card style="width: 100%; background: #f5f5f5">
            <img
              slot="cover"
              alt="example"
              style="height: 240px; cursor: pointer; object-fit: cover"
              :src="item.banners[0].url"
              @click="todetailes(item)"
            />
            <a-card-meta>
              <span slot="title">
                {{ item.title }}
              </span>
              <span slot="description">
                <a-popover v-if="item.introduce.length > 25">
                  <template slot="content">
                    <p style="width: 420px">{{ item.introduce }}</p>
                  </template>
                  <span> {{ item.introduce.substring(0, 25) }}...</span>
                </a-popover>
                <span v-else> {{ item.introduce }}</span>
              </span>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </a-list>
      <a-pagination
        size="small"
        style="text-align: right; padding: 10px"
        @change="changepage"
        :current="pagination.page"
        :pageSize.sync="pagination.per_page"
        @showSizeChange="changepage"
        :defaultPageSize="12"
        :pageSizeOptions="pageSizeOptions"
        :total="data.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <a-modal
      title="增编资源"
      width="60%"
      :visible="channelDialog"
      :confirm-loading="confirmLoading"
      @ok="onSubmit"
      @cancel="
        () => {
          channelDialog = false;
          $refs.channelForm.reset();
        }
      "
    >
      <k-form-build
        :value="channelForm"
        :defaultValue="channelData"
        ref="channelForm"
        :dynamicData="dynamicData"
        :config="config"
      />
    </a-modal>
  </div>
</template>

<script>
import { form_get } from "@/services/forms";
import {
  category_list,
  repository_paginate,
  repository_add,
} from "@/services/repository";
import StandardFormRow from "@/components/StandardFormRow";
import Cookie from "js-cookie";

export default {
  components: {
    StandardFormRow,
  },
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
      current: 1,
      pageSizeOptions: ["12", "16", "24"],
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      rules: {
        name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
      },
      channelForm: {},
      channelData: {},
      data: {},
      form: this.$form.createForm(this),
      loading: true,
      searchLoading: false,
      channelDialog: false,
      selectedTags: [],
      Categorys: [], //所属类目列表
      selectCategory: [],
      crowds: [], //所属人群列表
      selectcrowd: [],
      forms: {
        category: [],
        tag: [],
        per_page: 12,
        page: 1,
      },
      labelform: {},
      confirmLoading: false,
      hasInsert: true,
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page ? this.data.page : 1,
          per_page: this.data.per_page ? this.data.per_page : 12,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
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
    dynamicData() {
      let result = {
        types: [
          { label: "网络渠道", value: "1" },
          { label: "社会渠道", value: "2" },
          { label: "生活渠道", value: "3" },
          { label: "社交渠道", value: "4" },
        ],
        categorylist: [],
        taglist: [],
      };
      for (let item in this.Categorys) {
        result.categorylist.push({
          value: this.Categorys[item].id,
          label: this.Categorys[item].title,
        });
      }
      for (let item in this.crowds) {
        result.taglist.push({
          value: this.crowds[item].id,
          label: this.crowds[item].title,
        });
      }
      return result;
    },
  },
  mounted() {
    // this.forms= this.params.forms || this.forms
    this.init();
  },
  methods: {
    //所属类目列表
    CategorysChanges(tag, checked) {
      this.loading = true;
      const { selectCategory } = this;
      const nextSelectedTags = checked
        ? [...selectCategory, tag]
        : selectCategory.filter((t) => t !== tag);
      var list = [];
      for (let ind in nextSelectedTags) {
        list.push(nextSelectedTags[ind].id);
      }
      this.forms.category = list;
      this.forms.page = 1;
      this.current = 1;
      this.list();
      this.selectCategory = nextSelectedTags;
    },
    //所属标签列表
    crowdsChanges(tag, checked) {
      this.loading = true;
      const { selectcrowd } = this;
      const nextSelectedTags = checked
        ? [...selectcrowd, tag]
        : selectcrowd.filter((t) => t !== tag);
      var list = [];
      for (let ind in nextSelectedTags) {
        list.push(nextSelectedTags[ind].id);
      }
      this.forms.tag = list;
      this.forms.page = 1;
      this.current = 1;
      this.list();
      this.selectcrowd = nextSelectedTags;
    },
    init() {
      form_get({ name: "repositorys" })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      category_list({
        status: [3, 4],
      }).then((res) => {
        this.Categorys = res.data.data[3];
        this.crowds = res.data.data[4];
      });
      this.forms.per_page = 12;
      this.list();
    },
    // 列表数据获取
    list() {
      this.loading = true;
      repository_paginate(this.forms)
        .then((res) => {
          this.loading = false;
          this.searchLoading = false;
          this.data = res.data.data;
          this.hasInsert = res.data.hasInsert;
        })
        .catch((err) => {
          this.loading = false;
          this.searchLoading = false;
          console.log(err);
        });
    },
    onSearch(value) {
      this.forms.keyword = value;
      this.searchLoading = true;
      this.loading = true;
      this.forms.page = 1;
      this.forms.per_page = 12;
      this.current = 1;
      this.list();
    },
    // 增编
    addChannel(item) {
      this.channelDialog = true;
      if (item) {
        this.labelId = item.id;
        this.$nextTick(() => {
          this.$refs.channelForm.setData({
            banners: item.banners,
            category: item.category,
            introduce: item.introduce,
            mome: item.mome,
            rate: item.rate,
            release: item.release,
            resource: item.resource,
            tag: item.tag,
            title: item.title,
          });
        });
      } else {
        this.labelId = undefined;
        this.labelform = {};
      }
    },
    onSubmit() {
      this.$refs.channelForm.getData().then((data) => {
        data = Object.assign({}, data, {
          id: this.labelId,
        });
        this.confirmLoading = true;
        repository_add(data)
          .then(() => {
            this.channelDialog = false;
            this.confirmLoading = false;
            this.$refs.channelForm.reset();
            this.$message.success("操作成功！");
            this.list();
          })
          .catch((err) => {
            this.confirmLoading = false;
            console.log(err);
          });
      });
    },
    // 分页
    changepage(page, pageSize) {
      this.forms.page = page;
      this.forms.per_page = pageSize;
      this.list();
    },
    // 查看详情
    todetailes(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: {
            data: item,
            forms: Object.assign(this.forms),
            pagination: this.pagination,
          },
        },
      });
    },
    // 刷新
    onReset() {
      this.loading = true;
      this.forms.tag = [];
      this.forms.category = [];
      this.forms.per_page = 12;
      this.forms.page = 1;
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 12px;
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
    overflow: auto;
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
