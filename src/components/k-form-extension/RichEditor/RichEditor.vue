<template>
  <div>
    <div class="ueditor-wraps" v-if="!check">
      <vue-ueditor-wrap
        v-model="contents[activeKey]"
        :config="config"
        @ready="ready"
        :editor-id="editor_id"
        @before-init="beforeInit"
      ></vue-ueditor-wrap>
      <a-tabs
        :activeKey="activeKey"
        tabPosition="bottom"
        type="editable-card"
        class="ueditor-tabs"
        @edit="onEdit"
        @tabClick="onTab"
      >
        <template v-for="(item, index) in contents">
          <a-tab-pane :key="index" :tab="`第${index + 1}页`" />
        </template>
        <!-- <a-button
        slot="tabBarExtraContent"
        style="float: left"
        size="large"
        @click="sensitives"
        >自动校对</a-button
      > -->
      </a-tabs>

      <a-modal
        width="80%"
        title="错敏字查找"
        :footer="false"
        @cancel="
          () => {
            visible = false;
            this.activeKeys = [];
          }
        "
        :visible="visible"
      >
        <div class="error_words">
          <div class="error_s">
            <a-spin :spinning="spinning">
              <div class="text_wrong" v-html="contents[activeKey]"></div>
            </a-spin>
          </div>
          <div class="word_s">
            <a-collapse v-model="activeKeys" :accordion="false">
              <a-collapse-panel
                v-for="(i, index) in keylist"
                :key="index"
                v-show="searchs_word[index].length"
              >
                <span slot="header"
                  >{{ i }}
                  <a-badge
                    :count="searchs_word[index].length || 0"
                    :offset="[10, -5]"
                /></span>
                <div
                  v-for="items in searchs_word[index]"
                  :key="items[0]"
                  class="focues"
                  @mouseenter="mouseenters(items)"
                  @mouseleave="mouseleaves(items)"
                >
                  '{{ items[1] }}'&nbsp;
                  <a-icon type="arrow-right" />
                  &nbsp;'{{ items[2] }}'
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-modal>
    </div>
    <div v-else style="padding: 0 10px; border: 1px solid #eee;">
      <div v-html="value"></div>
    </div>
  </div>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import { UEditorUpload } from "@/services/api";
import { text_parser, text_check } from "@/services/user";
import Cookie from "js-cookie";
export default {
  components: {
    VueUeditorWrap,
  },
  props: {
    value: {
      type: String,
    },
    record: {
      type: Object,
      required: true,
    },
    // form-item 宽度配置
    formConfig: {
      type: Object,
      required: false,
    },
    check: {
      type: Boolean,
      default: false,
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
    config() {
      return Object.assign(
        {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 400,
          // 初始容器宽度
          initialFrameWidth: "100%",
          //是否只读
          readonly: this.disabled || this.record.options.disabled,
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          serverUrl: UEditorUpload,
          headers: {
            Authorization: Cookie.get("Authorization"),
          },
          focus: false,
          lineheight: ["1", "1.5", "1.75", "2", "3", "4", "5", "6"],
        },
        this.dynamicData.config || {}
      );
    },
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          const arr = value.split(this.space);
          this.contents = arr;
        }
      },
      deep: true,
    },
    contents: {
      handler(value) {
        value = value.join(this.space);
        // console.log("value", value);
        this.$emit("change", value);
      },
      deep: true,
    },
  },
  created() {
    this.contents = [this.value];
  },
  mounted() {},
  data() {
    return {
      editor: null,
      editor_id: "id_" + Math.random(),
      readonly: false,
      UEDITOR_HOME_URL: "/UEditor/",
      activeKey: 0,
      newTabIndex: 0,
      contents: [],
      space: '<div class="ueditor-tabs-page"></div>',
      visible: false,
      searchs_word: {
        black_list: [],
        pol: [],
        char: [],
        word: [],
        redund: [],
        miss: [],
        order: [],
        dapei: [],
        punc: [],
        idm: [],
        org: [],
        leader: [],
        number: [],
        addr: [],
        name: [],
        grammar_pc: [],
      },
      transitionwords: "",
      spinning: false,
      activeKeys: [],
      keylist: {
        black_list: "黑名单纠错",
        pol: "政治术语纠错",
        char: "别字纠错",
        word: "别词纠错",
        redund: "语法纠错-冗余",
        miss: "语法纠错-缺失",
        order: "语法纠错-乱序",
        dapei: "搭配纠错",
        punc: "标点纠错",
        idm: "成语纠错",
        org: "机构名纠错",
        leader: "领导人职称纠错",
        number: "数字纠错",
        addr: "地名纠错",
        name: "全文人名纠错",
        grammar_pc: "句式杂糅&语义重复",
      },
    };
  },
  methods: {
    ready(editorInstance) {
      this.editor = editorInstance;
    },
    beforeInit(editorId) {
      const that = this;
      window.UE.registerUI("setanchor", (editor, uname) => {
        const btn = new window.UE.ui.Button({
          name: uname,
          title: "设置锚点",
          // cssRules: "background-image: url('/static/UEditor/themes/default/images/anchor.gif') !important;background-size: cover",
          cssRules: "background-position: -200px 0;",
          onclick: function () {
            that.editor = editor;
            that.$confirm({
              title: "添加锚点",
              content: (
                <a-input placeholder="请输入锚点标题" ref="anchor_title" />
              ),
              okText: "确认",
              cancelText: "取消",
              onOk(close) {
                editor.focus();
                const title = that.$refs.anchor_title.stateValue;
                editor.execCommand(
                  "inserthtml",
                  `<a class="suncool-anchor" id="${title}"></a>`
                );
                editor.focus("anchor");
                close();
              },
            });
          },
        });
        return btn;
      });
      window.UE.registerUI("missensitive", (editor, uname) => {
        const btns = new window.UE.ui.Button({
          name: uname,
          title: "错敏排查",
          cssRules:
            "background-image: url('/static/UEditor/themes/default/images/missensitive.png') !important;background-size: cover",
          onclick: function () {
            that.editor = editor;
            editor.focus();
            that.sensitives();
          },
        });
        return btns;
      });
      // window.UE.registerUI("Sensitivewords", (editor, uname) => {
      //   const btns = new window.UE.ui.Button({
      //     name: uname,
      //     title: "敏感词",
      //     cssRules:
      //       "background-image: url('/static/UEditor/themes/default/images/Sensitivewords.png') !important;background-size: cover",
      //     onclick: function () {
      //       that.editor = editor;
      //       editor.focus();
      //       that.test();
      //     },
      //   });
      //   return btns;
      // });
    },

    onEdit(index, action) {
      this[action](index);
    },
    add() {
      this.activeKey = this.contents.length;
      this.contents.push(null);
    },
    remove(index) {
      if (this.contents.length > 1) {
        this.$confirm({
          title: "删除确认",
          content: "确定要删除当前页吗，该操作不可逆，请谨慎操作！",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            this.$delete(this.contents, index);
            if (index > 1) {
              this.activeKey = index - 1;
            } else {
              this.activeKey = 0;
            }
          },
        });
      }
    },
    onTab(index) {
      this.activeKey = index;
    },
    test() {
      text_check({
        text: this.contents[this.activeKey],
        cannelTag: true
      }).then(res=>{
        console.log('res', res)

      }).catch(err=>{
        console.log(err)
      })
      // this.contents[this.activeKey] =
      //   '<div class="missensitive" style="color: red">' +
      //   this.contents[this.activeKey] +
      //   "</div>";
      console.log(this.contents[this.activeKey]);
    },
    sensitives() {
      this.transitionwords = this.contents[this.activeKey];
      if (this.transitionwords) {
        this.visible = true;
        this.searchs_word = {
          black_list: [],
          pol: [],
          char: [],
          word: [],
          redund: [],
          miss: [],
          order: [],
          dapei: [],
          punc: [],
          idm: [],
          org: [],
          leader: [],
          number: [],
          addr: [],
          name: [],
          grammar_pc: [],
        };
        // this.searchers();
        var that = this
        text_parser({
          text: this.transitionwords,
          cannelTag: true,
        })
          .then((Response) => {
            this.searchs_word = Response.data.message;
            this.activeKeys = [];
            for (var i in this.searchs_word) {
              if (
                this.searchs_word[i].length &&
                i != "text" &&
                i != "punc" &&
                i != "miss"
              ) {
                for (let j in this.searchs_word[i]) {
                  this.activeKeys.push(this.searchs_word[i][j]);
                }
              }
            }
            var txts = this.removeTAG(this.contents[this.activeKey]);
            for (var s = 0; s < this.activeKeys.length; s++) {
              var n = txts
                .slice(0, this.activeKeys[s][0])
                .split(this.activeKeys[s][1]).length;
              this.activeKeys[s].push(n);
              var fillText =
                "<span class='missensitive keyword-red' id='"+this.activeKeys[s][5] + "-" + this.activeKeys[s][4]+"'>" +
                this.activeKeys[s][1] +
                "</span>";
              this.contents[this.activeKey] = this.replaceIndex(
                this.contents[this.activeKey],
                this.activeKeys[s][1],
                this.activeKeys[s][6],
                fillText
              );
            }
            if (this.activeKeys.length == 0) {
              this.$message.success("未找到错误");
            }
          })
          .catch((error) => {
            console.log(error);
            this.$message.error(error.response.data.message || error.message);
          });
      } else {
        this.$message.info("请确保正文有内容！");
      }
    },
    // 获取纯文本
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    // 文本替换
    replaceIndex(str, cha, num, fillTxt) {
      var s = [...str.matchAll(new RegExp(cha, "g"))][num - 1];
      return (
        s.input.substring(0, s.index) +
        fillTxt +
        s.input.substring(s.index + cha.length)
      );
    },
    searchers() {
      this.spinning = true;
      text_parser({
        text: this.transitionwords,
      })
        .then((Response) => {
          this.spinning = false;
          this.searchs_word = Response.data.message;
          for (let i in this.searchs_word) {
            if (this.searchs_word[i].length && i != "text") {
              this.activeKeys.push(i);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },
    mouseenters(item) {
      var sata = document.getElementById(item[5] + "-" + item[4]);
      sata.setAttribute("tabindex", "-1");
      sata.focus();
      sata.style.cssText = "background: red !important;color: white";
    },
    mouseleaves(item) {
      var satas = document.getElementById(item[5] + "-" + item[4]);
      satas.focus();
      satas.style.cssText = "background: yellow !important;";
    },
  },
};
</script>
<style lang="less">
.ueditor-tabs {
  .ant-tabs-card-bar {
    margin-top: 0px;
    .ant-tabs-extra-content {
      float: left !important;
      .ant-tabs-new-tab {
        height: 40px;
        width: 40px;
      }
    }
  }
}
.error_words {
  display: flex;
  width: 100%;
  min-height: 600px;
  .error_s {
    width: 50%;
    height: 600px;
    overflow: auto;
    padding: 20px;
    border-right: 1px solid #aaa;
  }
  .word_s {
    width: 50%;
    height: 600px;
    overflow: auto;
    padding: 10px;
    .focues {
      cursor: pointer;
      padding: 10px;
    }
    .focues:hover {
      background: #cdf0ff;
    }
  }
}
</style>
<style scoped>
.ueditor-wraps >>> .edui-editor {
  z-index: 8 !important;
}
.text_wrong {
  font-size: 20px !important;
}
.text_wrong >>> .keyword-red {
  background: yellow;
}
.missensitive{
  color:red
}
</style>
