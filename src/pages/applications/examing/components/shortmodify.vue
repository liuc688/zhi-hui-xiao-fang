<template>
  <div style="margin:24px 32px">
   <a-card  class="cards" v-for="(item, index) in this.dataSource" :key="index">
      {{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ff7c2d"
        >(总分{{ item.score }})</span
      >
      <div id="result">{{ item.answer }}</div>
      <div style="margin:15px 0"> <span style="font-weight:700">参考答案:</span> {{item.model[0].title}}</div>
      <div>
        <span style="font-size: 18px; color: #13c2c2"
          >该题得分为 :  <a-input-number
          id="inputNumber"
          v-model="values[index]"
          :min="0"
          :max="item.score"
          @change="onChange"
          style="margin: 15px 0"
        /> 分</span
        >
      </div>
    </a-card>
    <div v-if="showCard">
      <a-button @click="back()" class="logo"
        ><a-icon type="to-top" />完成</a-button
      >
    </div>
  </div>
</template>

<script>
import { examinees_paginate, short_get,examinees_total } from "@/services/knowledge";
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
  data() {
    return {
      showCard:false,
      loading: false,
      dataSource: [],
      values: [],
      backid:"",
    };
  },
  created() {
    this.init();
  },
  methods: {
    onChange(w) {
    },
    init() {
      short_get({
        user: this.params.userId,
        examination: this.params.data.id,
      }).then((res) => {
        this.dataSource = res.data.data.questions;
        this.backid = res.data.data.id;
        for(let i in this.dataSource) {
          this.values.push("0");
        }
        this.showCard = true;
      });
    },
    back() {
      examinees_total({id:this.backid,total:this.values})
      .then((res) => {
      })
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "modify",
          params: this.params,
        },
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    details() {},
  },
};
</script>

<style >
.cards {
  box-shadow: 0 3px 2px 2px rgba(0, 0, 0, 0.3);
  min-height: 99px; 
  margin: 25px 0;
}
#result {
  margin-top: 15px;
  min-width: 600px;
  min-height: 78px;
  border: solid 1px gray;
}
  
</style>
<style scoped>
.logo {
  margin: 20px 0 0 0;
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  border-radius: 20px;
  background-size: 400%;
  font-size: 18px;
  text-transform: uppercase;
}
.logo:hover {
  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400%;
  }
}
.logo::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  /* background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); */
  border-radius: 40px;
  background-size: 400%;
  opacity: -1;
  transition: 0.5s;
}
.logo:hover::before {
  filter: blur(20px);
  opacity: 1;
}
</style>