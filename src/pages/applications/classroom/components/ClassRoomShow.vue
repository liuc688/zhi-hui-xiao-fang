<template>
  <a-card>
    <a-page-header @back="onBack">
      <span slot="title">
        <a @click="onBack" style="color: #000000">返回</a>
      </span>
    </a-page-header>
    <a-card :bordered="false" style="margin-bottom: 24px">
      <a-row>
        <a-col :span="12">
          <div v-if="currData.images.length == 1">
            <img
              :src="currData.images[0].url"
              @click="toimg(currData.images[0].url)"
              class="list_img"
            />
          </div>
          <a-carousel v-else arrows dots-class="slick-dots slick-thumb">
            <div v-for="(item, index) in currData.images" :key="index">
              <img :src="item.url" @click="toimg(item.url)" />
            </div>
            <a slot="customPaging" slot-scope="props">
              <img :src="getImgUrl(props.i)" />
            </a>
          </a-carousel>
        </a-col>
        <a-col :span="12">
          <a-descriptions title="详细信息" layout="vertical" :column="2">
            <a-descriptions-item label="标题">
              {{ currData.title }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag
                color="cyan"
                :key="index"
                v-for="(item, index) in currData.tags"
                >{{ item }}</a-tag
              >
            </a-descriptions-item>
            <a-descriptions-item label="行业分类">
              <a-tag
                color="blue"
                :key="item.id"
                v-for="item in currData.organization"
                >{{ item.title }}</a-tag
              >
            </a-descriptions-item>
            <a-descriptions-item label="摘要">
              {{ currData.summary }}
            </a-descriptions-item>
            <a-descriptions-item label="评分">
              <a-rate v-model="currData.grade" disabled allow-half />
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
      <a-divider />

      <a-divider />
      <a-row>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1">
            <span slot="tab"> 课件内容 </span>
            <div v-html="currData.content"></div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab"> 课件评价 </span>
            <a-card>
              <a-card-grid
                style="width: 100%"
                :key="index"
                v-for="(item, index) in currGrade"
              >
                <a-comment>
                  <a slot="author">{{ item.user.realname }}</a>
                  <a-avatar
                    slot="avatar"
                    :src="item.user.avatar.url || avatar"
                    :alt="item.user.username"
                  />
                  <p slot="content">
                    {{ item.comment }}
                  </p>
                  <span>{{ item.lasttime }}</span>
                  <p>
                    <a-rate v-model="item.grade" disabled allow-half />
                  </p>
                </a-comment>
              </a-card-grid>
            </a-card>
            <a-comment>
              <a-avatar
                slot="avatar"
                :src="userinfo.avatar.url || avatar"
                :alt="userinfo.realname"
              />
              <div slot="content">
                <a-form-item>
                  <a-textarea :rows="4" v-model="comment" />
                </a-form-item>
                <a-form-item>
                  <a-rate v-model="grade" :default-value="5" allow-half />
                </a-form-item>
                <a-form-item>
                  <a-button
                    html-type="submit"
                    :loading="loading"
                    type="primary"
                    @click="onCommit"
                  >
                    发布提交
                  </a-button>
                </a-form-item>
              </div>
            </a-comment>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-card>
  </a-card>
</template>
<script>
import {
  classroom_get,
  classroom_get_grade,
  classroom_grade,
} from "@/services/classroom";

export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    data: {
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      id: null,
      loading: false,
      self: false,
      currData: {
        images: [],
      },
      currGrade: [],
      comment: null,
      grade: 0,
      avatar: require("@/assets/images/avatar.jpeg"),
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 页面内容获取

    init() {
      this.grade = 0;
      this.comment = null;
      Promise.all([
        classroom_get({
          id: this.params.id,
        }),
        classroom_get_grade({
          id: this.params.id,
        }),
      ])
        .then((response) => {
          this.currData = response[0].data.data;
          this.currGrade = response[1].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onCommit() {
      this.loading = true;
      classroom_grade({
        id: this.params.id,
        grade: this.grade,
        comment: this.comment,
      })
        .then((response) => {
          this.init();
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    // 图片信息转换
    getImgUrl(i) {
      return `${this.currData.images[i].url}`;
    },

    toimg(data) {
      this.logo = data;
      this.visibleimg = true;
    },
    onBack() {
      this.$emit("event", {
        method: "onBack",
      });
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
