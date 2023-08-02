<template>
  <div class="root_box">
    <div class="details_box" v-if="params.data.guide == 0">
      <div class="title_back">
        <a @click="back()"><a-icon type="arrow-left" />返回</a>
      </div>
      <div class="container">
        <div
          class="card"
          v-for="(item, index) in params.content_detail"
          :key="index"
        >
          <div class="content">
            <h2>{{ (index + 1) <= 9 ? '0'+(index+1):(index+1) }}</h2>
            <h3>{{ params.data.title }}</h3>
            <p>
              {{ item }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div  v-if="params.data.guide == 1">
      <div class="title_back_two">
        <a @click="back()"><a-icon type="arrow-left" />返回</a>
      </div>
      <div
        style="
          display:flex;
          justify-content:center;
          border-top:1px solid #ccc;
          margin:0 40px;
        "
      >
        <div
          v-html="params.content_detail[0]"
          style="font-size: 16px !important; margin-top: 15px !important"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  created() {
    console.log("this.params", this.params);
  },
  computed: {},
  data() {
    return {
    };
  },
  methods: {
    back() {
      console.log("this.params", this.params);
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>

<style scoped>
.root_box {
  height: 100%;
}
.title_back {
  position: absolute;
  left: 2%;
  top: 10px;
  width: 96%;
  padding: 10px;
  background: #ddd;
  box-shadow: #555 0 0 8px;
  border: 0 !important;
  border-radius: 8px;
  z-index: 2;
}
.title_back_two {
  padding: 10px;
  background: #eee;
  box-shadow: #888 0 0 3px;
  border-radius: 8px;
  margin: 15px 40px 30px;
}
</style>
<style scoped>
.details_box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 100vh; */
  height: 100%;
}
.details_box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #184f6eb3;
  /* background: linear-gradient(#07e7c2,#0632f3); */
}
.container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1800px;
  flex-wrap: wrap;
  z-index: 1;
  margin-top: 50px;
  height: calc(100% - 50px);
  overflow: auto;
}
.container .card {
  position: relative;
  width: 250px;
  height: 350px;
  margin: 30px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 13px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-left: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  cursor: pointer;
  overflow-y: auto;
}

.container .card .content {
  padding: 20px 10px;
  text-align: center;
  height: 65%;
  margin-top: 35%;
}

.container .card .content h2 {
  position: absolute;
  top: -35px;
  right: 20px;
  font-size: 8em;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}
.container .card .content h3 {
  font-size: 1.8em;
  color: #fff;
  z-index: 1;
}
.container .card .content p {
  font-size: 1em;
  color: #fff;
  font-weight: 300;
}
</style>
