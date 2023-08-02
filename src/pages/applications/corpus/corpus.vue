<template>
  <div style="width: 100%; height: calc(100vh-64px)"  v-if="appdata.status">
    <a-spin
      :spinning="spinning"
      style="height: 100%; width: 100%"
      tip="Loading..."
    >
      <div style="height: 100%">
        <component
          ref="component"
          :is="route"
          :params="params"
          @event="event"
          :key="params.id"
        ></component>
      </div>
    </a-spin>
  </div>
  <maintain v-else/>

</template>

<script>
import Home from "./components/home.vue";
import details_list from "./components/details_list.vue";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";

export default {
  components: {
    Home,
    maintain,
    details_list,
  },
  props:{
    appid: {
      type: String,
    },
  },
  data() {
    return {
      spinning: false,
      params: {},
      back: {
        route: null,
        params: null,
      },
      route: "home",
      appdata:{
        status: true
      }
    };
  },
  computed(){},
  created(){
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })

  },
  methods: {
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.route = route;
      this.params = params;
    },
  },
};
</script>