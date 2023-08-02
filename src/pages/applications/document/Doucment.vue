<template>
  <a-card>
    <div v-if="id">
      <a-page-header :title="`标题：${record.title}`">
        <template slot="extra">
          <template v-if="!verified && step.length">
            <a-button key="reject" type="danger" icon="rollback" @click="onReject" v-if="$auth('approved.verify')">驳回</a-button>
            <a-button key="resolve" type="primary" icon="check" v-if="$auth('approved.verify')" @click="onResolve">审核</a-button>
          </template>
          <template v-else>
            <a-button key="revoke" type="danger" v-if="record.status && $auth('approved.revoke')" icon="check" @click="onRevoke">撤销</a-button>
          </template>
          <a-button key="reload" type="primary" icon="reload" :loading="loading" @click="onLoad">刷新</a-button>
        </template>
      </a-page-header>
      <a-layout>
        <a-layout>
          <a-layout-content style="height: 100%">
            <a-card>
              <a-tabs default-active-key="default">
                <a-tab-pane key="default" tab="基本信息">
                  <a-descriptions bordered style="width: 100%">
                    <a-descriptions-item label="目录" :span="1">
                      {{ record.parent ? record.parent.title : '' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="发布机构" :span="1">
                      {{ record.organization }}
                    </a-descriptions-item>
                    <a-descriptions-item label="审核状态" :span="1">
                      <a-tag color="blue" v-if="record.status">已审核</a-tag>
                      <a-tag color="red" v-else>待审核</a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="二级标题" :span="3" v-if="record.subtitle">
                      {{ record.subtitle }}
                    </a-descriptions-item>
                    <a-descriptions-item label="三级标题" :span="3" v-if="record.lowtitle">
                      {{ record.lowtitle }}
                    </a-descriptions-item>
                    <a-descriptions-item label="摘要" :span="3" v-if="record.summary">
                      {{ record.summary }}
                    </a-descriptions-item>
                    <a-descriptions-item label="来源名称" :span="1" v-if="record.froms && record.froms.name && record.froms.url">
                      {{ record.froms.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="来源地址" :span="2" v-if="record.froms && record.froms.name && record.froms.url">
                      {{ record.froms.url }}
                    </a-descriptions-item>
                    <a-descriptions-item label="作者" :span="1">
                      {{ record.author }}
                    </a-descriptions-item>
                    <a-descriptions-item label="发布时间" :span="2" v-if="record.release">
                      {{ record.release }}
                    </a-descriptions-item>
                    <a-descriptions-item label="外链地址" :span="3" v-if="record.link">
                      {{ record.link }}
                    </a-descriptions-item>
                    <!-- <a-descriptions-item
                      label="摘要"
                      :span="3"
                      v-if="record.summary"
                    >
                      {{ record.summary }}
                    </a-descriptions-item> -->
                    <a-descriptions-item label="图片" :span="3" v-if="record.logo && record.logo.length">
                      <a-card>
                        <template v-for="item in record.logo">
                          <a-card-grid :key="item.uid" style="width: 20%; text-align: center">
                            <img @click="onPicPreview(item, record.logo)" :src="item.url" height="80px" style="cursor: pointer; width: 100%; object-fit: cover" />
                          </a-card-grid>
                        </template>
                      </a-card>
                    </a-descriptions-item>
                    <a-descriptions-item label="关键字" :span="3" v-if="record.keyword && record.keyword.length">
                      <a-tag color="blue" v-for="(text, index) in record.keyword" :key="index">
                        {{ text }}
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关附件" :span="3" v-if="record.relevance && record.relevance.files && record.relevance.files.length">
                      <a-tag color="blue" v-for="item in record.relevance.files" :key="item.uid">
                        <a :href="item.url" :download="item.name">
                          {{ item.name }}
                        </a>
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关图片" :span="3" v-if="record.relevance && record.relevance.images && record.relevance.images.length">
                      <a-card>
                        <template v-for="item in record.relevance.images">
                          <a-card-grid :key="item.uid" style="width: 20%; text-align: center">
                            <img @click="onPicPreview(item, record.relevance.images)" :src="item.url" height="80" style="cursor: pointer; width: 100%; object-fit: cover" />
                          </a-card-grid>
                        </template>
                      </a-card>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关视频" :span="3" v-if="record.relevance && record.relevance.videos && record.relevance.videos.length">
                      <a-tag color="blue" v-for="item in record.relevance.videos" :key="item.uid">
                        <a :href="item.url" target="_blank">{{ item.name }}</a>
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关PDF" :span="3" v-if="record.relevance && record.relevance.pdfs && record.relevance.pdfs.length">
                      <a-tag color="blue" v-for="item in record.relevance.pdfs" :key="item.uid">
                        <a :href="item.url" target="_blank">{{ item.name }}</a>
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关Word" :span="3" v-if="record.relevance && record.relevance.words && record.relevance.words.length">
                      <a-tag color="blue" v-for="item in record.relevance.words" :key="item.uid">
                        <a :href="item.url" :download="item.name">{{ item.name }}</a>
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="相关文章" :span="3" v-if="record.relevance && record.relevance.relate && record.relevance.relate.length">
                      <a-tag color="blue" v-for="(item, index) in record.relevance.relate" :key="item.document">
                        <a @click="onRelateDocument(record)">{{ item.nick }}</a>
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="内容" :span="3" v-if="record.content">
                      <template v-if="contents.length > 1">
                        <a-tabs :default-active-key="0">
                          <template v-for="(item, index) in contents">
                            <a-tab-pane :key="index" :tab="`第${index + 1}页`">
                              <div v-html="item" class="contentes"></div>
                            </a-tab-pane>
                          </template>
                        </a-tabs>
                      </template>

                      <div v-else v-html="record.content" class="contentes"></div>
                    </a-descriptions-item>
                  </a-descriptions>
                </a-tab-pane>
                <a-tab-pane :key="form.name" :tab="form.title" force-render v-for="form in forms">
                  <k-form-build class="mainds" :value="form.form" :ref="`form_${form.name}`" :dynamicData="dynamicData" :config="config" :disabled="true" :check="true" />
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </a-layout-content>
        </a-layout>
        <a-layout-sider class="document-sider" width="30%">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="审批流程">
              <a-card>
                <div style="margin: 15px 0">
                  <a-timeline>
                    <template v-for="(item, index) in flows">
                      <a-timeline-item :key="index">
                        <a-icon slot="dot" type="clock-circle" style="font-size: 16px; color: #1890ff" v-if="!item.status" />
                        <a-icon slot="dot" type="check-circle" style="font-size: 16px; color: green" v-else-if="item.status == 1" />
                        <a-icon slot="dot" type="close-circle" style="font-size: 16px; color: red" v-else-if="item.status == 2" />
                        <p>
                          <span style="font-weight: bold">步骤条件：</span>
                          <span>
                            <a-tag v-if="item.model == 0">任意管理员</a-tag>
                            <a-tag v-else-if="item.model == 1">所有审核人员</a-tag>
                            <a-tag v-else-if="item.model == 2">任意审核人员</a-tag>
                          </span>
                        </p>
                        <p v-if="item.flows && item.flows.length">
                          <span style="font-weight: bold">审核人：</span>
                          <template v-for="flow in item.flows">
                            <a-tag :key="flow.id">{{ flow.user.realname }}</a-tag>
                          </template>
                        </p>
                        <p v-if="item.flows && item.flows.length">
                          <a-descriptions :column="1" bordered size="small">
                            <span slot="title" style="font-size: 14px">状态：</span>
                            <template v-for="flow in item.flows">
                              <a-descriptions-item :key="flow.id">
                                <span slot="label">
                                  {{ flow.user.realname }}
                                </span>
                                <span>
                                  <a-tag v-if="flow.status">{{ flow.lasttime }}</a-tag>
                                  <a-tag color="blue" v-if="flow.status == 0">待审核</a-tag>
                                  <a-tag color="green" v-else-if="flow.status == 1">审核通过</a-tag>
                                  <a-tag color="red" v-else-if="flow.status == 2">审核驳回</a-tag>
                                </span>
                              </a-descriptions-item>
                            </template>
                          </a-descriptions>
                        </p>
                        <p v-if="item.flows && item.flows.length && item.flows.find(x => x.opinion)">
                          <a-descriptions :column="1" bordered size="small">
                            <span slot="title" style="font-size: 14px">描述：</span>
                            <template v-for="flow in item.flows">
                              <a-descriptions-item :key="flow.id" v-if="flow.opinion">
                                <span slot="label">
                                  {{ flow.user.realname }}
                                </span>
                                <span>{{ flow.opinion }}</span>
                              </a-descriptions-item>
                            </template>
                          </a-descriptions>
                        </p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </div>
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="2" tab="操作记录" force-render>
              <a-card>
                <div style="margin: 15px 0">
                  <a-timeline>
                    <template v-for="(item, index) in logs">
                      <a-timeline-item :key="index">
                        <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px" />
                        <p>{{ item._createtime }}</p>
                        <p>
                          <span style="font-weight: bold">操作人：</span>
                          {{ item.user.realname }}
                        </p>
                        <p>
                          <span style="font-weight: bold">操作：</span>
                          <a-tag>{{ item.title }}</a-tag>
                        </p>
                        <p v-if="item.params && item.params.opinion">
                          <span style="font-weight: bold">描述：</span>
                          <span>{{ item.params.opinion }}</span>
                        </p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </div>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-layout-sider>
      </a-layout>
      <pic-preview :file-preview-show="previewShow" :img-list="preImages" :current-img="currentImg" @close="() => (previewShow = false)"></pic-preview>
    </div>
    <div v-else>无效文章</div>
    <a-modal
      :title="title"
      :visible="visible"
      :width="800"
      :maskClosable="false"
      :confirm-loading="loading"
      @ok="onOk"
      @cancel="
        () => {
          visible = false;
        }
      "
    >
      <!-- <a-form-model-item label="描述">
        <a-input v-model="opinion" type="textarea" />
      </a-form-model-item> -->
      <k-form-build :value="formDatas" ref="kcompanyForm" @change="changes" />
    </a-modal>
  </a-card>
</template>
<script>
import Cookie from 'js-cookie';
import { document_get, logs } from '@/services/content';
import { form_get, form_multiple } from '@/services/forms';
import { formSetData } from '@/utils/util';
import PicPreview from '@/components/PicPreview';

import { dictmap_tree } from '@/services/dictmap';
import { approved_get, approved_verify, approved_revoke } from '@/services/approve';
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    PicPreview,
  },
  computed: {
    contents() {
      return this.record.content.split(this.space);
    },
    dynamicData() {
      let result = Object.assign({}, this.distlists, {
        directorys: [],
      });
      return result;
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get('Authorization'),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get('Authorization'),
        },
      };
    },
  },
  data() {
    return {
      loading: false,
      title: null,
      forms: [],
      jsonData: {},
      record: {},
      flows: [],
      previewShow: false,
      preImages: [],
      step: [],
      visible: false,
      opinion: null,
      status: false,
      verified: false,
      logs: [],
      space: '<div class="ueditor-tabs-page"></div>',
      formDatas: {},
      onrejectData: {},
      onresolveData: {},
      onrevokeData: {},
      distlist: [],
      distlists: {},
      currentImg: '',
    };
  },
  authorize: {
    onResolve: 'approved.verify',
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.id = this.data.id;
      Promise.all([
        document_get({
          id: this.id,
        }),
        form_get({ name: 'doc_title' }),
        form_get({ name: 'onreject' }), //文章驳回
        form_get({ name: 'onresolve' }), //文章审核
        form_get({ name: 'onrevoke' }), //文章撤销
        dictmap_tree({ name: 'DynamicData' }),
      ])
        .then(response => {
          const { data } = response[0].data;
          this.record = data;
          this.jsonData = response[1].data.data.form;
          this.onrejectData = response[2].data.data.form;
          this.onresolveData = response[3].data.data.form;
          this.onrevokeData = response[4].data.data.form;
          var distlist = response[5].data.data;
          for (let item in distlist) {
            this.distlists[distlist[item].name] = distlist[item].children;
          }
          this.$nextTick(() => {
            approved_get({ id: this.id })
              .then(response => {
                this.flows = response.data.data;
                this.step = response.data.step;
                this.verified = response.data.verified;
              })
              .catch(error => {
                console.log('error', error);
              });
            logs({
              id: this.id,
              model: 'Content.Document',
            })
              .then(response => {
                this.logs = response.data.data;
              })
              .catch(error => {
                console.log('error', error);
              });
          });

          const ids = [...data.forms, ...data.parent.forms];
          form_multiple({
            ids: ids,
          })
            .then(response => {
              const forms = response.data.data;
              this.forms = forms.filter(x => !x.main);
              this.$nextTick(() => {
                this.setFormsData(this.forms, data._extension);
              });
            })
            .catch(error => {
              console.log('error', error);
            });
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    setFormsData(forms, data) {
      const names = forms.map(x => {
        return `form_${x.name}`;
      });
      const refs = [];
      names.forEach(x => {
        const ref = this.$refs[x];
        if (ref.length) {
          refs.push(this.$refs[x][0]);
        }
      });
      refs.forEach(x => {
        formSetData(x, data);
      });
    },
    onPicPreview(data, record) {
      this.preImages = record.map(item => item.url);
      this.currentImg = data.url;
      this.previewShow = true;
    },
    onRelateDocument(record) {
      console.log('record', record);
    },
    onReject() {
      this.formDatas = this.onrejectData;
      this.$nextTick(() => {
        this.$refs.kcompanyForm.reset();
      });
      // this.opinion = "发布驳回";
      this.title = '审核驳回';
      this.visible = true;
      this.status = 2;
    },
    onResolve() {
      this.formDatas = this.onresolveData;
      this.$nextTick(() => {
        this.$refs.kcompanyForm.reset();
      });
      // this.opinion = "同意发布";
      this.title = '审核通过';
      this.visible = true;
      this.status = 1;
    },
    changes(key, value) {
      if (value == 'select_type') {
        this.$nextTick(() => {
          this.$refs.kcompanyForm
            .getData()
            .then(res => {
              var datas = res;
              this.$refs.kcompanyForm.setData({
                select_type: datas.select_type,
                select_content: datas.select_type,
              });
            })
            .catch(err => {
              console.log(err);
            });
        });
      }
    },
    onOk() {
      this.$refs.kcompanyForm.getData().then(res => {
        if (res.select_content) {
          if (this.status == 1 || this.status == 2) {
            const formData = {
              document: this.id,
              status: this.status,
              step: this.step,
              opinion: res.select_content,
            };
            this.loading = true;
            approved_verify(formData)
              .then(response => {
                this.$message.success(response.data.message);
                this.visible = false;
                // this.opinion = null;
                this.onLoad();
                this.loading = false;
              })
              .catch(error => {
                console.log('error', error);
                // this.opinion = null;
                this.loading = false;
              });
          } else {
            this.loading = true;
            approved_revoke({
              document: this.record.id,
              opinion: res.select_content,
            })
              .then(response => {
                console.log('response2', response);
                this.$message.success(response.data.message);
                this.visible = false;
                // this.opinion = null;
                this.loading = false;
                this.onLoad();
              })
              .catch(error => {
                console.log('error', error);
                this.visible = false;
                // this.opinion = null;
                this.loading = false;
              });
          }
        } else {
          this.$message.error('请填写描述内容！');
        }
      });
    },
    onRevoke() {
      this.formDatas = this.onrevokeData;
      this.$nextTick(() => {
        this.$refs.kcompanyForm.reset();
      });
      // this.opinion = "";
      this.title = '撤销审核';
      this.visible = true;
      this.status = 3;
    },
  },
};
</script>
<style scoped>
.document-sider {
  background: #fff;
}
.contentes >>> img {
  max-width: 100%;
}

.mainds >>> .ant-table-fixed-right {
  display: none;
}
</style>
