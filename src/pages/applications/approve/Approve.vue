<template>
  <a-card>
    <a-page-header>
      <template slot="extra">
        <a-button
          type="primary"
          icon="reload"
          :loading="loading"
          @click="onReload"
        >
          刷新
        </a-button>
        
        <a-button
          type="primary"
          icon="check"
          :loading="loading"
          @click="onSubmit"
        >
          提交保存
        </a-button>
      </template>
    </a-page-header>
    <div v-if="channel" style="width: 100%;">
      <a-select
        mode="multiple"
        style="width: 40%;"
        placeholder="请选择目录"
        :labelInValue="true"
        v-model="selected"
        :default-value="[
          {
            label: record.title,
            value: record.id,
          },
        ]"
      >
        <a-select-option v-for="item in channels" :key="item.id">
          {{ item.title }}
        </a-select-option>
      </a-select>
      <a-button type="primary" style="width: 10%;">
        <a-checkbox
          style="padding-rigth:5px;font-size:14px;color:#fff"
          v-model="ismap"
          @change="onMapChange"
        >
          选择映射目录
        </a-checkbox>
      </a-button>
    </div>
    <a-space style="padding-top:15px;">
      <a-button type="primary" @click="onAddFlow" :loading="loading" v-if="$auth('approve.add')">
        添加流程
      </a-button>
    </a-space>

    <div style="margin-top:15px;">
      <a-alert type="info" show-icon>
        <div slot="message">
          关于步骤条件的说明:
        </div>
        <div slot="description">
          按顺序执行审核流程。
        </div>
      </a-alert>
      <a-table :columns="columns" :data-source="dataSource">
        <span slot="label" slot-scope="text">
          {{ text }}
        </span>
        <!-- 选择模式 -->
        <span slot="model" slot-scope="text, record">
          <a-select v-model="record.model" style="width: 100%;">
            <template v-for="i in models">
              <a-select-option :key="i.value">
                <span> {{ i.label }}</span>
              </a-select-option>
            </template>
          </a-select>
        </span>

        <span slot="flow" slot-scope="text, record">
          <!-- 选择站点 -->
          <a-tree-select
            tree-default-expand-all
            :disabled="!record.model"
            v-model="record.site"
            style="width: 20%;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择审核人员"
            :replaceFields="{
              value: 'id',
              key: 'id',
            }"
            @change="onTreeDataChange"
          >
          </a-tree-select>
          <!-- 选择用户 -->
          <a-select
            :disabled="!record.site"
            style="width: 80%;"
            mode="multiple"
            :max-tag-count="10"
            v-model="record.users"
          >
            <template v-for="item in site_users">
              <a-select-option :key="item.id">
                <span> {{ item.realname }}</span>
              </a-select-option>
            </template>
          </a-select>
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a style="font-size:18px;" @click="onClear(index)"
            ><a-icon type="minus-circle"
          /></a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>
<script>
import { channel_maps } from "@/services/content";
import { organization_get, organization_tree } from "@/services/organization";
import { user_list } from "@/services/user";
import { approve_add, approve_multiadd } from "@/services/approve";

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {
      loading: false,
      isChannel: false,
      checkVisible: false,
      current_site_id: null,
      current_site: {},
      site: null,
      channel: null,
      ismap: false,
      record: {},
      sites: [],
      channels: [],
      columns: [
        {
          title: "步骤条件",
          dataIndex: "model",
          key: "model",
          width: 160,
          scopedSlots: { customRender: "model" },
        },
        {
          title: "审核人员",
          dataIndex: "flow",
          key: "flow",
          scopedSlots: { customRender: "flow" },
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          scopedSlots: { customRender: "action" },
        },
      ],
      models: [
        {
          label: "任意人员审核",
          value: 0,
        },
        {
          label: "共同审核",
          value: 1,
        },
        {
          label: "单独审核",
          value: 2,
        },
      ],
      selected: [],
      dataSource: [],
      treeData: [],
      select_sites: [],
      site_users: [],
      users: [],
      select_site: [],
      select_users: {},
      flow_users: [],
      percent: 0,
      timer: null,
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.isChannel = this.data.isChannel;
      this.record = this.data.params;
      this.current_site_id = this.data.site;
      if (this.isChannel) {
        this.channel = this.record.id;
      } else {
        this.site = this.record.id;
      }
      this.loading = false;
      Promise.all([
        this.getMaps(),
        organization_get({
          id: this.current_site_id,
        }),
        organization_tree({
          id: this.current_site_id,
        }),
      ])
        .then((response) => {
          this.current_site = response[1].data.data;
          this.current_site.children = response[2].data.data;
          this.treeData = [this.current_site];
          this.getOrganizations(this.treeData);
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    onReload() {
      this.loading = true;
      this.onLoad();
    },
    getMaps() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        if (this.isChannel) {
          this.channels = [];
          this.channels.push(this.record);
        } else {
          this.sites = [];
          this.sites.push(this.record);
        }
        if (this.isChannel) {
          if (this.ismap) {
            channel_maps({
              channel: this.channel,
            })
              .then((response) => {
                const channel_maps = response.data.data;

                this.channels = [...this.channels, ...channel_maps];
                this.loading = false;
                resolve(this.channels);
                return;
              })
              .catch((error) => {
                console.log("error", error);
                this.loading = false;
                reject(error);
                return;
              });
          }
        }
        this.loading = false;
        resolve({});
      });
    },
    getOrganizations(record) {
      record.forEach((item) => {
        this.select_sites.push(item);
        if (item.children && item.children.length) {
          this.getOrganizations(item.children);
        }
      });
    },
    onAddFlow() {
      this.dataSource.push({
        site: null,
        users: [],
      });
    },
    onTreeDataChange(e) {
      user_list({
        organization: [e],
      })
        .then((response) => {
          this.site_users = response.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    onClear(record) {
      this.dataSource = this.dataSource.filter((item, index) => {
        return index != record;
      });
    },
    onSubmit() {
      if (this.isChannel && !this.selected.length) {
        this.$message.error("请选择目录");
        return;
      }
      if (!this.dataSource.length) {
        this.$message.error("请添加审批流程");
        return;
      }
      let vild = true;
      let lasd = true;
      this.dataSource.forEach((item) => {
        if (item.model) {
          if (!item.users || !item.users.length) {
            vild = false;
            return;
          }
        } else {
          if(item.model == 0){
            item.model = 0;
            item.ids = [];
          }else{
            lasd = false;
            return;
          }
        }
      });
      if (!vild) {
        this.$message.error("请添加审审核人员");
        return;
      }
      if(!lasd){
        this.$message.warning("请选择步骤条件！")
        return;
      }
      this.loading = true;
      if (this.isChannel) {
        const channels = this.selected.map((item) => item.key);
        let flows = this.dataSource.map((temp) => {
          return {
            model: temp.model,
            ids: temp.users,
          };
        });
        approve_multiadd({
          channels: channels,
          flows: flows,
        })
          .then((response) => {
            this.$message.success(response.data.message);
            this.onLoad();
            this.loading = false;
          })
          .catch((error) => {
            console.log("error", error);
            this.$message.error(error.response.data.message);
            this.loading = false;
          });
        // Promise.all(PromiseAll)
        //   .then(() => {
        //     this.$message.success("操作完成");
        //     this.onLoad()
        //     this.loading = false;
        //   })
        //   .catch((error) => {
        //     console.log("error", error);
        //     this.$message.error("操作失败");
        //     this.loading = false;
        //   });
      } else {
        const formData = {
          site: this.current_site_id,
          flows: this.dataSource.map((temp) => {
            return {
              model: temp.model,
              ids: temp.users,
            };
          }),
        };
        this.loading = false;
        console.log('formData', formData)
        approve_add(formData)
          .then((response) => {
            this.$message.success(response.data.message);
            this.onLoad();
          })
          .catch((error) => {
            this.$message.error(error.response.data.message);
            this.loading = false;
          });
      }
    },
    onMapChange() {
      this.getMaps();
    },
    onVersionChange() {},
  },
};
</script>

<style scoped>
.loading {
  position: absolute;
  background-color: #ccc;
  opacity: 0.55;
  height: 100%;
  width: 100%;
  z-index: 9999;
  text-align: center;
  padding-top: 15%;
}
</style>
