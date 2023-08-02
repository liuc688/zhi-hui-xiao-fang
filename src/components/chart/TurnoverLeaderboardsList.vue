<template>
  <div class="rank">
    <h4 class="title">{{title}}</h4>
    <ul class="list">
      <li :key="index" v-for="(item, index) in list">
        <span :class="index < 3 ? 'active' : null">{{index + 1}}</span>
        <a style="color:#3d94fa" href="javascript:;" @click="onSee(item)">{{item.name}}</a>
        <span >{{item.total}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RankingList',
  props: ['title', 'list'],
  methods:{
    // onSee(record) {
    //   this.$emit("event", {  // 这里实现调用的 event 方法，后面这大括号是向 event 方法中传入的参数
    //     method: "onOpen",  // 使用的是 onOpen 方法
    //     params: {
    //       name: "Infofilling",
    //       height: "70%",  // height 和 width 用来限制弹窗的大小，主模块的高和宽都是 80%
    //       width: "70%",
    //       // title: "网络舆情协同处置平台",  // 新弹窗的标题
    //       type: "system",
    //       router: "Infofilling",  // 新弹窗的路由名称
    //       data: {
    //         id: record.id,
    //         self: true,
    //       },
    //     },
    //   });
    // }
    onOpen(params) {
      this.$emit("open", params || {});
    },
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onSee(record) {
      this.event({method:this.onOpen,params:{
        name: "Infofilling",
        height: "70%",  // height 和 width 用来限制弹窗的大小，主模块的高和宽都是 80%
        width: "70%",
        title: "网络舆情协同处置平台",  // 新弹窗的标题
        type: "system",
        router: "Infofilling",  // 新弹窗的路由名称
        data: {
          id: record.id,
          self: true,
        },
      }})
    }
  }
}
</script>

<style lang="less" scoped>
  .rank{
    padding: 0 32px 32px 72px;
    .title{
    }
    .list{
      margin: 25px 0 0;
      padding: 0;
      list-style: none;
      li {
        margin-top: 16px;
        span {
          color: @text-color-second;
          font-size: 14px;
          line-height: 22px;
        }
        span:first-child {
          background-color: @layout-bg-color;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-right: 24px;
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
        }
        span.active {
          background-color: #314659 !important;
          color: @text-color-inverse !important;
        }
        span:last-child {
          float: right;
        }
      }
    }
  }
</style>
