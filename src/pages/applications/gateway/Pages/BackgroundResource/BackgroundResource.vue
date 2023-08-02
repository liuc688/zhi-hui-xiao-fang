<template>
  <div>
    <!-- 壁纸列表 -->
    <a-list
      :grid="{ gutter: 24, xl: 6, lg: 3, md: 3, sm: 2, xs: 1 }"
      style="margin: 0 -8px"
    >
      <a-list-item :key="index" style="padding: 0 8px">
        <a-card :key="index" style="text-align: center">
          <a-upload
            slot="cover"
            accept="image/*"
            :action="action"
            multiple
            @change="uploadChange"
            :headers="headers"
            v-auth="`background.upload`"
            v-if="$auth('background.upload')"
          >
            <div style="height: 154px">
              <a>
                <a-icon
                  type="plus"
                  style="font-size: 110px; padding: 20px; color: #cbcbcb"
                />
              </a>
            </div>
          </a-upload>
          <template slot="actions" class="ant-card-actions">
            <span slot="count">背景上传</span>
          </template>
        </a-card>
      </a-list-item>
      <template v-for="(item, index) of records">
        <a-list-item :key="index" style="padding: 0 8px">
          <a-card :key="index">
            <img
              slot="cover"
              :src="item.url"
              height="154"
              style="cursor: pointer"
              @click="onClick(index)"
       
            />
            <template slot="actions" class="ant-card-actions">
              <a-popconfirm
                slot="count"
                title="确定要删除此背景吗!"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onDelete(item)"
              >
                <a-icon key="delete" type="delete" />
              </a-popconfirm>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <PicPreview
      :file-preview-show="previewShow"
      :img-list="preImages"
      :currentIndex="currentIndex"
      @close="() => (previewShow = false)"
    ></PicPreview>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import { background_list, background_delete } from "@/services/background";
import PicPreview from "@/components/PicPreview";
import { BACKGROUND_UPLOAD } from "@/services/api";
export default {
  components: {
    PicPreview,
  },
  props: {
    id: {
      type: String,
    },
    data: {
      //传递的数据
      type: Object,
      default: () => {
        return {};
      },
    },
    refresh: {
      type: Function,
      default: () => {
        console.log("refresh");
      },
    },
  },
  computed: {
    preImages() {
      return this.records.map((item) => item.url);
    },
    headers() {
      return {
        Authorization: Cookie.get("Authorization"),
      };
    },
  },
  data() {
    return {
      action: BACKGROUND_UPLOAD,
      previewShow: false,
      records: [],
      currentIndex: 0,
    };
  },

  authorize: {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      background_list()
        .then((response) => {
          this.records = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    uploadChange(fileinfo) {
      if (fileinfo.file.status == "done") {
        if (fileinfo.file.response.status) {
          this.$message.success(fileinfo.file.response.message);
        } else {
          this.$message.error(fileinfo.file.response.message);
        }
        this.onLoad();
      }
    },
    onClick(index) {
      this.currentIndex = index;
      this.previewShow = true;
    },
    onDelete(record) {
      const ids = [record.id];
      background_delete({
        ids: ids,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
        })
        .catch((error) => {
          this.$message.error(error);

          console.log("error", error);
        });
    },
  },
};
</script>


<style scoped>
.upload {
  text-align: center;
}
</style>
