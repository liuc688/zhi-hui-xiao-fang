<template>
  <a-layout class="route-layout">
    <a-spin :spinning="loading">
      <a-layout-content
        class="conter"
        :style="{
          margin: '10px 10px',
          padding: '10px',
          background: '#fff',
          overflowY: 'scroll',
          height: '100%',
          position: 'relative',
        }"
      >
        <a-layout>
          <a-layout-sider>
            <a-tag color="blue" style="white-space: pre-wrap;">当前模版 : {{ title }}</a-tag>
            <a-divider style="margin:12px 0"/>
            <div
              style="height:600px;overflow-y:auto;background: #f7f7f7"
              @contextmenu.prevent="onNullRightClick"
            >
              <a-directory-tree
                :tree-data="treeDatas"
                default-expand-all
                :selectedKeys.sync="currSelect"
                :replaceFields="{
                  key: 'id',
                  title: 'name',
                }"
                @select="onSelect"
                @rightClick="onRightClick"
              ></a-directory-tree>
            </div>
          </a-layout-sider>
          <a-layout-content style="padding: 5px; 5px">
            <div style="width: 100%; padding: 5px 20px;">
              <a-space>
                <a-button icon="redo" @click="onRefresh">刷新</a-button>
                <!-- <a-button icon="redo" @click="onBeautify">美化代码</a-button> -->
                <a-dropdown-button>
                  主题 : {{ codeTheme }}
                  <a-menu slot="overlay" @click="onSetTheme">
                    <a-menu-item key="monokai">monokai</a-menu-item>
                    <a-menu-item key="dracula">dracula</a-menu-item>
                    <a-menu-item key="dawn">dawn</a-menu-item>
                    <a-menu-item key="eclipse">eclipse</a-menu-item>
                    <a-menu-item key="github">github</a-menu-item>
                    <a-menu-item key="gob">gob</a-menu-item>
                    <a-menu-item key="tomorrow">tomorrow</a-menu-item>
                    <a-menu-item key="twilight">twilight</a-menu-item>
                  </a-menu>
                </a-dropdown-button>
                <a-button
                  @click="onSave(null, editorContent)"
                  icon="upload"
                  :loading="loading"
                  >保存提交</a-button
                >
                <a-tag
                  :color="number ? 'gray' : 'blue'"
                  v-if="file.type && !file.dir && mode == 'code'"
                >
                  <template v-if="number">
                    <a-icon type="loading" />
                    {{ number }} 秒后可保存
                  </template>
                  <template v-if="!number">
                    <a-icon type="save" />
                    组合键 Ctrl + S 进行文件保存操作
                  </template>
                </a-tag>
              </a-space>
            </div>
            <page-toggle-transition
              :disabled="animate.disabled"
              :animate="animate.name"
              :direction="animate.direction"
            >
              <core-edior
                ref="coreEdior"
                v-if="editorContent != null && mode == 'code'"
                :value.sync="editorContent"
                :language.sync="language"
                :theme="codeTheme"
                :readonly.sync="readonly"
                @save="onSave"
              ></core-edior>
              <div v-else-if="mode == 'image'">
                <img alt="example" :src="model_url" style="max-width: 100%" />
              </div>
              <div v-else>暂不支持此文件格式展示</div>
            </page-toggle-transition>
          </a-layout-content>
          <a-layout-sider>
            <a-tag color="blue">时间线 : {{ file.name }}</a-tag>
            <a-divider />
            <div style="height:600px;overflow-y:auto;">
              <a-timeline v-if="filetimeline.length">
                <a-timeline-item v-for="item in filetimeline" :key="item.id">
                  <a-icon
                    slot="dot"
                    type="clock-circle-o"
                    style="font-size: 12px;"
                  />
                  <a @click="onTimeLineItem(item)">
                    <div>
                      <a-tag>
                        {{ item.lasttime }}
                      </a-tag>
                    </div>
                    <div>操作者:{{ item.modifier.realname }}</div>
                    <div>
                      {{ item.note }}
                    </div>
                  </a>
                </a-timeline-item>
              </a-timeline>
            </div>
          </a-layout-sider>
        </a-layout>
        <a-modal
          :title="nameTitle"
          :closable="false"
          :visible="setNameVisible"
          :confirm-loading="loading"
          @ok="setNameOk"
          @cancel="
            () => {
              setNameVisible = !setNameVisible;
              setname = null;
            }
          "
        >
          <a-input
            v-model="setname"
            @pressEnter="setNameOk"
            ref="filename"
          ></a-input>
        </a-modal>
        <a-modal
          title="文件上传"
          :closable="false"
          :visible="uploadVisible"
          :confirm-loading="loading"
          @ok="uploadOk"
          @cancel="
            () => {
              uploadVisible = !uploadVisible;
              upload = [];
              fileList = [];
            }
          "
        >
          <a-upload-dragger
            name="file"
            :multiple="true"
            :directory="uploadDirectory"
            action="/api/file/upload"
            :fileList="fileList"
            :data="{
              id: this.upload_parent,
            }"
            :headers="headers"
            @change="uploadChange"
          >
            <p class="ant-upload-drag-icon"><a-icon type="inbox" /></p>
            <p class="ant-upload-text">单击或拖动文件到该区域进行上传</p>
            <p class="ant-upload-hint">支持单个或批量上传。</p>
          </a-upload-dragger>
        </a-modal>
      </a-layout-content>
    </a-spin>
  </a-layout>
</template>

<script>
import { template_dir } from "@/services/templates";
import {
  file_body,
  file_content,
  file_create_file,
  file_create_dir,
  file_rename,
  file_remove,
  file_timeline,
} from "@/services/files";
import { mapState } from "vuex";
import { Base64 } from "js-base64";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import CoreEdior from "@/components/CoreEdior/index.vue";
import Cookie from "js-cookie";
export default {
  name: "template-folder",
  components: {
    PageToggleTransition,
    CoreEdior,
  },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    forms: {
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      id: undefined,
      title: undefined,
      loading: false,
      number: 0,
      step: 3,
      nameTitle: null,
      setname: null,
      setNameVisible: false,
      uploadVisible: false,
      uploadDirectory: false,
      editorContent: null,
      treeData: [],
      expandedKeys: [],
      currSelect: [],
      selectedRows: [],
      fileList: [],
      file: {},
      upload: [],
      parent: null,
      upload_parent: null,
      language: "text",
      mode: "code",
      readonly: true,
      model_url: null,
      setInter: null,
      fileMethod: null,
      codeTheme: "monokai",
      note: null,
      filetimeline: [],
    };
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    headers() {
      return {
        Authorization: Cookie.get("Authorization"),
      };
    },
    treeDatas() {
      var f = function(treeData) {
        treeData.forEach((item) => {
          item.isLeaf = !item.dir;
          if (item.children.length) {
            f(item.children);
          }
        });
      };
      f(this.treeData);
      return this.treeData;
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.id = this.params ? this.params.id : undefined;
      this.title = this.params ? this.params.title : undefined;
      this.editorContent = null;
      this.record = null;
      this.expandedKeys = [];
      Promise.all([
        template_dir({
          id: this.id,
        }),
      ])
        .then((response) => {
          const { data, parent } = response[0].data;
          this.treeData = data;
          this.parent = parent.id;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    onRefresh() {
      this.onLoad();
    },
    onBeautify() {
      if (this.$refs.coreEdior) {
        this.$refs.coreEdior.onBeautify();
      }
    },
    onSetTheme(e) {
      this.codeTheme = e.key;
    },
    onSave(editor, content) {
      editor = editor || this.$refs.coreEdior.editor;

      let note = null;
      const that = this;
      const node = (
        <div>
          <div>
            <a-textarea placeholder="请输入更新描述" v-model={note} />
          </div>
        </div>
      );
      if (!this.number) {
        this.$confirm({
          title: "请填写模板更新描述!",
          content: node,
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            that.onOk(content, note);
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      }
    },
    onOk(content, note) {
      const that = this;
      that.lockSave();
      const saveData = {
        id: that.file.id,
        template: that.id,
        content: content,
        note: note,
      };
      file_content(saveData)
        .then((response) => {
          const { status } = response.data;
          if (status) {
            that.$message.success("保存成功");
          } else {
            that.$message.error("保存失败");
          }
        })
        .catch((error) => {
          that.$message.error("保存失败", error);
        });
    },
    lockSave() {
      //锁死保存方法
      this.loading = true;
      this.number = this.step;
      clearInterval(this.setInter);
      this.setInter = setInterval(() => {
        this.countdown();
      }, 1000);
    },
    countdown() {
      if (this.number) {
        this.number--;
      } else {
        clearInterval(this.setInter);
        this.loading = false;
      }
    },
    uploadOk() {
      this.fileList = [];
      this.uploadVisible = false;
    },
    popUpload(parent) {
      this.upload_parent = parent || this.parent;
      this.uploadVisible = true;
    },
    uploadChange({ file, fileList }) {
      this.fileList = fileList;
      if (file.status == "done") {
        //上传完成
        this.onRefresh();
      }
    },
    onNullRightClick(event) {
      event.stopPropagation();
      this.file = {};
      this.$contextmenu({
        items: [
          {
            label: "创建",
            children: [
              {
                label: "文件",
                onClick: () => {
                  this.nameTitle = "创建文件";
                  this.setname = null;
                  this.fileMethod = file_create_file;
                  this.setNameVisible = true;
                  this.$nextTick(() => {
                    this.$refs.filename.focus();
                  });
                },
              },
              {
                label: "文件夹",
                onClick: () => {
                  this.nameTitle = "创建文件夹";
                  this.setname = null;
                  this.fileMethod = file_create_dir;
                  this.setNameVisible = true;
                  this.$nextTick(() => {
                    this.$refs.filename.focus();
                  });
                },
              },
            ],
          },
          {
            label: "上传文件",
            onClick: () => {
              this.uploadDirectory = false;
              this.popUpload();
            },
          },
          // {
          //   label: "批量上传",
          //   onClick: () => {
          //     this.uploadDirectory = true;
          //     this.popUpload();
          //   },
          // },
          {
            label: "刷新",
            onClick: () => {
              template_dir({
                id: this.id,
              }).then((res) => {
                this.treeData = res.data.data;
              });
            },
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 2000,
        minWidth: 230,
      });
    },
    onRightClick({ event, node }) {
      event.stopPropagation();
      let record = node.$options.propsData.dataRef;
      this.currSelect = [record.id];
      this.file = record;
      this.popEditor(record);

      let option = {
        items: [
          {
            label: "刷新",
            onClick: () => {
              template_dir({
                id: this.id,
              }).then((res) => {
                this.treeData = res.data.data;
              });
            },
          },
          {
            label: "重命名",
            onClick: () => {
              this.file = record;
              this.setname = record.name;
              this.fileMethod = file_rename;
              this.setNameVisible = true;
              this.$nextTick(() => {
                this.$refs.filename.focus();
              });
            },
          },
          {
            label: "删除",
            disabled: record.children.length,
            icon: "redo",
            onClick: () => {
              const that = this;
              this.$confirm({
                title: `确定要删除此${record.dir ? "文件夹" : "文件"}吗?`,
                content: "该操作不可逆,请谨慎使用!",
                okText: "确定",
                okType: "danger",
                cancelText: "取消",
                onOk() {
                  file_remove({
                    id: record.id,
                    template: that.id,
                  })
                    .then(() => {
                      that.onRefresh();
                      this.$message.success("删除成功!");
                    })
                    .catch((error) => {
                      console.log("error", error);
                      this.$message.error("删除失败!");
                    });
                },
                onCancel() {},
              });
            },
          },
        ],
        event,
        customClass: "class-a",
        zIndex: 2000,
        minWidth: 230,
      };
      if (record.dir) {
        option.items.push({
          label: "创建",
          children: [
            {
              label: "文件",
              onClick: () => {
                console.log("创建文件");
                this.nameTitle = "创建文件";
                this.setname = null;
                this.fileMethod = file_create_file;
                this.setNameVisible = true;
              },
            },
            {
              label: "文件夹",
              onClick: () => {
                console.log("文件夹");
                this.nameTitle = "创建文件夹";
                this.setname = null;
                this.fileMethod = file_create_dir;
                this.setNameVisible = true;
              },
            },
          ],
        });
        option.items.push({
          label: "上传文件",
          onClick: () => {
            console.log("上传文件");
            this.uploadDirectory = false;
            this.popUpload(record.id);
          },
        });
        // option.items.push({
        //   label: "批量上传",
        //   onClick: () => {
        //     this.uploadDirectory = true;
        //     this.popUpload();
        //   },
        // });
      } else {
        option.items.push({
          label: "下载文件",
          disabled: true,
          onClick: () => {
            console.log("下载文件");
          },
        });
      }
      this.$contextmenu(option);
    },
    setNameOk() {
      this.loading = true;
      const formData = {
        parent: this.file.id || this.parent,
        filename: this.setname,
        template: this.id,
      };
      this.fileMethod(formData)
        .then((response) => {
          const { status } = response.data;
          if (status) {
            this.$message.success("创建成功");
          } else {
            this.$message.error("创建失败");
          }
          this.onRefresh();
          this.setNameVisible = false;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("创建失败");
          this.onRefresh();
          this.setNameVisible = false;
          this.loading = false;
        });
    },
    onClick(record) {
      console.log('record',record);
    },
    onSelect(selectedKeys, e) {
      var record = e.node.$options.propsData.dataRef;
      this.editorContent = null;
      this.file = record;

      this.popEditor(record);
      file_timeline({
        id: record.id,
      })
        .then((response) => {
          this.filetimeline = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onTimeLineItem(record) {
      this.editorContent = null;
      this.file = record;
      file_body({
        id: record.parent,
        filebody: record.filebody,
      })
        .then((response) => {
          const record = response.data.data;
          const body = Base64.decode(record.body);
          this.file = record;
          this.aceEditOption(record);
          this.editorContent = body;
          this.loading = false;
          this.onReadonly(true);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    onReadonly(readOnly) {
      this.$nextTick(() => {
        this.$refs.coreEdior.editor.$readOnly = readOnly;
      });
    },
    popEditor(record) {
      this.loading = true;
      if (!record.dir) {
        file_body({
          id: record.id,
        })
          .then((response) => {
            const record = response.data.data;
            const body = Base64.decode(record.body);
            this.file = record;
            this.aceEditOption(record);
            this.editorContent = body;
            this.onReadonly(false);
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.editorContent = null;
        this.loading = false;
      }
    },
    aceEditOption(record) {
      if (["html", "js", "css", "json", "txt"].indexOf(record.ext) !== -1) {
        switch (record.ext) {
          case "html":
            this.language = "django";
            break;
          case "js":
            this.language = "javascript";
            break;
          case "css":
            this.language = "css";
            break;
          case "json":
            this.language = "json";
            break;
          case "txt":
            this.language = "text";
            break;
        }
        this.mode = "code";
      } else if (["pdf"].indexOf(record.ext) !== -1) {
        this.mode = "pdf";
        this.model_url = record.uri;
        this.codeEditorDialog = true;
      } else if (
        ["jpg", "jpeg", "png", "gif", "bmp"].indexOf(record.ext) !== -1
      ) {
        this.mode = "image";
        this.model_url = record.uri;
        this.codeEditorDialog = true;
      } else if (
        [
          "mp4",
          "m4v",
          "flv",
          "mov",
          "f4v",
          "ogv",
          "webm",
          "webmv",
          "mkv",
        ].indexOf(record.ext) !== -1
      ) {
        this.mode = "video";
        this.playerOptions.sources = [{ type: "", src: record.uri }];
        this.codeEditorDialog = true;
      }
    },
  },
};
</script>

<style scoped="lang">
.ant-layout-content,
.ant-layout-sider {
  background-color: #ffffff;
}
.conter {
  min-height: 600px;
}

</style>
