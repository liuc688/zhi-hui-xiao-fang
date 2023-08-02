<template>
  <component
    :is="type"
    :id="layerid"
    style="width: 100%"
    :name="lydata.name"
    :router="router"
    :data="lydata.data"
    @refresh="lydata.refresh"
    @open="lydata.open"
    :key="layerid"
    :appid="lydata.appid"
  ></component>
</template>

<script>
import Router from './router';
import Application from './application';
import Viframe from './viframe';
import loading from './loading';
import UserInfo from './userinfo';
import Forms from './forms';
import Organization from './organizations';
import Policy from './policy';
import Content from './content';
import Templates from './templates';
import Opinion from './opinion';
import DictMap from './dictmap';
import Email from './email';
import Inquire from './inquire';
import Order from './order';
import Survey from './survey';
import Public from './publics';
import Bidding from './bidding';
import Know from './know';
import Exchange from './exchange';
import Repository from './repository';
import Bookings from './bookings';
import Risk from './risk';
import RiskDetail from './riskdetail';
import RiskRequestDetail from './riskrequestdetail';

import TaskHandle from './taskhandle';
import ClassRoom from './classroom';
import Sample from './sample';
import Report from './report';
import Analysis from './analysis';
import Gateway from './gateway';
import Rumor from './rumor';

import Knowledge from './knowledge';
import Examing from './examing';
import Message from './message';
import MessageDetails from './messagedetails';
import ScheduleDetails from './scheduledetails';
import Supervise from './supervise';
import Supervision from './supervision';

import Evaluation from './evaluation';
import Project from './project';
import Human from './human';
import DictMapResource from './DictMapResource';
import Document from './document';
import Approve from './approve';
import Approved from './approved';
import Approves from './approves';
import Corpus from './corpus';
import infofilling from './infofilling';
import online from './online';
import Datacenter from './datacenter';
import database from './database';
import SMStemplate from './SMStemplate';
import internshiptest from './internshiptest';
import usenote from './usenote';
export default {
  name: 'applications',
  components: {
    Router,
    Application,
    Gateway,
    Bookings,
    Viframe,
    loading,
    UserInfo,
    Forms,
    Organization,
    Policy,
    Content,
    Templates,
    Opinion,
    DictMap,
    Email,
    Inquire,
    Order,
    Survey,
    Public,
    Bidding,
    Know,
    Exchange,
    Repository,
    Risk,
    RiskDetail,
    RiskRequestDetail,
    TaskHandle,
    ClassRoom,
    Sample,
    Report,
    Rumor,
    Knowledge,
    Examing,
    Message,
    MessageDetails,
    ScheduleDetails,
    Supervise,
    Supervision,
    Analysis,
    Evaluation,
    Project,
    Human,
    DictMapResource,
    Document,
    Approve,
    Approved,
    Approves,
    Corpus,
    infofilling,
    online,
    Datacenter,
    database,
    SMStemplate,
    usenote,
    internshiptest,
  },
  props: {
    layerid: {
      type: String,
    },
    lydata: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    type() {
      switch (this.lydata.type) {
        case 'router':
          return 'viframe';
        case 'iframe':
          return 'viframe';
        default:
          return this.lydata.router;
      }
    },
    router() {
      return this.lydata.type === 'router' ? `#/loading?path=${this.lydata.router}&id=${this.layerid}` : this.lydata.router;
    },
  },
  created() {
    console.log('lydata', this.lydata);
    console.log('layerid', this.layerid);
  },
};
</script>
