<template>
  <div style="height: 100%">
    <a-card :bordered="false" style="margin-bottom: 24px">
      <a-row>
        <a-col :span="12">
          <!-- :autoplay="true" effect="fade" -->
          <div v-if="bannerslist.length == 1">
            <img
              :src="bannerslist[0].url"
              @click="toimg(bannerslist[0].url)"
              class="list_img"
            />
          </div>
          <a-carousel v-else arrows dots-class="slick-dots slick-thumb">
            <a slot="customPaging" slot-scope="props">
              <img
                :src="getImgUrl(props.i)"
                @click="changes(props.i)"
                :style="{
                  objectFit: 'cover',
                  filter:
                    props.i == propes ? 'grayscale(0%)' : 'grayscale(100%)',
                }"
              />
            </a>
            <div v-for="(item, index) in bannerslist" :key="index">
              <img :src="item.url" @click="toimg(item.url)" />
            </div>
          </a-carousel>
        </a-col>
        <a-col :span="10">
          <a-descriptions title="模块信息" layout="vertical" :column="2">
            <a-descriptions-item label="名称">{{
              datadetiles.title
            }}</a-descriptions-item>

            <a-descriptions-item label="所属类目">{{
              types
            }}</a-descriptions-item>
            <a-descriptions-item label="创建日期">{{
              datadetiles.release
            }}</a-descriptions-item>
            <a-descriptions-item label="所属标签">{{
              tags
            }}</a-descriptions-item>
            <a-descriptions-item label="评分" span="2">
              <a-rate v-model="datadetiles.rate" allow-half disabled />
            </a-descriptions-item>
            <a-descriptions-item label="介绍" span="2">{{
              datadetiles.introduce
            }}</a-descriptions-item>
          </a-descriptions>
          <a-row style="padding: 60px 20px 0">
            <a-tooltip>
              <template slot="title" v-if="!hasDownload"
                >无权限获取该资源</template
              >
              <a-button
                type="primary"
                :style="{ marginRight: '20px' }"
                :disabled="!hasDownload"
                icon="cloud-download"
                @click="download"
              >
                获取资源
              </a-button>
            </a-tooltip>
            <a-button
              type="primary"
              style="margin-right: 20px"
              v-if="hasInsert"
              icon="edit"
              @click="addChannel"
            >
              详情编辑
            </a-button>
            <a-popconfirm
              title="您确定要删除此条资源吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(item)"
            >
              <a-button type="primary" icon="delete"> 删除 </a-button>
            </a-popconfirm>
          </a-row>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 100px" />
      <a-row>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1">
            <span slot="tab"> 简介 </span>
            <p>{{ datadetiles.mome }}</p>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-card>
    <a-modal
      title="资源下载"
      width="30%"
      :visible="resource_vis"
      :closable="true"
      :footer="false"
      @cancel="
        () => {
          resource_vis = false;
        }
      "
    >
      <a-list
        item-layout="horizontal"
        class="scroll_list"
        :data-source="downloadlist"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a
            target="_blank"
            rel="noopener noreferrer"
            :title="item.name"
            :href="item.url"
            :download="item.name"
            class="
              ant-upload-list-item-name ant-upload-list-item-name-icon-count-1
            "
            >{{ item.name }}</a
          >
        </a-list-item>
      </a-list>
    </a-modal>
    <a-modal
      title="增编渠道"
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
        ref="channelForm"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <a-modal
      :width="800"
      :visible="visibleimg"
      :footer="false"
      @cancel="() => (visibleimg = false)"
    >
      <img style="width: 100%" :src="logo" />
    </a-modal>
  </div>
</template>
<script>
import {
  category_list,
  repository_get,
  download,
  deletes,
  repository_edit,
} from "@/services/repository";

import { form_get } from "@/services/forms";
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
      id: "",
      datadetiles: {}, //详情信息
      categorys: [], //所属类目列表
      crowds: [], //所属标签列表
      types: "", //所属类型
      tags: "", //所属标签
      bannerslist: [], //图片列表
      resource_vis: false, //资源弹窗
      downloadlist: [], //资源列表
      hasDelete: false,
      hasDownload: false,
      hasInsert: false,
      channelForm: {}, //表单
      channelDialog: false, //编辑弹窗
      confirmLoading: false, //编辑提交按钮
      visibleimg: false,
      logo: "",
      propes: 0,
    };
  },
  computed: {
    dynamicData() {
      let result = {
        categorylist: [],
        taglist: [],
      };
      for (let item in this.categorys) {
        result.categorylist.push({
          value: this.categorys[item].id,
          label: this.categorys[item].title,
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
  created() {
    this.id = this.params.data.id;
    this.init();
  },
  methods: {
    changes(i) {
      this.propes = i;
    },
    // 页面内容获取
    init() {
      form_get({
        name: "repositorys",
      })
        .then((response) => {
          this.channelForm = response.data.data.form;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      category_list({
        status: [3, 4],
      }).then((res) => {
        this.categorys = res.data.data[3];
        this.crowds = res.data.data[4];
      });
      repository_get({
        id: this.id,
      })
        .then((res) => {
          this.datadetiles = res.data.data;
          this.types = res.data.data.category.title;
          this.tags = res.data.data.tag.title;
          this.bannerslist = res.data.data.banners;
          this.propes = this.bannerslist.length - 1;
          this.hasDelete = res.data.hasDelete;
          this.hasDownload = res.data.hasDownload;
          this.hasInsert = res.data.hasInsert;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 图片信息转换
    getImgUrl(i) {
      return `${this.bannerslist[i].url}`;
      // return `${require('@/assets/public/0' + (i+1) + '.png')}`;
    },
    // 资源下载获取
    download() {
      this.resource_vis = true;
      download({
        id: this.id,
      })
        .then((res) => {
          this.downloadlist = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //编辑
    addChannel() {
      this.channelDialog = true;
      this.$nextTick(() => {
        this.$refs.channelForm.setData({
          banners: this.datadetiles.banners,
          category: this.datadetiles.category.id,
          introduce: this.datadetiles.introduce,
          mome: this.datadetiles.mome,
          rate: this.datadetiles.rate,
          release: this.datadetiles.release,
          resource: this.datadetiles.resource,
          tag: this.datadetiles.tag.id,
          title: this.datadetiles.title,
        });
      });
    },
    // 提交
    onSubmit() {
      this.$refs.channelForm.getData().then((data) => {
        data = Object.assign({}, data, {
          id: this.id,
        });
        this.confirmLoading = true;
        repository_edit(data)
          .then(() => {
            this.confirmLoading = false;
            this.channelDialog = false;
            this.$refs.channelForm.reset();
            this.$message.success("操作成功！");
            this.init();
          })
          .catch((err) => {
            this.confirmLoading = false;
            console.log(err);
          });
      });
    },
    // 删除
    confirm() {
      deletes({
        id: this.id,
      })
        .then(() => {
          this.$message.success("操作成功！");
          // this.$router.go(-1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toimg(data) {
      this.logo = data;
      this.visibleimg = true;
    },
  },
};
</script>
<style>
.ant-descriptions-item {
  border: none;
}
.ant-descriptions-item-label {
  font-weight: 700;
}
.ant-carousel .slick-slide img {
  width: 100%;
  height: 25vw;
  object-fit: cover;
  -o-object-fit: cover;
  padding: 30px;
}
</style>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.scroll_list {
  min-height: 180px;
}
.list_img {
  width: 80%;
  height: 25vw;
  object-fit: cover;
  -o-object-fit: cover;
  padding: 30px;
  margin: auto 10%;
}
</style>
