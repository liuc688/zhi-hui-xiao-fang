<template>
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
          <a-descriptions-item label="名称">{{
            currData.title
          }}</a-descriptions-item>

          <a-descriptions-item label="级别">
            <a-tag color="green" v-if="currData.level.name == 'LEVEL_NORMAL'">{{
              currData.level.title
            }}</a-tag>
            <a-tag
              color="blue"
              v-else-if="currData.level.name == 'LEVEL_WARNING'"
              >{{ currData.level.title }}</a-tag
            >
            <a-tag
              color="orange"
              v-else-if="currData.level.name == 'LEVEL_SERIOUS'"
              >{{ currData.level.title }}</a-tag
            >
            <a-tag
              color="red"
              v-else-if="currData.level.name == 'LEVEL_VERY_SERIOUS'"
              >{{ currData.level.title }}</a-tag
            >
          </a-descriptions-item>

          <a-descriptions-item label="行业分类">
            <a-tag
              color="blue"
              v-for="item in currData.organization"
              :key="item._id"
            >
              {{ item.title }}
            </a-tag></a-descriptions-item
          >
          <a-descriptions-item label="涉及部门">
            <a-tag
              color="cyan"
              v-for="item in currData.industrial"
              :key="item._id"
            >
              {{ item.title }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="区划">{{
            currData.division.title
          }}</a-descriptions-item>
          <a-descriptions-item label="信息来源">
            <a :href="currData.url">{{ currData.source }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="创建日期">{{
            currData.release
          }}</a-descriptions-item>
          <a-descriptions-item label="所属标签">
            <a-tag color="purple" v-for="item in currData.tags" :key="item._id">
              {{ item }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="介绍" span="2">{{
            currData.summary
          }}</a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
    <a-divider style="margin-top: 100px" />
    <a-row v-if="self">
      <a-tabs default-active-key="2">
        <a-tab-pane key="1">
          <span slot="tab"> 处置 </span>
          <a-card>
            <a-timeline>
              <template v-for="(item, index) in currData.handles">
                <a-timeline-item color="blue" :key="index">
                  <a-icon
                    slot="dot"
                    type="clock-circle-o"
                    style="font-size: 16px"
                  />
                  <a-card
                    hoverable
                    style="width: 600px"
                    :title="'处置时间：' + item.lasttime"
                  >
                    <p>
                      <a-tag color="cyan"> 处置情况: </a-tag>
                      {{ item.info }}
                    </p>
                    <p>
                      <a-tag color="blue"> 处置评价: </a-tag>
                      {{ item.evaluate }}
                    </p>
                  </a-card>
                </a-timeline-item>
              </template>
            </a-timeline>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab"> 协调 </span>
          <a-card>
            <a-timeline>
              <template v-for="(item, index) in currTask">
                <a-timeline-item color="blue" :key="index">
                  <a-icon
                    slot="dot"
                    type="clock-circle-o"
                    style="font-size: 16px"
                  />

                  <a-card hoverable style="width: 600px">
                    <div slot="title">
                      <span>任务标题 : {{ item.title }}</span>
                      <span style="float: right">{{ item._createtime }}</span>
                    </div>
                    <a-card-meta :title="item.handles.hander.realname">
                      <p slot="description">
                        处置时间 : {{ item.handles.lasttime }}
                      </p>
                      <a-avatar
                        slot="avatar"
                        :src="
                          item.handles.hander.avatar.url
                            ? item.handles.hander.avatar.url
                            : avatar
                        "
                      />
                    </a-card-meta>
                    <p>
                      <a-tag color="cyan"> 处置情况: </a-tag>
                      {{ item.handles.info }}
                    </p>
                    <p>
                      <a-tag color="blue"> 处置评价: </a-tag>
                      {{ item.handles.evaluate }}
                    </p>
                    <div v-if="item.handles.files.length">
                      附件:
                      <p
                        v-for="(temp, index) in item.handles.files"
                        :key="index"
                      >
                        <a :href="temp.url" :download="temp.name">{{
                          temp.name
                        }}</a>
                      </p>
                    </div>
                  </a-card>
                </a-timeline-item>
              </template>
            </a-timeline>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-row>
  </a-card>
</template>
<script>
import { riskinfo_detail } from "@/services/risk";
import { riskinfo_handle_list } from "@/services/task";

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
      self: false,
      currData: {
        images: [],
        level: {},
        division: {},
      },
      currTask: [],
      avatar: require("@/assets/images/avatar.jpeg"),
    };
  },
  computed: {},
  created() {
    if (this.data) {
      this.id = this.data.id;
      this.self = this.data.self;
    } else if (self.params) {
      this.id = self.params.id;
      this.self = this.params.self;
    } else {
      //调试
      if (process.env.NODE_ENV !== "production") {
        this.id = "6120722bb7e003291bcdf6dc";
        this.self = true;
      }
    }
    if (this.id) {
      this.init();
    }
  },
  methods: {
    // 页面内容获取
    init() {
      riskinfo_detail({
        id: this.id,
      })
        .then((response) => {
          this.currData = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
      riskinfo_handle_list({
        parent: this.id,
      })
        .then((response) => {
          this.currTask = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
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
