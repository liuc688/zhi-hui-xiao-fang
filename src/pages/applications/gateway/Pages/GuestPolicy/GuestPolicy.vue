<template>
  <div style="padding: 0 30px">
    <a-spin
      :spinning="loading"
      tip="Loading..."
      style="height: 100%; width: 100%"
    >
      <a-card
        title="访客权限设置"
        style="padding: 0; margin: 0"
        class="qrxm_set"
      >
        <a-button type="primary" @click="onSave" slot="extra"
          >保存提交</a-button
        >
        <a-card-grid style="width: 100%">
          <a-card-meta>
            <div slot="title">
              <span>设置组织</span>
              <span>
                <a-checkbox
                  :indeterminate="indeterminate.organization"
                  :checked="checks.organization"
                  @change="onOrganizationAllChange"
                  style="float: right"
                >
                  全选
                </a-checkbox>
              </span>
            </div>
            <!-- <div slot="description">
              <a-checkbox-group
                :value="guests.organization"
                @change="onOrganizationChange"
              >
                <template v-for="item in organizations">
                  <a-checkbox
                    :value="item.id"
                    :key="item.id"
                    class="checkbox-item"
                  >
                    {{ item.title }}
                  </a-checkbox>
                </template>
              </a-checkbox-group>
            </div> -->
            <div slot="description" class="organization_box">
              <!-- <div class="tree_title" style="">选择组织:</div> -->
              <a-tree-select
                class="tree_sty"
                show-search
                multiple
                v-model="guests.organization"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="organizations"
                placeholder="请选择所在组织"
                :replaceFields="{
                  key: 'id',
                  value: 'id',
                }"
                :filterTreeNode="
                  (value, node) => {
                    const data = node.componentOptions.propsData.dataRef;
                    return (
                      data.title.indexOf(value) !== -1 ||
                      data.name.indexOf(value) !== -1
                    );
                  }
                "
              >
              </a-tree-select>
            </div>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid style="width: 100%">
          <a-card-meta>
            <div slot="title">
              <span>设置应用</span>
              <span>
                <a-checkbox
                  @change="onApplicationAllChange"
                  :indeterminate="indeterminate.application"
                  :checked="checks.application"
                  style="float: right"
                >
                  全选
                </a-checkbox>
              </span>
            </div>
            <div slot="description">
              <a-checkbox-group
                :value="guests.application"
                @change="onApplicationChange"
              >
                <template v-for="item in applications">
                  <a-checkbox
                    :value="item.id"
                    :key="item.id"
                    class="checkbox-item"
                  >
                    {{ item.title }}
                  </a-checkbox>
                </template>
              </a-checkbox-group>
            </div>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid style="width: 100%">
          <a-card-meta>
            <div slot="title">
              <span>设置接口</span>
              <span>
                <a-checkbox
                  @change="onRouteAllChange"
                  :indeterminate="indeterminate.route"
                  :checked="checks.route"
                  style="float: right"
                >
                  全选
                </a-checkbox>
              </span>
            </div>
            <div slot="description">
              <a-checkbox-group :value="guests.route" @change="onRouteChange">
                <template v-for="temp in routes">
                  <a-card :title="temp._id" :key="temp._id" :bordered="false">
                    <template v-for="item in temp.records">
                      <a-checkbox
                        :value="item.parent"
                        :key="item.parent"
                        class="checkbox-item"
                      >
                        {{ item.title }}
                      </a-checkbox>
                    </template>
                  </a-card>
                </template>
              </a-checkbox-group>
            </div>
          </a-card-meta>
        </a-card-grid>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { guest_get, guest_edit } from "@/services/guest";
import { application_list } from "@/services/application";
import { organization_list } from "@/services/organization";
import { organization_tree } from "@/services/organization";
import { policy_routes } from "@/services/policy";
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
      loading: false,
      applications: [],
      organizations: [],
      guests: {},
      routes: [],
      indeterminate: {
        organization: true,
        application: true,
        route: true,
      },
      checks: {
        organization: undefined,
        application: undefined,
        route: undefined,
      },
      organization: [],
    };
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    routeids() {
      const records = this.routes.map((item) => {
        const record = item.records.map((temp) => temp.parent);
        return record;
      });
      let routes = [];
      records.forEach((element) => {
        routes = [...routes, ...element];
      });
      return routes;
    },
  },
  authorize: {},
  watch: {
    "guests.organization": {
      handler(val) {
        let all =
          this.guests.organization.length &&
          this.guests.organization.length !== this.organizations.length;
        const chceked =
          this.guests.organization.length &&
          this.guests.organization.length === this.organizations.length;

        this.checks.organization = chceked ? true : false;
        all = all ? true : false;
        this.indeterminate.organization = val.length ? all : false;
      },
      deep: true,
    },
    "guests.application": {
      handler(val) {
        let all =
          this.guests.application.length &&
          this.guests.application.length !== this.applications.length;
        const chceked =
          this.guests.application.length &&
          this.guests.application.length === this.applications.length;
        this.checks.application = chceked ? true : false;
        all = all ? true : false;
        this.indeterminate.application = val.length ? all : false;
      },
      deep: true,
    },
    "guests.route": {
      handler(val) {
        let all =
          this.guests.route.length &&
          this.guests.route.length !== this.routeids.length;
        const chceked =
          this.guests.route.length &&
          this.guests.route.length === this.routeids.length;
        this.checks.route = chceked ? true : false;
        all = all ? true : false;
        this.indeterminate.route = val.length ? all : false;
      },
      deep: true,
    },
  },
  methods: {
    onLoad() {
      Promise.all([
        application_list(),
        organization_tree(),
        policy_routes({authkeys:["GateWayKey"], public:false}),
        guest_get(),
      ])
        .then((response) => {
          this.applications = response[0].data.data;
          this.organizations = response[1].data.data;
          this.routes = response[2].data.data;
          console.log("this.routes", this.routes);
          this.guests = response[3].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onSave() {
      this.loading = true;
      guest_edit({
        organization: this.guests.organization,
        application: this.guests.application,
        route: this.guests.route,
      })
        .then((response) => {
          this.$message.success(response.data.message);
          this.onLoad();
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.$message.error(error);
          this.loading = false;
        });
    },
    onOrganizationChange(checkedValue) {
      this.guests.organization = checkedValue;
    },
    onApplicationChange(checkedValue) {
      this.guests.application = checkedValue;
    },
    onRouteChange(checkedValue) {
      this.guests.route = checkedValue;
    },
    // onOrganizationAllChange(e) {
    //   const check = e.target.checked;
    //   this.guests.organization = check
    //     ? this.organizations.map((item) => item.id)
    //     : [];
    // },
    // 路由全选按钮
    onOrganizationAllChange(e) {
      console.log("this.organizations", this.organizations);
      const check = e.target.checked;
      // this.guests.organization = check
      //   ? this.organizations.map((item) => item.id)
      //   : [];
      this.uus = [];
      if (check) {
        this.digui(this.organizations);
        console.log('-----=====---==--==',this.uus);
        this.guests.organization = this.uus;
      }else {
        this.uus = [];
        this.guests.organization = [];
      }

    },
    digui(record){
      this.uus.push(...record.map((item) => item.id));
      for(let i =0;i<record.length;i++){
        if(record[i].children) {
          this.digui(record[i].children);
        }
      }
    },
    onApplicationAllChange(e) {
      const check = e.target.checked;
      this.guests.application = check
        ? this.applications.map((item) => item.id)
        : [];
    },

    onRouteAllChange(e) {
      const check = e.target.checked;
      this.guests.route = check ? this.routeids : [];
    },
  },
};
</script>

<style>
.checkbox-item {
  border: 1px solid #ccc;
  padding: 3px 8px;
  margin: 4px 8px;
  font-size: 13px !important;
}
</style>
<style scoped>
.tree_sty {
  width: 100%;
}
.organization_box {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* background-image: linear-gradient(90deg, #777, #aaa); */
  min-height: 50px;
  border-radius: 15px;
}
/* .tree_title {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
} */
</style>
<style>
.organization_box .ant-select-selection--multiple {
  opacity: 0.8 !important;
  width: 100%;
  min-height: 48px;
  display: flex;
  justify-content: left;
  align-items: center;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid #aaa;
}
.qrxm_set .ant-card-grid {
  padding: 10px 16px;
}
.qrxm_set .ant-card-head-title {
  padding: 10px 0;
}
.qrxm_set .ant-card-meta-title {
  font-weight: 700;
}
.qrxm_set .ant-card-head {
  min-height: 32px !important;
}
.qrxm_set .ant-card-head-title {
  font-size: 15px;
  font-weight: 700;
}
/* .qmxr_set .ant-card-body .ant-card-grid .ant-checkbox-group .ant-checkbox-wrapper span{
  font-size: 12px !important;
} */
.qrxm_set .ant-card-head {
  padding: 0 7px;
}
</style>
