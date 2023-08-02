<template>
  <div style="padding: 0 12px">
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-row :gutter="24">
        <a-col :span="8">
          <standard-form-row title="关键字检索" grid last>
            <a-input-search
              placeholder="请输入关键字"
              :loading="searchLoading"
              enterButton
              allow-clear
              @search="onSearch"
            />
          </standard-form-row>
        </a-col>
        <a-col :span="16" style="text-align: end">
          <a-space>
            <a-button
            type="primary"
            @click="onSee()"
            style="margin-bottom: 20px"
            >
             <a-icon type="form" />
            考试管理
            </a-button>

            <a-button
              type="primary"
              @click="addbase()"
              style="margin-bottom: 20px"
            >
              <a-icon type="plus" />
              知识库新增
            </a-button>

          </a-space>
        </a-col>
      </a-row>
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
              :src="item.images.length ? item.images[0].url : './backiee-209268.jpg'"
              style="height: 240px; cursor: pointer; object-fit: cover"
              @click="todetailes(item)"
            />

            <a-card-meta>
              <span slot="title" @click="todetailes(item)">
                <div style="font-size: 14px">
                  {{ item.title }}
                  <!-- {{item.images[0]}} -->
                  <br />
                  创建时间:
                  {{ item._createtime }}
                </div>
              </span>
            </a-card-meta>
            <template slot="actions" class="ant-card-actions">
              <a-icon key="edit" type="edit" @click="edit(item)" />
              <a-icon key="delete" type="delete" @click="deleted(item)" />
            </template>
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
      title="分库新增"
      :visible="visible"
      :width="900"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="channelForm" ref="channelForm" :config="config" />
    </a-modal>
  </div>
</template>

<script>
import { form_get } from "@/services/forms";
import StandardFormRow from "@/components/StandardFormRow";
import {
  bases_add,
  bases_delete,
  bases_edit,
  bases_paginate,
} from "@/services/knowledge";
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
      loading: false,
      visible: false,
      id: "",
      img_path:'./backiee-209268.jpg',
    };
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
  },
  mounted() {
    this.forms = this.params.forms || this.forms;
    this.init();
  },
  methods: {
    init() {
      form_get({ name: "base_increase" })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.channelForm.per_page = 12;
      this.list();
    },
    // 列表数据获取
    list() {
      this.loading = true;
      bases_paginate()
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
    onSearch(value) {
      this.channelForm.keyword = value;
      this.searchLoading = true;
      this.loading = true;
      this.channelForm.page = 1;
      this.channelForm.per_page = 12;
      this.current = 1;
      this.list();
    },
    // 新增分库
    addbase() {
      (this.visible = true),
        this.$nextTick(() => {
          this.mothed = bases_add;
          this.id = undefined;
        });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.channelForm.reset();
    },
    handleOk() {
      this.$refs.channelForm.getData().then((data) => {
        console.log(data);
        this.mothed(Object.assign(data, { id: this.id })).then((res) => {
          this.visible = false;
          this.$refs.channelForm.reset();
          this.list();
        });
      });
    },

    edit(item) {
      this.visible = true;
      this.id = item.id;
      this.$nextTick(() => {
        this.mothed = bases_edit;
        this.$refs.channelForm.setData({
          images:item.images,
          title: item.title,
          name: item.name,
          synopsis: item.synopsis,
          abstrac: item.abstrac,
        });
      });
    },

    deleted(item) {
      var that = this;
      this.$confirm({
        title: "您确定要删除此知识库吗?",
        icon: "info-circle",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          var parems = {
            id: item.id,
          };
          bases_delete(parems)
            .then(() => {
              that.$message.success("操作成功！");
              that.list();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {},
      });
    },
    // 分页
    changepage(page, pageSize) {
      this.forms.page = page;
      this.forms.per_page = pageSize;
      this.list();
    },
    // 详情
    todetailes(item) {
      console.log('明天会更好',item);

      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: {
            data: item,
            channelForm: Object.assign(this.channelForm),
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
    onSee(){
      // console.log('helloworld');
      this.$emit("event", {
        method: "onOpen",
        params: {
          name: "Examing",
          height: "80%",
          width: "80%",
          title: "考试管理",
          type: "system",
          router: "Examing",
          
        },
      });
    }
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
img {
  transition: all 0.5s;
  -webkit-transition: all 0.5s; //-webkit-是谷歌浏览器厂商的前缀
  -o-transition: all 0.5s; //-o-是opera浏览器厂商的前缀
  cursor: pointer;
}
img:hover {
  transform: scale(1.1);
}


</style>

<style>
span .ant-radio + * {
    padding-right: 7px !important;
}

</style>


