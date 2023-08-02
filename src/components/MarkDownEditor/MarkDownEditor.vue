<template>
  <mavon-editor
    ref="MarkDownEditor"
    class="md-edit"
    :boxShadow="false"
    v-model="content"
    :toolbars="toolbar"
    @imgAdd="$imgAdd"
    :editable="!readonly"
    :subfield="!readonly"
    :toolbarsFlag="!readonly"
    :defaultOpen="'preview'"
    :code-style="'vs2015'"
    :ishljs="true"
    :externalLink="externalLink"
  />
</template>

<script>
import axios from "axios";
import { UEditorUpload } from "@/services/api";
import Cookie from "js-cookie";
export default {
  name: "MarkDownEditor",
  components: {},
  props: {
    value: {
      type: String,
    },
    toolbars: {
      type: Object,
      default: () => ({}),
      required: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    uploadUrl: {
      type: String,
      default: UEditorUpload,
    },
  },
  data() {
    return {
      subfield: true,
      externalLink: {
        markdown_css: function () {
          // 这是你的markdown css文件路径
          return "/static/MavonEditor/markdown/github-markdown.min.css";
        },
        hljs_js: function () {
          // 这是你的hljs文件路径
          return "/static/MavonEditor/highlightjs/highlight.min.js";
        },
        // hljs_css: function(css) {
        // 	console.log(css);
        // 	// 这是你的代码高亮配色文件路径
        // 	return `/static/MavonEditor/highlightjs/styles/${css}.min.css`;
        // },
        // hljs_lang: function(lang) {
        // 	// 这是你的代码高亮语言解析路径
        // 	return '/static/MavonEditor/highlightjs/languages/' + lang + '.min.js';
        // },
        katex_css: function () {
          // 这是你的katex配色方案路径路径
          return `/static/MavonEditor/highlightjs/styles/vs2015.min.css`;
        },
        katex_js: function () {
          // 这是你的katex.js路径
          return "/static/MavonEditor/katex/katex.min.js";
        },
      },
    };
  },
  watch: {
    value(value) {
      this.content = value;
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
    toolbar() {
      return Object.assign(
        {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
        this.toolbars
      );
    },
  },
  methods: {
    // 上传图片方法
    $imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      //将下面上传接口替换为你自己的服务器接口
      axios({
        url: this.uploadUrl,
        method: "post",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: Cookie.get("Authorization"),
        },
      }).then((response) => {
        const { data } = response;
        let url = data.url;
        this.$refs.MarkDownEditor.$img2Url(pos, url);
      });
    },
  },
};
</script>
<style scoped="lang">
.md-edit {
  z-index: 1;
  border: 1px solid #d9d9d9;
}
</style>
