<template>
  <div class="codeEditBox">
    <editor
      v-model="content"
      @init="editorInit"
      @input="codeChange"
      :lang="language"
      :options="editorOptions"
      :theme="theme"
    ></editor>
  </div>
</template>
<script>
//引入主题
require("brace/theme/monokai");
require("brace/theme/dracula");
require("brace/theme/dawn");
require("brace/theme/eclipse");
require("brace/theme/github");
require("brace/theme/gob");
require("brace/theme/tomorrow");
require("brace/theme/twilight");
//引入插件
require("brace/ext/language_tools");
require("brace/ext/beautify");

require("brace/mode/text");
require("brace/snippets/text");

//引入语言
require("brace/mode/django");
require("brace/snippets/django");
require("brace/mode/html");
require("brace/snippets/html");
require("brace/mode/json");
require("brace/snippets/json");
require("brace/mode/javascript");
require("brace/snippets/javascript");
import Editor from "vue2-ace-editor";
import ace from "brace";
export default {
  components: {
    Editor,
  },
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
      default: "chrome",
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
      content: null,
      beautify: null,
      generateId:
        "id_" +
        Math.random()
          .toString(36)
          .substr(2, 4),
      editorOptions: {
        // 设置代码编辑器的样式
        enableBasicAutocompletion: true, //启用基本自动完成
        enableSnippets: true, // 启用代码段
        enableLiveAutocompletion: true, //启用实时自动完成
        tabSize: 2, //标签大小
        fontSize: 18, //设置字号
        showPrintMargin: false, //去除编辑器里的竖线
        wrapBehavioursEnabled: true,
        wrap: true,
        setShowPrintMargin: false,
        enableMultiselect: true,
        autoScrollEditorIntoView: true,
        readOnly: this.readOnly,
      },
    };
  },
  watch: {
    value(val) {
      this.content = val;
    },
    readonly(val) {
      this.editorOptions.readOnly = val;
      console.log('this.editorOptions.readOnly',this.editorOptions.readOnly);

    },
  },
  methods: {
    codeChange(val) {
      this.$emit("update:value", val);
    },
    onBeautify() {
      this.beautify(this.editor.getSession());
    },
    editorInit(editor) {
      this.editor = editor;
      const { beautify } = ace.acequire("ace/ext/beautify");
      this.beautify = beautify;
      editor.resize();
      const that = this;
      this.content = this.value;
      editor.commands.addCommand({
        name: "save",
        bindKey: { win: "Ctrl-S", mac: "Command-S" },
        exec: function(editor) {
          that.$emit("save", editor, editor.getValue());
        },
      });
      editor.commands.addCommand({
        name: "beautify",
        bindKey: { win: "Alt-F", mac: "Command-F" },
        exec: function(editor) {
          beautify(editor.getSession());
        },
      });
    },
  },
};
</script>
<style scoped>
.codeEditBox {
  width: 100%;
  height: 600px;
  border: 1px solid #dcdee2;
}
</style>
