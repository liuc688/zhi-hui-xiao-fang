<template>
  <div class="analysis">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" :title="'访问量'" :total="Status.Views">
          <a-tooltip
            :title="'路由接口全量访问,不包括未通过网关严重的接口'"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend
              style="margin-right: 16px"
              :term="'成功率:'"
              :percent="Status.ViewsPercentage.success"
              :is-increase="false"
              :scale="0"
            />
            <trend
              style="margin-right: 16px"
              :term="'异常率:'"
              :percent="Status.ViewsPercentage.fail"
              :is-increase="true"
              :scale="0"
            />
          </div>
          <div slot="footer">
            <span>{{ "(最近10日)日均访问量" }} ≈ </span>
            <span>{{ Status.DaysPercentage }} / day</span>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          :loading="loading"
          :title="'路由数量'"
          :total="Status.RouteCount"
        >
          <a-tooltip :title="'已注册的路由接口总量'" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :value="Status.WeekRouteCount" />
          </div>
          <div slot="footer">
            <span>(最近10日)日均注册量 ≈ </span>
            <span> {{ Status.DaysRouteCount }} / day</span>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          :loading="loading"
          :title="'文件总量'"
          :total="Status.FileCount"
        >
          <a-tooltip :title="'系统资源文件总数量'" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :value="Status.WeekFileAddCount" />
          </div>
          <div slot="footer">
            <span>文件总大小 ≈ </span>
            <span>{{ Math.round(Status.FileSize / 1024 / 1024) }} / MB</span>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          :loading="loading"
          :title="'数据增量'"
          :total="Status.LogsCount"
        >
          <a-tooltip
            :title="'增量接口的访问总数,包含添加/编辑/删除,下边是增量路由(访问量/全部访问量)的占比'"
            slot="action"
          >
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress
              :target="100"
              :percent="(Status.LogsCount / Status.Views) * 100"
              color="rgb(58 161 255)"
              height="8px"
            />
          </div>
          <div slot="footer" style="white-space: nowrap; overflow: hidden">
            <trend
              style="margin-right: 16px"
              :term="'(最近10日)增长占比 ≈ '"
              :percent="Math.round((Status.DaysLogs / Status.LogsCount) * 100)"
              :is-increase="true"
              :scale="0"
            />
          </div>
        </chart-card>
      </a-col>
    </a-row>
    <a-card>
      <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="(最近10日)访问排行">
            <bar :value="Status.ViewsRanking" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="(最近10日)访问量" force-render>
            <bar :value="Status.RoutesRanking" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
        <ranking-list title="(最近10日)异常排行" :list="Status.FailRanking" />
      </a-col>
    </a-card>
  </div>
</template>

<script>
import ChartCard from "@/components/card/ChartCard";
import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import Trend from "@/components/chart/Trend";
import Bar from "@/components/chart/Bar";
import RankingList from "@/components/chart/RankingList";
import { systemstatus_get } from "@/services/systemstatus";

export default {
  data() {
    return {
      loading: true,
      Status: {
        Views: 0,
        ViewsPercentage: {
          success: 0,
          fail: 0,
        },
        DaysPercentage: 0,
        RouteCount: 0,
        WeekRouteCount: [],
        DaysRouteCount: 0,
        FileCount: 0,
        WeekFileAddCount: 0,
        LogsCount: 0,
        DaysLogs: 0,
        ViewsRanking: [],
        RoutesRanking: [],
        FailRanking: [],
      },
    };
  },
  created() {
    this.onLoad();
  },
  components: {
    Trend,
    Bar,
    RankingList,
    MiniProgress,
    MiniBar,
    MiniArea,
    ChartCard,
  },
  methods: {
    onLoad() {
      this.loading = true;
      Promise.all([
        systemstatus_get({
          statusType: "Views",
        }),
        systemstatus_get({
          statusType: "ViewsPercentage",
        }),
        systemstatus_get({
          statusType: "DaysPercentage",
        }),
        systemstatus_get({
          statusType: "RouteCount",
        }),
        systemstatus_get({
          statusType: "WeekRouteCount",
        }),
        systemstatus_get({
          statusType: "DaysRouteCount",
        }),
        systemstatus_get({
          statusType: "FileCount",
        }),
        systemstatus_get({
          statusType: "WeekFileAddCount",
        }),
        systemstatus_get({
          statusType: "FileSize",
        }),
        systemstatus_get({
          statusType: "LogsCount",
        }),
        systemstatus_get({
          statusType: "DaysLogs",
        }),
        systemstatus_get({
          statusType: "ViewsRanking",
        }),
        systemstatus_get({
          statusType: "RoutesRanking",
        }),
        systemstatus_get({
          statusType: "FailRanking",
        }),
      ])
        .then((response) => {
          console.log('response',response)
          this.$nextTick(() => {
            this.Status.Views = response[0].data.data.count;
            this.Status.ViewsPercentage = response[1].data.data;
            this.Status.DaysPercentage = response[2].data.data.count;
            this.Status.RouteCount = response[3].data.data.count;
            this.Status.WeekRouteCount = response[4].data.data;
            this.Status.DaysRouteCount = response[5].data.data.count;
            this.Status.FileCount = response[6].data.data.count;
            this.Status.WeekFileAddCount = response[7].data.data;
            this.Status.FileSize = response[8].data.data.count;
            this.Status.LogsCount = response[9].data.data.count;
            this.Status.DaysLogs = response[10].data.data.count;
            this.Status.ViewsRanking = response[11].data.data;
            this.Status.RoutesRanking = response[12].data.data;
            this.Status.FailRanking = response[13].data.data.map((item) => {
              return {
                name: item.record,
                total: item.count,
              };
            });
            this.loading = false;
          });
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}
@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}
@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}
</style>
