<template>
  <div class="wrap h-100">
    <div class="w-100 code-editor" :ref="generateId"></div>
  </div>
</template>
<script>

import ace from "ace-builds";
// 主题风格，引入主题后还需要在 options 中指定主题才会生效
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/theme-dracula";
import "ace-builds/src-min-noconflict/theme-dawn";
import "ace-builds/src-min-noconflict/theme-eclipse";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/theme-gob";
import "ace-builds/src-min-noconflict/theme-tomorrow";
import "ace-builds/src-min-noconflict/theme-twilight";

// 支持代码格式， 需要引入具体的语法高亮库才会有对应的语法高亮效果
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-min-noconflict/mode-css";
import "ace-builds/src-min-noconflict/mode-html";
import "ace-builds/src-min-noconflict/mode-django";
import "ace-builds/src-min-noconflict/mode-text";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-beautify";

import jsWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-javascript";
import jsonWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-json";
import cssWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-css";
import htmlWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-html";

// 引入全局实例

ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl);
ace.config.setModuleUrl("ace/mode/json_worker", jsonWorkerUrl);
ace.config.setModuleUrl("ace/mode/css_worker", cssWorkerUrl);
ace.config.setModuleUrl("ace/mode/html_worker", htmlWorkerUrl);

ace.config.setModuleUrl(
  "ace/snippets/javascript",
  require("file-loader!ace-builds/src-noconflict/snippets/javascript.js")
);
ace.config.setModuleUrl(
  "ace/snippets/css",
  require("file-loader!ace-builds/src-noconflict/snippets/css.js")
);
ace.config.setModuleUrl(
  "ace/snippets/html",
  require("file-loader!ace-builds/src-noconflict/snippets/html.js")
);
ace.config.setModuleUrl(
  "ace/snippets/django",
  require("file-loader!ace-builds/src-noconflict/snippets/django.js")
);
// 插件

import "ace-builds/src-min-noconflict/ext-searchbox";

export default {
  name: "CodeEditor",
  model: {
    event: "change",
  },
  props: {
    // 编辑器内容
    value: String,
    // 默认语言
    language: {
      type: String,
      default: "javascript",
    },
    // 主题，对应主题库 JS 需要提前引入
    theme: {
      tyle: String,
      default: "monokai",
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Function,
    },
    // 最大行数
    maxLines: Number,
  },
  data() {
    return {
      editor: null,
      generateId:
        "id_" +
        Math.random()
          .toString(36)
          .substr(2, 4),
      isVisible: false,
      dialogValue: "",
      beautify: null,
    };
  },
  mounted() {
    // 初始化
    this.initEditor();
  },
  watch: {
    language(val) {
      this.editor.setOptions({
        mode: `ace/mode/${val}`,
      });
    },
    theme(val) {
      this.editor.setOptions({
        theme: `ace/theme/${val}`,
      });
    },
  },
  methods: {
    // 初始化
    initEditor() {
      // 创建实例
      this.editor = ace.edit(this.$refs[this.generateId], {
        mode: `ace/mode/${this.language}`,
        theme: `ace/theme/${this.theme}`,
        fontSize: 12,
        tabSize: 2,
        value: this.value,
        selectionStyle: "text",
        maxLines: this.maxLines,
        readOnly: this.readonly,
      });
      // 设置属性等，具体需要可根据官方参数自行设置
      this.editor.setOptions({
        wrapBehavioursEnabled: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        wrap: true,
        setShowPrintMargin: false,
        enableMultiselect: true,
        autoScrollEditorIntoView: true,
      });
      const { beautify } = ace.require("ace/ext/beautify");
      this.beautify = beautify;
      // 设置值改变监听
      this.editor.on("change", () => {
        this.$emit("change", this.editor.getValue());
      });
      const that = this;
      this.editor.commands.addCommand({
        name: "save",
        bindKey: { win: "Ctrl-S", mac: "Command-S" },
        exec: function(editor) {
          that.$emit("save", editor, that.editor.getValue());
        },
      });
    },
    onBeautify() {
      this.beautify(this.editor.getSession());
    },
    // 实例方法，高亮某一行
    gotoLine(lineNumber) {
      this.editor.gotoLine(lineNumber);
    },
    // resize编辑器
    resize() {
      this.editor.resize(true);
    },
    destroy() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },
  },
  beforeDestroy() {
    this.destroy();
  },
};
</script>
<style scoped="lang">
.wrap {
  position: relative;
}
.wrap .code-editor {
  min-height: 600px;
  height: 100%;
  border: 1px solid #cccccc;
}
.wrap .icon-fullscreen {
  position: absolute;
  /* color: #fff; */
  right: 10px;
  font-size: 16px;
  z-index: 9999;
  cursor: pointer;
}
</style>
