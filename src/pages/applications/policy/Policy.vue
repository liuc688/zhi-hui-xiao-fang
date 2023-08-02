<template>
  <a-row style="height: 100%; width: 100%" v-if="appdata.status">
    <!-- 左侧列表 -->
    <a-col :span="5" class="lists">
      <div style="width: 100%; padding: 10px 20px">
        <a-tree-select
          style="width: 100%"
          show-search
          @change="handleChanges"
          v-model="sites"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="organizations"
          placeholder="请选择搜索站点"
          :replaceFields="{
            key: 'id',
            value: 'id',
            title: 'title',
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
      <div class="contents">
        <a-button @click="addlist"><a-icon type="plus" /> 添加策略</a-button>
      </div>
      <!-- <a-tree  :tree-data="routerstree"
        class="draggable-trees"
       ref="channelTreeseses">
      </a-tree> -->
      <a-tree
        v-if="routerstree.length"
        :tree-data="routerstree"
        :default-expand-all="true"
        auto-expand-parent
        :expandedKeys.sync="channelexpandedKeys"
        :selectedKeys.sync="channelselectedKeys"
        :block-node="true"
        :replaceFields="{
          title: 'title',
          key: 'id',
          value: 'id',
        }"
        ref="channelTreesese"
        @select="onTreeSelect"
        @expand="onExpand"
        @rightClick="onRightClickchannel"
      >
      </a-tree>
      <div v-else style="margin: 60px auto">
        <a-empty>
          <div slot="description">暂无策略</div>
        </a-empty>
      </div>
    </a-col>
    <!-- 右侧列表 -->
    <a-col :span="19" class="detailes">
      <a-spin
        v-if="channelselectedKeys.length"
        :spinning="spinning"
        tip="Loading..."
        style="height: 100%; width: 100%"
      >
        <div class="header_title_s">
          <a-space :size="12">
            <span style="font-size: 25px; color: #444">{{
              detailes.name
            }}</span>
            <a-tag color="#E9F3F9" style="color: #444"
              >ID:{{ detailes.id }}</a-tag
            >
            <a-icon
              type="edit"
              v-auth="`policy.edit`"
              style="font-size: 18px"
              @click="addlists(detailes)"
            />
            <a-icon
              type="delete"
              style="font-size: 18px"
              v-auth="`policy.delete`"
              @click="deletestrategy(detailes.id)"
            />
            <a-popover trigger="click" style="padding: 0px">
              <template slot="content" style="padding: 0px">
                <div style="width: 400px; padding: 15px">
                  策略标题尽量用汉字以便前端展示<br />
                  策略名称尽量使用英文字母以便后台数据区分<br />
                </div>
              </template>
              <a-icon
                style="color: #545454; cursor: pointer; font-size: 18px"
                type="question-circle"
              />
            </a-popover>
          </a-space>
          <a-button
            type="primary"
            v-if="administer"
            v-auth="`policy.edit`"
            style="float: right"
            @click="save"
            >保存</a-button
          >
        </div>
        <div class="administer_roll">
          <div v-if="administer">
            <a-card title="应用权限" :headStyle="headStyle" style="width: 100%">
              <a slot="extra">
                <a-checkbox v-model="appsall" @change="selectAll(applist)">
                  全选
                </a-checkbox>
              </a>
              <a-checkbox-group
                @change="onChangeapp"
                v-model="selectsapp"
                style="width: 100%; padding: 20px"
              >
                <a-row>
                  <a-col :span="3">
                    <span style="line-height: 40px"> 应用列表 </span>
                  </a-col>
                  <a-col :span="21">
                    <a-checkbox
                      v-for="item in applist"
                      :key="item.id"
                      :value="item.id"
                      class="apps_checks"
                    >
                      {{ item.title }}
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-card>

            <!-- 接口列表 -->
            <a-card title="接口权限" :headStyle="headStyle" style="width: 100%">
              <a slot="extra">
                <a-checkbox v-model="appsalls" @change="selectAll(apps)">
                  全选
                </a-checkbox>
                <a-checkbox v-model="openAlls" @change="openAll">
                  全展开
                </a-checkbox>
              </a>
              <a-checkbox-group
                @change="onChange"
                v-model="selects"
                style="width: 100%"
              >
                <div v-for="items in apps" :key="items.id">
                  <a-collapse
                    :bordered="false"
                    v-model="activeKey"
                    expand-icon-position="left"
                  >
                    <a-collapse-panel :key="items._id" :header="items._id">
                      <a
                        slot="extra"
                        @click="collapseclick"
                        :data-title="items._id"
                      >
                      </a>
                      <a-checkbox
                        v-for="item in items.records"
                        :key="item.parent"
                        :value="item.parent"
                        class="apps_checks"
                      >
                        {{ item.title }}
                        <a-popover trigger="click">
                          <span slot="title"> 接口说明 </span>
                          <span slot="content">
                            {{ item.note || "暂无接口使用说明"}}
                          </span>
                          <a-icon type="question-circle" />
                        </a-popover>
                      </a-checkbox>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </a-checkbox-group>
            </a-card>
          </div>
          <a-empty v-else>
            <div slot="description">
              <div>超级管理员拥有所有权限</div>
            </div>
          </a-empty>
        </div>
      </a-spin>
      <div v-else style="margin: 60px auto">
        <a-empty>
          <div slot="description">请选择一个策略</div>
        </a-empty>
      </div>
    </a-col>
    <!-- 策略增编弹窗 -->
    <a-modal
      v-model="visible"
      :title="title"
      :maskClosable="false"
      ok-text="确认"
      cancel-text="取消"
      @ok="onOk"
      centered
      width="45%"
      :confirmLoading="okloading"
      :z-index="1002"
      @cancel="
        () => {
          this.$refs.form.reset();
          visible = false;
        }
      "
    >
      <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
    </a-modal>
  </a-row>
  <maintain v-else/>
</template>

<script>
import { mapState } from "vuex";
import {
  policy_list,
  policy_get,
  policy_edit,
  policy_delete,
  policy_routes,
  policy_add,
  policy_tree,
  policy_alltree
} from "@/services/policy";
import { organization_tree } from "@/services/organization";
import { application_list } from "@/services/application";
import { form_get } from "@/services/forms";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";

export default {
  name: "policy",
  components: {
    maintain,
  },
  props: {
    appid:{
      type: String
    }
  },
  data() {
    return {
      routerstree: [],
      classs: 1,
      spinning: true,
      detailes: {},
      jsonData: {},
      title: "添加策略",
      visible: false,
      okloading: false,
      strateId: null,
      apps: [],
      selects: [],
      administer: false,
      applist: [],
      selectsapp: [],
      selectindex: 1,
      headStyle: {
        fontSize: "20px",
      },
      application: [],
      Interface: [],
      appsalls: false,
      appsall: false,
      activeKeys: [],
      activeKey: [],
      lists: {},
      openAlls: true,
      organizations: [],
      sites: "",
      channelexpandedKeys: [],
      channelselectedKeys: [],
      parent: "",
      formsdatas: {},
      appdata:{
        status: true
      }
    };
  },
  created() {
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
      if(this.appdata.status){
        this.init();
      }
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })
  },
  watch: {
    selectsapp: {
      handler(value) {
        if (value.length == this.application.length) {
          this.appsall = true;
        } else {
          this.appsall = false;
        }
      },
      deep: true,
    },
    selects: {
      handler(value) {
        if (value.length == this.Interface.length) {
          this.appsalls = true;
        } else {
          this.appsalls = false;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    dynamicData() {
      let result = {
        config: {},
        routerslist: [],
      };
      return result;
    },
    policy_tree() {
      return this.$auth("policy.alltree") ? policy_alltree : policy_tree;
    },
  },
  authorize: {
    addlist: "policy.add",
    addlists: "policy.edit",
    save: "policy.edit",
    deletestrategy: "policy.delete",
  },
  methods: {
    // 接口保存
    save() {
      var data = {
        id: this.detailes.id,
        name: this.detailes.name,
        title: this.detailes.title,
        routes: this.selects,
        applications: this.selectsapp,
        organization: this.sites,
        parent: this.parent,
      };
      policy_edit(data)
        .then(() => {
          this.$message.success("保存成功");
          this.selectlist(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点选接口
    onChange(checkedValues) {
      this.selects = checkedValues;
    },
    // 点选应用
    onChangeapp(checkedValues) {
      this.selectsapp = checkedValues;
    },
    // 页面加载
    init() {
      Promise.all([
        organization_tree(), //站点树
        form_get({ name: "policy_add" }),
        application_list(),
      ])
        .then((res) => {
          this.organizations = res[0].data.data;
          this.sites = this.organizations.length
            ? this.organizations[0].id
            : undefined;
          this.policy_tree({ organization: this.sites })
            .then((Response) => {
              console.log('Response,',Response)
              this.routerstree = Response.data.data;
              this.dynamicData.routerslist = Response.data.data;
              if (this.routerstree.length) {
                this.selectlist(this.routerstree[0]);
              } else {
                this.channelselectedKeys = [];
                this.channelexpandedKeys = [];
              }
              console.log('this.routers',this.routerstree)
            })
            .catch((err) => {
              console.log("err", err);
              this.$message.error(err.Response.data.message);
            });
          this.jsonData = res[1].data.data.form;
          this.applist = res[2].data.data;
          this.application = [];
          this.applist.filter((items) => {
            this.application.push(items.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刷新
    inits(siteid, {policyid, parent}) {
      if (siteid) {
        this.policy_tree({ organization: siteid })
          .then((Response) => {
            this.routerstree = Response.data.data;
            this.dynamicData.routerslist = Response.data.data;
            if (this.routerstree.length && policyid) {
              this.selectlist({id: policyid});
            } else {
              this.selectlist(this.routerstree[0])
              this.channelselectedKeys = [];
              this.channelexpandedKeys = [];
            }
          })
          .catch((err) => {
            console.log("err", err);
            this.$message.error(err.Response.data.message);
          });
      }else{

      }
    },
    // 站点选择
    handleChanges(selectedKeys, value, e) {
      this.sites = selectedKeys;
      this.policy_tree({ organization: this.sites })
        .then((Response) => {
          this.routerstree = Response.data.data;
          this.dynamicData.routerslist = Response.data.data;
          if (this.routerstree.length) {
            this.selectlist(this.routerstree[0]);
          } else {
            // this.$message.warning("当前站点下暂无策略！");
            this.channelselectedKeys = [];
            this.channelexpandedKeys = [];
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.Response.data.message);
        });
    },
    onRightClickchannel({ event, node }) {
      event.stopPropagation();
      let record = node.$options.propsData.dataRef;
      if (!record.dir) {
        this.$contextmenu({
          items: [
            {
              label: "添加策略",
              // icon: "el-icon-printer",
              onClick: () => {
                this.addlist(record);
              },
            },
            {
              label: "编辑策略",
              // icon: "el-icon-printer",
              onClick: () => {
                this.addlists(record);
              },
            },
          ],
          event,
          customClass: "class-a",
          zIndex: 6000,
          minWidth: 230,
        });
        return false;
      }
    },
    // 点选
    selectlist(item) {
      console.log('item',item)
      // this.parent = item.parent;
      this.spinning = true;
      this.appsalls = false;
      this.appsall = false;
      this.activeKeys = [];
      this.channelselectedKeys = [item.id];
      this.channelexpandedKeys = [item.id];
      policy_get({ id: item.id })
        .then((res) => {
          console.log('rereres',res)
          this.detailes = res.data.data;
          this.parent = this.detailes.parent
          this.selects = this.detailes.routes;
          this.selectsapp = this.detailes.applications;
          if (this.detailes.title == "超级管理员") {
            this.apps = [];
            this.administer = false;
          } else {
            policy_routes({ authkeys: ["GateWayKey"],public: false, id: item.id }).then(
              (Response) => {
                this.apps = Response.data.data;
                this.Interface = [];
                this.apps.filter((items) => {
                  this.activeKeys.push(items._id);
                  items.records.filter((ins) => {
                    this.Interface.push(ins.parent);
                  });
                });
                this.administer = true;
              }
            );
          }
          setTimeout(() => {
            this.activeKey = this.activeKeys;
            this.spinning = false;
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 弹窗
    addlist(record) {
      this.visible = true;
      this.strateId = null;
      this.methods = policy_add;
      this.formsdatas = {};
      if (record) {
        this.$nextTick(() => {
          this.$refs.form.setData({
            parent: record.id,
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.form.reset();
        });
      }
    },
    addlists(data) {
      this.methods = policy_edit;
      this.strateId = data.id;
      this.formsdatas = data;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.setData({
          name: data.name,
          title: data.title,
          parent: data.parent,
        });
      });
    },
    // 策略增编提交
    onOk() {
      this.visible = true;
      this.okloading = true;
      this.$refs.form
        .getData()
        .then((res) => {
          var dataa = Object.assign(this.formsdatas, {
            id: this.strateId,
            name: res.name,
            title: res.title,
            organization: this.sites,
            parent: res.parent,
          });
          this.methods(dataa)
            .then((res) => {
              this.$refs.form.reset();
              this.okloading = false;
              this.visible = false;
              // this.init();
              this.inits(this.sites,{ policyid: this.channelselectedKeys[0]})
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message)
              this.okloading = false;
            });
        })
        .catch((err) => {
          console.log(err);
          this.okloading = false
        });
    },
    // 删除
    deletestrategy(id) {
      let ids = [id];
      let that = this;
      this.$confirm({
        title: "确定要删除此策略吗?",
        content: "删除后该用户组用户无法登录(需要重新设置用户组)",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          policy_delete({ ids: ids })
            .then((res) => {
              console.log("res", res);
              that.inits(that.sites,{})
            })
            .catch((err) => {
              console.log("err", err);
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    selectAll(data) {
      if (data[0].id) {
        if (this.appsall) {
          this.selectsapp = this.application;
        } else {
          this.selectsapp = [];
        }
      } else {
        if (this.appsalls) {
          this.selects = this.Interface;
        } else {
          this.selects = [];
        }
      }
    },
    collapseclick(event) {
      let title = event.target.defaultValue;
      event.stopPropagation();
      const grentss = [];
      this.apps.filter((items) => {
        if (items._id == title) {
          items.records.filter((ins) => {
            grentss.push(ins.parent);
          });
        }
      });
      this.selects = [...this.selects, ...grentss];
    },
    openAll() {
      if (this.openAlls) {
        this.activeKey = this.activeKeys;
      } else {
        this.activeKey = [];
      }
    },
    onTreeSelect(key, e) {
      var currData = e.node.$options.propsData.dataRef;
      if (e.selected) {
        this.channelselectedKeys = key;
        this.channelexpandedKeys = key;
        this.selectlist(currData);
      } else {
        this.channelselectedKeys = [];
        this.channelexpandedKeys = [];
      }
    },
    onExpand(expandedKeys, info) {
      if (info.expanded) {
        this.channelexpandedKeys = [];
      } else {
        this.channelexpandedKeys = [expandedKeys];
      }
    },
  },
};
</script>

<style>
.lists {
  height: calc(100% - 0px);
  border-right: 1px solid #d9d9d9;
  background: #f0f8ff;
  box-shadow: 2px 2px 10px #d9d9d9;
}
.detailes {
  height: 100%;
  /* overflow-y: auto; */
}
.lists li {
  cursor: pointer;
  border-radius: 5px;
}
.apps_checks {
  border: 1px solid #ccc;
  padding: 3px 8px;
  margin: 4px 8px;
}

.header_title_s {
  padding: 20px;
  min-height: 80px;
}
.header_title_s .ant-popover-inner-content {
  padding: 0;
}
.ant-spin-container {
  height: 100%;
}
</style>
<style scoped>
.administer_roll {
  height: calc(100% - 80px);
  padding: 20px 20px 0;
  width: 100%;
  overflow-y: auto;
}
.administer_roll .ant-collapse-header {
  background: #f0f8ff;
}
.contents {
  width: 100%;
  text-align: left;
  background: #f0f8ff;
  padding: 10px 20px;
  box-shadow: 2px 0px 5px #d9d9d9;
}
.draggable-trees {
  height: calc(100% - 105px);
  width: 100%;
}
.draggable-trees >>> li {
  white-space: pre-line;
}
.draggable-trees >>> .ant-tree-node-content-wrapper,
.draggable-trees >>> .ant-tree-node-content-wrapper-normal {
  height: auto !important;
}
.channel-tree-item {
  display: flex;
}
.channel-tree-item_left {
  width: calc(100% - 30px);
}
.channel-tree-item >>> .icon_more {
  width: 30px;
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>
