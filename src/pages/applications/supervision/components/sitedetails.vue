<template>
  <div class="mainess">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="7" style="height: 100%">
        <div class="colees leftss">
          <a-avatar icon="user" :size="106" />
          <div class="leftss_title">{{ sitedatas.title }}</div>
          <div class="task_cont">
            <div class="task_cont_left">
              <div>进行中任务</div>
              <div class="task_count">{{ sourcedata.false }}</div>
            </div>
            <div class="task_cont_right">
              <div>已完成任务</div>
              <div class="task_count">{{ sourcedata.true }}</div>
            </div>
          </div>
        </div>
        <div class="colees leftss_t">
          <a-row :gutter="24">
            <a-col :span="12">
              <div class="leftss_t_title">任务完成度</div>
            </a-col>
            <a-col :span="12">
              <div class="leftss_t_cont">
                {{ sourcedata.true + "/" + sourcedata.total }}
              </div>
            </a-col>
          </a-row>
          <div class="leftss_t_progress">
            <mini-progress
              :target="100"
              :percent="((sourcedata.true / sourcedata.total) * 100).toFixed(2)"
              class="mini-progresses"
              color="#13C2C2"
              height="12px"
            />
          </div>
        </div>
        <!-- <div class="colees leftss_th">class=""</div> -->
      </a-col>
      <a-col :span="17" style="height: 100%">
        <div class="colees rightss">
          <a-tabs
            v-model="finish"
            @change="callback"
            :tabBarStyle="{ height: '64px' }"
          >
            <a-tab-pane
              v-for="item in takslist"
              :key="item.value"
              :tab="item.name"
            >
              <a-table
                class="task_tables"
                :columns="columns"
                :loading="loading"
                size="middle"
                :rowKey="(record, index) => record._id + index"
                :indentSize="30"
                :pagination="false"
                :dataSource="datas.items"
              >
                <span slot="titles" slot-scope="text, record">
                  <div style="display: inline-grid" class="postsa">
                    <div
                      style="position: absolute; text-align: left; top: 8px"
                      v-if="record.site.parent == null && record.count > 0"
                    >
                      <span class="sanjiao"></span>
                      <span class="shuzi">{{ record.count }}</span>
                    </div>
                    <div
                      class="table_titles locatoins"
                      @click="todetailes(record)"
                    >
                      {{ record.title }}
                    </div>
                    <div
                      class="table_contents"
                      v-if="record.types !== '删改型'"
                    >
                      {{ record.content }}
                    </div>
                    <div class="table_contents" v-else></div>
                  </div>
                </span>
                <span slot="progress" slot-scope="text, record">
                  <a-progress
                    style="padding: 0 10px"
                    :percent="record.compute.toFixed(2) * 100"
                  />
                </span>
                <span slot="result" slot-scope="text, record">
                  {{ record.finish + "/" + record.taskload }}
                </span>
              </a-table>
              <a-pagination
                size="small"
                class="paginations"
                @change="changepage"
                :current="pagination.page"
                :pageSize="pagination.per_page"
                @showSizeChange="changepage"
                :pageSizeOptions="pageSizeOptions"
                :total="datas.total"
                show-size-changer
                show-quick-jumper
                :show-total="(total) => `共 ${total} 条`"
              ></a-pagination>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { risk_paginate, risk_finish } from "@/services/supervision";
import { organization_get } from "@/services/organization";
import MiniProgress from "@/components/chart/MiniProgress";

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
  components: {
    MiniProgress,
  },
  data() {
    return {
      id: "",
      finish: "1",
      compute: undefined,
      takslist: [
        { name: "未完成任务", value: "1" },
        { name: "已完成任务", value: "2" },
      ],
      datas: {},
      columns: [
        {
          title: "任务标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titles" },
          width: "50%",
          paddingLeft: "50px",
          align: "left",
        },
        {
          title: "站点进度",
          width: 300,
          dataIndex: "progress",
          scopedSlots: { customRender: "progress" },
          align: "center",
          filters: [
            {
              text: "升序",
              value: "ascend",
            },
            {
              text: "降序",
              value: "descend",
            },
          ],
          filterMultiple: false,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "执行结果",
          dataIndex: "result",
          scopedSlots: { customRender: "result" },
          align: "center",
        },
      ],
      loading: true,
      pageSizeOptions: ["5", "10", "15", "20"],
      sourcedata: {},
      sitedatas: {},
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.datas.page || 1,
          per_page: this.datas.per_page || 5,
          total: this.datas.total || 0,
        };
      },
      set(val) {
        this.datas.page = val.page || 0;
        this.datas.per_page = val.per_page || 5;
        this.datas.total = val.total || 0;
      },
    },
  },
  created() {
    console.log("params", this.params);
    this.id = this.params.site;
    this.inits();
  },
  methods: {
    inits() {
      // 站点任务分页
      risk_paginate(
        Object.assign(this.pagination, {
          sites: [this.id],
          finish: this.finish == "1" ? false : true,
        })
      )
        .then((res) => {
          this.datas = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      risk_finish({ site: this.id })
        .then((rese) => {
          this.sourcedata = rese.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      organization_get({ id: this.id })
        .then((rees) => {
          this.sitedatas = rees.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadDataSrouce() {
      this.loading = true;
      risk_paginate(
        Object.assign(this.pagination, {
          sites: [this.id],
          finish: this.finish == "1" ? false : true,
          compute: this.compute,
        })
      )
        .then((res) => {
          console.log("res", res);
          this.datas = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changessorts(e, filters) {
      console.log("filters", filters);
      for (var i in filters) {
        if (filters[i].length) {
          if (i == "progress") {
            this.compute = filters[i][0] == "ascend" ? 1 : -1;
          }
        }
      }
      this.$nextTick(() => {
        this.loadDataSrouce();
      });
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loadDataSrouce();
    },
    // 任务详情
    todetailes(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: record.types == "删改型" ? "taskdetailes2" : "taskdetailes",
          params: {
            data: record,
            router: "sitedetails",
            site: this.id,
          },
        },
      });
    },
    callback(e) {
      console.log("e", e);
      this.pagination.page = 1;
      this.pagination.per_page = 5;
      this.inits();
    },
  },
};
</script>
<style scoped>
.rightss >>> .ant-tabs-nav {
  height: 64px !important;
  line-height: 46px !important;
  /* font-size: 16px; */
}

.task_tables >>> .ant-table-body {
  margin: 0 !important;
}

.task_tables >>> .ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.task_tables >>> .ant-table-thead > tr > th,
.task_tables >>> .ant-table-tbody > tr > td,
.task_tables >>> .ant-table-tbody > tr {
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
.task_tables >>> .ant-table-row {
  height: 80px !important;
}
.toop {
  max-width: 500px;
}
.postsa {
  position: relative;
}
.task_tables >>> .ant-table .ant-table-row-indent + .ant-table-row-expand-icon {
  margin-left: 30px;
  z-index: 2;
}
.postsa .sanjiao {
  width: 0;
  height: 0;
  border-top: 35px solid #1890ff;
  border-right: 35px solid transparent;
  border-top: 35px solid #1890ff;
  border-right: 35px solid transparent;
  float: left;
  margin-top: -25px;
  margin-left: -63px;
}
.postsa .shuzi {
  position: absolute;
  left: -58px;
  top: -25px;
  color: #ffffff;
  font-size: 12px;
  width: 20px;
}
</style>
<style scoped lang="less">
.mainess {
  height: 100%;
  overflow: auto;
  background: #f0f2f5;
  padding: 24px;
  .colees {
    background: #fff;
  }
  .leftss {
    height: calc(70% - 24px);
    text-align: center;
    padding-top: 100px;
    .leftss_title {
      margin: 25px auto;
      font-size: 20px;
      font-family: PingFang SC;
      text-align: center;
      color: rgba(0, 0, 0, 0.85);
    }
    .task_cont {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: auto;
      font-size: 18px;
      color: #00000073;
      height: calc(100% - 220px);
      .task_cont_left {
        width: 50%;
        border-right: 1px solid #e9e9e9;
      }
      .task_cont_right {
        width: 50%;
      }
      .task_count {
        font-size: 30px;
        font-family: HelveticaNeue;
        text-align: center;
        color: rgba(0, 0, 0, 0.85);
        line-height: 38px;
      }
    }
  }
  .leftss_t {
    height: 30%;
    margin-top: 24px;
    padding: 30px 22px;
    .leftss_t_title {
      font-size: 16px;
      font-family: PingFangSC-Regular;
      text-align: left;
      color: rgba(0, 0, 0, 0.45);
    }
    .leftss_t_cont {
      font-size: 24px;
      font-family: HelveticaNeue;
      text-align: right;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
    }
    .leftss_t_progress {
      height: calc(100% - 20px);
      display: flex;
      align-items: center;
    }
  }
  .leftss_th {
    height: calc(30% - 24px);
    margin-top: 24px;
  }
  .rightss {
    height: 100%;
    overflow: auto;
    .ant-tabs-bar {
      border-bottom: 1px solid #d7d7d7 !important;
    }
    .task_tables {
      margin: 20px;
      .table_titles {
        font-size: 15px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.65);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin-bottom: 5px;
        cursor: pointer;
      }
      .locatoins {
        font-size: 14px;
        color: #1890ff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        padding: 0 5px;
        cursor: pointer;
      }
      .table_contents {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .paginations {
      text-align: right;
      padding-right: 20px;
      margin: 20px 0;
      .ant-pagination-item-active {
        background: #1890ff;
        a {
          color: #fff !important;
        }
      }
    }
  }
}
</style>