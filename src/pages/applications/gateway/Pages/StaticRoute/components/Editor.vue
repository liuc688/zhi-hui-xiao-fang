<template>
  <a-card :title="title">
    <a slot="extra" @click="onSubmit">保存提交</a>
    <a-card-grid style="width: 100%">
      <k-form-build
        :value="defaultJsonData"
        ref="defaultForm"
        :dynamicData="dynamicData"
      />
    </a-card-grid>
    <a-card-grid style="width: 100%">
      <k-form-build
        :value="infoJsonData"
        ref="infoForm"
        :dynamicData="dynamicData"
      />
    </a-card-grid>
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";

import { routeinfo_add, routeinfo_edit } from "@/services/routes";
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
      id: undefined,
      title: null,
      loading: false,
      defaultJsonData: {},
      infoJsonData: {},
      commit: undefined,
      data: {
        parnet: {},
      },
      types:undefined
    };
  },
  computed: {
    dynamicData() {
      return {};
    },
  },
  created() {
    console.log('this.params', this.params)
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.id = this.params.data.id;
      this.data = this.params.data;
      this.title = this.params.data.id ? "编辑" : "添加";
      this.types = this.params.type && this.params.type == 'copy' ? true : false;
      this.commit = this.types ?   routeinfo_add : this.params.data.id ?   routeinfo_edit : routeinfo_add
      let pipeline = [
        form_get({ name: "route_add" }),
        form_get({ name: "router_info" }),
      ];
      Promise.all(pipeline)
        .then((response) => {
          this.defaultJsonData = response[0].data.data.form;
          this.infoJsonData = response[1].data.data.form;
          if (this.id) {
            this.initData(this.data);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onSubmit() {
      this.loading = true;
      this.$nextTick(() => {
        Promise.all([
          this.$refs.defaultForm.getData(),
          this.$refs.infoForm.getData(),
        ])
          .then((response) => {
            let formData = {
              id: this.types ? undefined : this.id || undefined,
              parent: this.id ? this.data.parent.id : undefined,
            };
            for (var item in response) {
              formData = Object.assign(formData, response[item],{id: this.types ? undefined : this.id || undefined});
            }
            formData["authenticationOptions"] = {
              AuthenticationProviderKey: formData["authenticationProviderKey"],
            };
            delete formData["AuthenticationProviderKey"];
            console.log('formData', formData)
            //  this.loading = false;
            this.commit(formData)
              .then((response) => {
                var data = response.data.data;
                this.$message.success(response.data.message);

                this.$emit("event", {
                  method: "onEdited",
                  params: data.routeInfo.id,
                });

                this.loading = false;
              })
              .catch((error) => {
                console.log("error", error);
                this.$message.error(error.response.data.message);
                this.loading = false;
              });
          })
          .catch((error) => {
            console.log("error", error);
          });
      });
    },
    initData(data) {
      console.log('data', data)
      this.$nextTick(() => {
        this.$refs.defaultForm.reset();
        this.$refs.infoForm.reset();
        data.parent.downstreamHostAndPorts =
          data.parent.downstreamHostAndPorts.map((item) => {
            return {
              host: item.host,
              port: item.port.toString(),
            };
          });
        
        this.setData(
          this.$refs.defaultForm,
          Object.assign(data.parent, {
            authenticationProviderKey:
              data.parent.authenticationOptions.authenticationProviderKey,
          })
        );
        this.setData(this.$refs.infoForm, data);
      });
    },
    setData(form, data) {
      this.$nextTick(() => {
        let formData = {};
        for (let key in form.form.formItems) {
          formData[key] = data[key];
        }
        form.setData(formData);
      });
  
    },
  },
};
</script>