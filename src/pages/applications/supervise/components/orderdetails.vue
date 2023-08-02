<template>
  <div style="background: #f1f1f1; min-height: 90vh; padding: 20px">
    <!-- 返回 -->
    <div class="title_back">
      <a @click="back"><a-icon type="arrow-left" />返回</a>
    </div>
    <a-card>
      <a-descriptions title="任务详情" layout="horizontal" bordered :column="2">
        <a-descriptions-item>
          <span slot="label" class="name">任务名称</span>
          {{ datas.title }}
        </a-descriptions-item>
        <a-descriptions-item>
          <span slot="label" class="name">站点</span>
          {{ site.title }}
        </a-descriptions-item>
        <a-descriptions-item>
          <span slot="label" class="name">应用</span>
          {{ app.title }}
        </a-descriptions-item>
        <a-descriptions-item>
          <span slot="label" class="name">类型</span>
          {{ typelist[datas.genre] }}
        </a-descriptions-item>
        <!-- 周期任务 -->
        <template v-if="datas.genre == 1">
          <a-descriptions-item>
            <span slot="label" class="name">任务属性</span>
            {{ statuslist[status] }}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">发文量</span>
            <a-badge
              :count="number"
              :number-style="{ backgroundColor: '#52c41a' }"
            />
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">周期类型</span>
            {{ periodlist[period] }}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">目录</span>
            {{ channel }}
          </a-descriptions-item>
          <a-descriptions-item :span="2">
            <span slot="label" class="name">备注</span>
            {{ remark }}
          </a-descriptions-item>
            <a-descriptions-item>
            <span slot="label" class="name">完成度</span>
            <a-progress
              style="width: 50%"
              :percent="(_extension.index / _extension.finish) * 100"
              :format="(percent) => `${_extension.index}/${_extension.finish}`"
              :stroke-color="{
                from: '#108ee9',
                to: '#87d068',
              }"
              status="active"
            />
          </a-descriptions-item>
        </template>
        <!-- 时间范围任务 -->
        <template v-if="datas.genre == 2">
          <a-descriptions-item>
            <span slot="label" class="name">任务属性</span>
            {{ statuslist[status] }}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">发文量</span>
            <a-badge
              :count="number"
              :number-style="{ backgroundColor: '#52c41a' }"
            />
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">时间范围</span>
            <a-range-picker
              style="border: none"
              :default-value="date"
              disabled
            />
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">目录</span>
            {{ channel }}
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">完成度</span>
            <a-progress
              style="width: 50%"
              :percent="(_extension.index / _extension.finish) * 100"
              :format="(percent) => `${_extension.index}/${_extension.finish}`"
              :stroke-color="{
                from: '#108ee9',
                to: '#87d068',
              }"
              status="active"
            />
          </a-descriptions-item>
        </template>
        <!-- 指派任务 -->
        <template v-if="datas.genre == 3">
          <a-descriptions-item>
            <span slot="label" class="name">时间范围</span>
            <a-range-picker
              style="border: none"
              :default-value="date"
              disabled
            />
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">完成度</span>
            <a-progress
              style="width: 90%"
              :stroke-color="{
                from: '#108ee9',
                to: '#87d068',
              }"
              :percent="extension(_extension)"
              status="active"
            />
          </a-descriptions-item>
          <a-descriptions-item>
            <span slot="label" class="name">备注</span>
            {{ remark }}
          </a-descriptions-item>
        </template>
      </a-descriptions>
      <!-- 指定任务 -->
      <template v-if="datas.genre == 3">
        <a-list
          style="background: #f0f0f0; padding: 20px"
          :grid="{ gutter: 16, column: 4 }"
          :data-source="datas._extension.appoints"
          :pagination="pagination"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :title="item.title" style="text-align: center">
              <a-progress
                class="progress"
                :percent="progressitem(item)"
                size="small"
                :show-info="false"
              />
              <template slot="actions" class="ant-card-actions">
                <span key="setting" v-if="item.index == 0">
                  <a-popconfirm
                    title="您确定要提交审核此任务吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="check(item)"
                  >
                    <a style="color: #1890ff">提交审核</a>
                  </a-popconfirm>
                </span>
                <span key="ellipsis" v-if="item.index == 1">
                  <a-popconfirm
                    title="您确定任务审核通过吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="examine(item, 2)"
                  >
                    <a style="color: #1890ff">审核通过</a>
                  </a-popconfirm>
                </span>
                <span key="keys" v-if="item.index == 1">
                  <a-popconfirm
                    title="您确定要撤销此任务吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="examine(item, 0)"
                  >
                    <a style="color: #1890ff">撤销</a>
                  </a-popconfirm>
                </span>
                <span key="keps" class="spanshover" v-if="item.index == 2">
                  已完成
                </span>
              </template>
            </a-card>
          </a-list-item>
        </a-list>
      </template>
      <!-- 时间范围 -->
      <template v-if="datas.genre == 2">
        <a-list
          style="background: #f0f0f0; padding: 20px"
          :grid="{ gutter: 16, column: 4 }"
          :data-source="datas._extension.result"
          :pagination="pagination"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card
              :title="item.site + '：' + item.title"
              style="text-align: center"
            >
              <a-progress
                :percent="(item.doc_count / number) * 100"
                type="circle"
                :format="(percent) => `${item.doc_count}/${number}`"
                class="progress"
              />
            </a-card>
          </a-list-item>
        </a-list>
      </template>
      <!-- 周期 -->
      <template v-if="datas.genre == 1">
        <a-list
          style="background: #f0f0f0; padding: 20px"
          :grid="{ gutter: 16, column: 4 }"
          :data-source="datas._extension.result"
          :pagination="pagination"
        >
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card  style="text-align: center">
              <span slot="title">
                <p>
                  第{{ sorts(index) }}{{ periodlist[period].substring(1, 2) }}
                </p>
                <a-popover v-if="item.result.length">
                  <template slot="content">
                    <div style="max-height:400px; overflow: auto">
                      <p v-for="(i, index) in item.result" :key="index" :style="{color: i.doc_count >= number ? 'green' : i.doc_count > 0 ? 'orange' : '' }">
                        <span> {{ i.site }}站点 </span>
                        <span> {{ i.title }}目录 </span>
                        <span> 发布了{{ i.doc_count }}篇文章 </span>
                      </p>
                    </div>
                  </template>
                  <a-progress
                    :percent="(item.index / item.finish) * 100"
                    type="circle"
                    :format="(percent) => `${item.index}/${item.finish}`"
                  />
                </a-popover>
                <a-progress
                  v-else
                  :percent="(item.index / item.finish) * 100"
                  type="circle"
                  :format="(percent) => `${item.index}/${item.finish}`"
                />
              </span>
              <p>
                周期范围：{{ item.start.substring(0, 10) }} ~
                {{ item.end.substring(0, 10) }}
              </p>
            </a-card>
          </a-list-item>
        </a-list>
      </template>
    </a-card>
  </div>
</template>
<script>
import { missionget, finish, check } from "@/services/supervise";
export default {
  data() {
    return {
      id: "",
      rules: {},
      app: {},
      site: {},
      datas: {},
      // 任务类型
      typelist: {
        1: "周期类型",
        2: "时间范围类型",
        3: "指派类型",
      },
      statuslist: {
        1: "系统任务",
        2: "指派任务",
      },
      periodlist: {
        1: "每周",
        2: "每月",
        3: "每季",
        4: "每年",
      },
      status: 0,
      period: 0,
      number: 0,
      channel: {},
      date: [],
      remark: "",
      statustype: 0,
      statuslists: {
        0: "已完成",
        1: "未执行",
        2: "待审核",
      },
      pagination: {
        onChange: (page) => {
          this.page = page;
        },
        pageSize: 8,
      },
      page: 1,
      _extension: {},
    };
  },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        departments: [],
      };
      // for (let item in this.datapart) {
      //   result.departments.push({
      //     value: this.datapart[item].id,
      //     label: this.datapart[item].title,
      //   });
      // }
      return result;
    },
  },
  created() {
    this.id = this.params.data.id;
    this.init();
  },
  methods: {
    // 显示列表
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    sorts(index) {
      let assr = this.datas._extension.result.length;
      return assr - index - (this.page - 1) * this.pagination.pageSize;
    },
    init() {
      this.list();
    },
    list() {
      //   this.id = this.$route.query.id;
      missionget({
        id: this.id,
      })
        .then((res) => {
          this.datas = res.data.data;
          this.rules = res.data.data.rule;
          this.app = res.data.data.application || {};
          this.site = res.data.data.site || {};
          if (this.datas.genre == 1) {
            this.status = this.datas.status; //任务属性
            this.period = this.rules.period; //周期类型
            this.number = this.rules.number; //发文量
            this.channel = this.rules.channel;
            this.remark = this.rules.remark;
            this._extension = this.datas._extension;
          } else if (this.datas.genre == 2) {
            this.status = this.datas.status;
            this.date = [this.rules.start, this.rules.end];
            this.number = this.rules.number;
            this.channel = this.rules.channel;
            this.sum = this.datas._extension.index;
            this._extension = this.datas._extension;
            this.remark = this.rules.remark;
          } else if (this.datas.genre == 3) {
            this.date = [this.rules.start, this.rules.end];
            this.remark = this.rules.remark;
            // this.statustype = this.rules.status;
            this._extension = this.datas._extension;
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message)
          console.error(error);
        });
    },
    // 审核
    examine(item, number) {
      finish({
        id: this.id,
        site: item.site,
        status: number,
      })
        .then(() => {
          this.$message.success("操作完成！");
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 提交审核
    check(item) {
      check({
        id: this.id,
        site: item.site,
      })
        .then(() => {
          this.$message.success("操作完成！");
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    extension(data) {
      let n = 0;
      n = parseInt(((data.index / data.finish)* 100).toFixed(2));
      return n;
    },
    progressitem(item) {
      if (item.index == 0) {
        return 0;
      } else if (item.index == 1) {
        return 50;
      } else {
        return 100;
      }
    },
    back() {
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
<style>
/* .ant-descriptions-item-label {
  font-weight: 800;
  font-size: 16px;
  width: 160px;
} */
.ant-descriptions-item-content {
  font-weight: 600;
  font-size: 14px;
}
.name {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
}
</style>
<style scoped>
.progress {
  margin: 20px 0;
}
.progress >>> .ant-progress-bg {
  height: 20px !important;
  border-radius: 0 !important;
}
.progress >>> .ant-progress-inner,
.ant-progress-outer {
  border-radius: 0 !important;
}
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
<style lang="less" scoped>
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>