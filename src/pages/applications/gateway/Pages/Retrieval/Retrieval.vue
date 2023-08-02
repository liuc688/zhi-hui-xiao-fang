<template>
    <div style="padding: 0 30px">
      123123123123123123
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
    data() {
      return {
       
      };
    },
    created() {
      // 用户增编表单
      this.init();
    },
    methods: {
      init() {
        console.log(122222222)
      },
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  