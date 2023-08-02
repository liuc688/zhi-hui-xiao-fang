<template>
  <a-card :body-style="{ padding: '24px 5%' }" :bordered="false">
    <div class="title_backs">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="contents">
      <a-descriptions bordered title="产品详情" size="default">
        <a-descriptions-item label="产品名称">
          {{ datas.title }}
        </a-descriptions-item>
        <a-descriptions-item label="产品类型">
          {{ datas.category }}
        </a-descriptions-item>
        <a-descriptions-item label="产品型号">
          {{ datas.model }}
        </a-descriptions-item>
        <a-descriptions-item label="产品规格">
          {{ datas.specs }}
        </a-descriptions-item>
        <a-descriptions-item label="产品单位">
          {{ datas.unit }}
        </a-descriptions-item>
        <a-descriptions-item label="产品库存">
          {{ datas.stock }}
        </a-descriptions-item>
        <a-descriptions-item label="园区价(元)">
          {{ datas.parkprice }}
        </a-descriptions-item>
        <a-descriptions-item label="出厂价(元)">
          {{ datas.factoryprice }}
        </a-descriptions-item>
        <a-descriptions-item label="零售价(元)">
          {{ datas.retailprice }}
        </a-descriptions-item>
        <a-descriptions-item label="产品描述" :span="3">
          {{ datas.content }}
        </a-descriptions-item>
        <a-descriptions-item label="产品图片" :span="3">
          <img
            class="imgs_datas"
            v-for="(items, index) in datas.imgs"
            :key="index"
            @click="previews(datas.imgs, index)"
            :src="items.url"
            alt=""
          />
        </a-descriptions-item>
        <a-descriptions-item label="产品视频" :span="3">
          <video
            controls
            class="veido_datas"
            v-for="(items, index) in datas.videos"
            :key="index"
            @click="handleFullScreen"
            :src="items.url"
          ></video>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <pic-preview
      :file-preview-show="previewShow"
      :img-list="preImages"
      :current-img="currentImg"
      @close="() => (previewShow = false)"
    ></pic-preview>
  </a-card>
</template>
<script>
import PicPreview from "@/components/PicPreview";
import { product_get } from "@/services/infofilling";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    onOpen: {
      type: Function,
    },
  },
  components: {
    PicPreview,
  },
  data() {
    return {
      datas: {},
      previewShow: false,
      preImages: [],
      currentImg: "",
    };
  },
  created() {
    console.log("params", this.params);
    this.id = this.params.ids;
    this.init();
  },
  methods: {
    init() {
      product_get({ id: this.id })
        .then((res) => {
          console.log("res", res);
          this.datas = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 图片
    previews(record, index) {
      this.preImages = record.map((item) => item.url);
      this.currentImg = record[index].url;
      this.previewShow = true;
    },
    // 视频播放全屏
    handleFullScreen(e) {
      this.launchFullscreen(e.target);
    },
    // 进入全屏
    launchFullscreen(element) {
      //此方法不可以在異步任務中執行，否則火狐無法全屏
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.oRequestFullscreen) {
        element.oRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
      } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = element;
        var cssText = "width:100%;height:100%;overflow:hidden;";
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText + ";" + "margin:0px;padding:0px;";
        document.IsFullScreen = true;
      }
    },
    // 视频播放完毕退出全屏
    handleExitFullScreen(e) {
      this.exitFullscreen(e.target);
    },
    // 退出全屏
    exitFullscreen(element) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = element;
        docHtml.style.cssText = "";
        docBody.style.cssText = "";
        videobox.style.cssText = "";
        document.IsFullScreen = false;
      }
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "product",
          params: {
            searchform: this.params.searchform,
          },
        },
      });
    },
  },
};
</script>
<style scoped>
.title_backs {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.contents {
  padding: 10px;
  /* background: #daedff; */
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 60px;
}
.imgs_datas {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.veido_datas {
  width: 200px;
  height: 160px;
  margin: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  background: #d9d9d9;
}
</style>