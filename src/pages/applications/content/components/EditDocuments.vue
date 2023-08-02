<template>
  <a-card  class="forms_css"
    :body-style="{ padding: '24px 32px', minHeight: '80vh' }"
    :bordered="false"
  >
    <a-back-top />
    <a-page-header
      style="
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
        padding-bottom: 10px;
      "
      @back="back"
    >
      <template slot="title">
        <a-button @click="back"><span>返回</span></a-button>
      </template>
      <div class="content">
        <div class="main">
          <span>当前位置：</span>
          <span>{{ site.title }}</span>
          <span v-if="channel.title">/ {{ channel.title }}</span>
        </div>
      </div>
    </a-page-header>
    <a-spin :spinning="loading" tip="Loading...">
      <a-row>
        <div style="text-align: right">
          <a-space>
            <a-button type="primary"
              ><a-checkbox
                v-model="approved"
                style="font-size: 14px; color: #ffffff"
                >自动送审</a-checkbox
              ></a-button
            >
            <a-button
              type="primary"
              icon="save"
              :loading="Submitloading"
              :disabled="readonly"
              @click="onSubmit"
              >提交</a-button
            >
            <a-button
              type="primary"
              icon="save"
              @click="
                () => {
                  drawerVisible = true;
                }
              "
            >
              相关信息
            </a-button>
          </a-space>
        </div>
        <a-divider />
      </a-row>
      <a-row>
        <a-divider />
        <k-form-build
          :value="defaultForm"
          :disabled="readonly"
          :defaultValue="defaultValue"
          @change="defaultChange"
          ref="defaultForm"
          :dynamicData="dynamicData"
          :config="config"
        />
        <template v-for="item in exForms">
          <a-tab-pane
            :key="item.name"
            :tab="`${item.title}`"
            :forceRender="true"
          >
            <!-- <a-divider orientation="left">
              <span style="font-size: 16px; font-weight: 600">{{
                item.title
              }}</span>
            </a-divider> -->
            <k-form-build
              :disabled="readonly"
              :value="item.form"
              :defaultValue="exValue[item.name]"
              :ref="`${item.name}Form`"
              :dynamicData="exData[item.name]"
              :config="config"
            />
          </a-tab-pane>
        </template>
        <a-drawer
          title="相关信息"
          placement="right"
          :closable="true"
          width="600"
          :getContainer="false"
          :visible="drawerVisible"
          @close="
            () => {
              drawerVisible = false;
            }
          "
        >
          <a-tabs tabPosition="right">
            <a-tab-pane key="0" tab="相关附件">
              <k-form-build
                :value="aboutInfoData"
                :disabled="readonly"
                ref="aboutInfoData"
                :dynamicData="dynamicData"
                :config="config"
              />
              <!-- <a-divider orientation="right">附件</a-divider>
              <a-upload
                name="file"
                :multiple="true"
                @preview="onPreview"
                :default-file-list="relevance.files"
                :file-list="relevance.files"
                action="/api/public/upload"
                @change="filesUpLoad"
                accept="*"
              >
                <a-button :disabled="readonly">
                  <a-icon type="upload" />
                  点击上传附件
                </a-button>
              </a-upload>

              <a-divider orientation="right">视频</a-divider>
              <a-upload
                name="file"
                :multiple="true"
                @preview="onPreview"
                :default-file-list="relevance.videos"
                action="/api/public/upload"
                @change="videosUpLoad"
                accept="video/*"
              >
                <a-button :disabled="readonly">
                  <a-icon type="upload" />
                  点击上传视频
                </a-button>
              </a-upload>
              <a-divider orientation="right">图片</a-divider>
              <a-upload
                name="file"
                :multiple="true"
                :default-file-list="relevance.images"
                action="/api/public/upload"
                list-type="picture"
                @change="imagesUpLoad"
                accept="image/*"
                @preview="onPreview"
              >
                <a-button :disabled="readonly">
                  <a-icon type="upload" />
                  点击上传图片
                </a-button>
              </a-upload> -->
            </a-tab-pane>
            <!-- <a-tab-pane key="1" tab="扩展表单">
              <a-select
                mode="multiple"
                :allowClear="true"
                :filter-option="filterOption"
                show-search
                v-model="documentForms"
                style="width: 100%"
                @change="formsChange"
                :disabled="readonly"
              >
                <a-select-option
                  v-for="item in forms"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.title }}</a-select-option
                >
              </a-select>
            </a-tab-pane> -->
            <a-tab-pane key="2" tab="标签">
              <a-select
                mode="tags"
                style="width: 100%"
                :token-separators="[',']"
                placeholder="请点击提取[标签],如果为空则发布后自动提取[标签]"
                :default-value="keyword"
                v-model="keyword"
                :allow-clear="true"
                :disabled="readonly"
              ></a-select>
              <a-divider />
              <a-button
                type="primary"
                @click="onGetKeyWord"
                style="float: right"
                :disabled="readonly"
                >提取标签</a-button
              >
            </a-tab-pane>
          </a-tabs>
        </a-drawer>
        <a-divider />
        <div style="text-align: right">
          <a-space>
            <a-button type="primary"
              ><a-checkbox
                v-model="approved"
                style="font-size: 14px; color: #ffffff"
                >自动送审</a-checkbox
              ></a-button
            >
            <a-button
              type="primary"
              icon="save"
              :loading="Submitloading"
              :disabled="readonly"
              @click="onSubmit"
              >提交</a-button
            >
          </a-space>
        </div>
      </a-row>
    </a-spin>
  </a-card>
</template>
<script>
import {
  document_insert,
  document_edit,
  document_get,
  channel_list,
  document_keyword,
  wordcloud_keywords,
  channel_get,
} from "@/services/content";
import { form_get, forms_list } from "@/services/forms";
import { organization_get, organization_tree } from "@/services/organization";
import { document_search } from "@/services/content";
import {
  approve_submit,
  approve_multisub,
  approved_revoke,
} from "@/services/approve";
import { dictmap_tree } from "@/services/dictmap"
import { draft_paginate } from "@/services/opinion";
import Cookie from "js-cookie";
import gongwenzhonglei from "../json/gongwenzhonglei"
import zhutifenlei from "../json/zhutifenlei"
import object from "lodash/object";
export default {
  name: "EditDocuments",
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      loading: true,
      Submitloading: false,
      datas: {},
      defaultForm: {},
      defaultValue: {},
      method: document_edit,
      drawerVisible: false,
      relevance: {
        files: [],
        videos: [],
        images: [],
        documents: [],
      },
      documentForms: [],
      forms: [],
      treeData: [],
      keyword: [],
      exValue: {},
      exData: {},
      channelForms: [], //挂载表单
      form: {},
      //
      site: {},
      channel: {},
      currTabs: "default",
      searchData: {},
      sitetreeData: [],
      aboutInfoData: {},
      approved: true, //自动送审
      copyfoms: {},
      detailsDatas: {},
      status: false,
      distlists:{}
    };
  },
  computed: {
    readonly() {
      return this.params.key ? true : this.params.readonly;
    },
    dynamicData() {
      let result = {
        organizations: this.sitetreeData,
        channels: this.treeData,
        forms: [],
        flag: this.flag,
        editors: this.editors,
      };

      for (let item in this.forms) {
        result["forms"].push({
          key: this.forms[item].id,
          value: this.forms[item].id,
          label: this.forms[item].title,
        });
      }
      return result;
    },
    exForms() {
      let forms_id = [];
      for (let item in this.channelForms) {
        if (forms_id.indexOf(this.channelForms[item]) === -1) {
          forms_id.push(this.channelForms[item]);
        }
      }
      for (let item in this.documentForms) {
        if (forms_id.indexOf(this.documentForms[item]) === -1) {
          forms_id.push(this.documentForms[item]);
        }
      }

      let forms_result = [];
      for (let item in this.forms) {
        if (forms_id.indexOf(this.forms[item].id) !== -1) {
          if (this.forms[item].main) {
            forms_result.push(this.forms[item]);
          } else {
            forms_result.splice(0, 0, this.forms[item]);
          }
        }
      }

      return forms_result;
    },
    pagination: {
      get() {
        return {
          page: this.searchData.page || 1,
          per_page: this.searchData.per_page || 10,
          total: this.searchData.total || 0,
        };
      },
      set(val) {
        this.searchData.page = val.page;
        this.searchData.per_page = val.per_page;
      },
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
  },
  watch: {
    exForms(value) {
      this.$nextTick(() => {
        for (let temp in value) {
          const entity = value[temp];
          const key = entity.name;
          const ref = `${key}Form`;
          // 自定义表单方法与数据
          if (entity.main) {
            this.flag = Math.random();
            this.exData[key] = Object.assign({},this.distlists,{
              flag: Math.random(),
              organizations: this.sitetreeData || {},
              onSearch: document_search,
              redonly: this.params.status,
              searchDatas: this.form.relevance
                ? this.form.relevance.relate
                : [],
              zhutifenlei: zhutifenlei,
              gongwenzhonglei: gongwenzhonglei
            })
          } else {
            this.exData[key] = Object.assign({},this.distlists,{
              organizations: this.sitetreeData || {},
              onSearches: draft_paginate,
              onSearch: document_search,
              zhutifenlei: zhutifenlei,
              gongwenzhonglei: gongwenzhonglei
            })
            
          }
          if (
            this.$refs[ref].length &&
            this.form._extension &&
            this.form._extension
          ) {
            this.$nextTick(() => {
              let formData = {};
              const node = this.$refs[ref][0];
              if (entity.main) {
                for (let key in node.form.formItems) {
                  formData[key] = this.form[key];
                }
              } else {
                for (let key in node.form.formItems) {
                  if (key == "related_documents") {
                    if (this.form._extension[key] !== undefined) {
                      formData[key] = {
                        document: this.form._extension[key],
                      };
                    } else {
                      formData[key] = {
                        document: this.form._extension[key],
                      };
                    }
                  } else {
                    formData[key] = this.form._extension[key];
                  }
                }
              }
              node.setData(formData);
            });
          }
        }
        if (value.length) {
          this.currTabs = value[value.length - 1].name;
        }
      });
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      this.$nextTick(() => {
        this.treeData = this.params.channelData;
        this.site = this.params.siteinfo;
        Promise.all([
          form_get({ name: "doc_title" }),
          // channel_list({
          //   site: this.params.site,
          //   tree: true,
          // }),
          forms_list(),
          // organization_get({ id: this.params.site }),
          organization_tree(),
          form_get({ name: "about_info" }),
          dictmap_tree({ name:'DynamicData'})
        ])
          .then((response) => {
            
            this.$nextTick(() => {
              this.defaultForm = response[0].data.data.form;
              // this.treeData = response[1].data.data;
              this.forms = response[1].data.data;
              // this.site = response[3].data.data;
              this.sitetreeData = response[2].data.data;
              this.aboutInfoData = response[3].data.data.form;
              var distlist = response[4].data.data;

              for (let item in distlist) {
                this.distlists[distlist[item].name] = distlist[item].children
              }
              
              this.getDocument();
              this.loading = false;
            });
          })
          .catch((err) => {
            console.log("err", err);
            this.loading = false;
          });
        if (this.params.channel) {
          this.parentChange(this.params.channel);
        }
      });
    },
    getDocument() {
      if (this.params.id) {
        document_get({ id: this.params.id })
          .then((res) => {
            const form = Object.assign({}, res.data.data);
            this.form = Object.assign(form, {
              fromname: form.froms ? form.froms.name : "",
              fromurl: form.froms ? form.froms.url : "",
            });
            this.form.pdffiles = form.relevance.pdfs;
            this.form.wordfiles = form.relevance.words;
            this.form.enclosurefiles = form.relevance.files;
            this.form.relevance_documents = {
              document: form.relevance.documents,
            };
            this.status = this.form.status;
            // 表单回显
            this.$nextTick(() => {
              this.$refs.defaultForm.setData({
                title: form.title,
                parent: form.parent ? form.parent.id : null,
              });
              this.keyword = form.keyword;
              this.relevance = form.relevance;
              this.$refs.aboutInfoData.setData({
                files: form.relevance.files,
                images: form.relevance.images,
                videos: form.relevance.videos,
                videoUrls: form.relevance.videoUrls,

              });
              var list = [];
              for (let i in form.relevance.relate) {
                list.push(form.relevance.relate[i].document);
              }
              this.form.related_documents = {
                document: list,
                documents: form.relevance.relate,
              };

              // 挂载表单
              if (
                form.parent &&
                form.parent.forms &&
                form.parent.forms.length
              ) {
                const value = form.parent.forms;
                let exforms = [];
                for (let temp in value) {
                  let item = value[temp];
                  if (exforms.indexOf(item) === -1) {
                    exforms.push(item);
                  }
                }
                this.channelForms = exforms;
              }
              // 扩展表单
              let document_forms = [];
              if (form.forms && form.forms.length) {
                for (let item in form.forms) {
                  document_forms.push(form.forms[item]);
                }
              }
              this.documentForms = document_forms;
              this.$nextTick(() => {
                setTimeout(() => {
                this.copyfoms = this.getformdatas();
                }, 500);
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        //新增时 目录默认
        this.$nextTick(() => {
          this.$refs.defaultForm.setData({
            parent: this.params.channel,
          });
        });
        //
        this.$nextTick(() => {
          this.exForms.forEach((item) => {
            if (item.main) {
              const node = this.$refs[`${item.name}Form`][0];
              const fields = [];
              for (const field in node.form.formItems) {
                fields.push(field);
              }
              if (fields.indexOf("organization") !== -1) {
                node.setData({
                  organization: this.site.title,
                });
              }
            }
          });
        });
      }
    },
    formsChange(value) {
      this.documentForms = value;
    },
    onSubmit() {
      this.Submitloading = true;
      if (this.params.id) {
        this.method = document_edit;
      } else {
        this.method = document_insert;
      }
      // 排除详情表单
      const _forms = [];
      const detailsIndex = [];
      const extensionsIndex = [];
      this.exForms.forEach((item, index) => {
        const el = this.$refs[`${item.name}Form`].length
          ? this.$refs[`${item.name}Form`][0]
          : null;
        if (el) {
          if (item.main) {
            detailsIndex.push(index);
          } else {
            extensionsIndex.push(index);
          }
          _forms.push(el.getData());
        }
      });
      // 修改文件
      var aboutinfos = {};
      this.$refs.aboutInfoData
        .getData()
        .then((res) => {
          aboutinfos = res;
        })
        .catch((err) => {
          console.log(err);
          this.Submitloading = false;
        });
      const promise = [..._forms, this.$refs.defaultForm.getData()];
      Promise.all(promise)
        .then((response) => {
          let detailsData = response[response.length - 1];
          // 主表单
          detailsIndex.forEach((item) => {
            detailsData = Object.assign(detailsData, response[item]);
          });
          console.log('detailsData', detailsData)
          for (let key in detailsData) {
            if (key == "related_documents") {
              if (detailsData[key] != undefined) {
                this.relevance.documents = detailsData[key].document;
                this.relevance.relate = detailsData[key].documents;
              } else {
                this.relevance.documents = [];
              }
            }
          }
          // 非主表
          let extensionsData = {};
          extensionsIndex.forEach((item) => {
            extensionsData = Object.assign(extensionsData, response[item]);
          });
          var extensions_relevance_documents = {};
          for (let key in extensionsData) {
            if (key == "related_documents") {
              if (extensionsData[key] != undefined) {
                extensions_relevance_documents = {
                  related_documents: extensionsData.related_documents,
                };
              } else {
                extensions_relevance_documents = {};
              }
            }
          }

          var formData = Object.assign(detailsData, {
            id: this.params.id || undefined,
            extension: Object.assign(
              this.params.id ? this.form._extension : {},
              extensionsData
            ),
            froms: {
              name: detailsData.fromname || null,
              url: detailsData.fromurl || null,
            },
            relevance: Object.assign({}, this.relevance, aboutinfos, {
              words: detailsData.wordfiles || [],
              pdfs: detailsData.pdffiles || [],
              files: detailsData.enclosurefiles || aboutinfos.files,
            }),
            forms: this.documentForms, //扩展表单
            keyword: this.keyword,
            extensions_relevance_documents: extensions_relevance_documents,
          });
          delete formData["fromname"];
          delete formData["fromname"];
          // delete formData['relevance_documents'];
          delete formData["pdffiles"];
          delete formData["wordfiles"];

          var status = this.copyfoms == formData;
          console.log("status", status);
          if (status) {
            this.backs(
              this.params.id ? this.params.parent.id : detailsData.parent
            );
          } else {
            this.method(formData)
              .then((response) => {
                this.loading = false;
                this.Submitloading = false;
                this.$message.success("操作成功");
                if (this.status) {
                  // 已审核=》撤销审核
                  approved_revoke({
                    document: response.data.data,
                    opinion: "撤销撤销1",
                  })
                    .then((response) => {
                      console.log("response", response);
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
                } else {
                  // 未审核 =》 提交审核
                  if (this.approved) {
                    approve_submit({
                      document: response.data.data,
                    })
                      .then((response) => {
                        console.log("response", response);
                      })
                      .catch((error) => {
                        console.log("error", error);
                      });
                  }
                }
                this.backs(
                  this.params.id ? this.params.parent.id : detailsData.parent
                );
              })
              .catch((err) => {
                this.Submitloading = false;
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          // for(let key in err){
          //   this.$message.error(err[key].errors[0].message)
          // }
          this.Submitloading = false;
        });
    },
    getformdatas() {
      if (this.params.id) {
        this.method = document_edit;
      } else {
        this.method = document_insert;
      }
      // 排除详情表单
      const _forms = [];
      const detailsIndex = [];
      const extensionsIndex = [];
      this.exForms.forEach((item, index) => {
        const el = this.$refs[`${item.name}Form`].length
          ? this.$refs[`${item.name}Form`][0]
          : null;
        if (el) {
          if (item.main) {
            detailsIndex.push(index);
          } else {
            extensionsIndex.push(index);
          }
          _forms.push(el.getData());
        }
      });
      // 修改文件
      var aboutinfos = {};
      this.$refs.aboutInfoData
        .getData()
        .then((res) => {
          aboutinfos = res;
        })
        .catch((err) => {
          console.log(err);
          this.Submitloading = false;
        });
      const promise = [..._forms, this.$refs.defaultForm.getData()];
      Promise.all(promise)
        .then((response) => {
          let detailsData = response[response.length - 1];
          detailsIndex.forEach((item) => {
            detailsData = Object.assign(detailsData, response[item]);
          });
          for (let key in detailsData) {
            if (key == "related_documents") {
              if (detailsData[key] != undefined) {
                this.relevance.documents = detailsData[key].document;
                this.relevance.relate = detailsData[key].documents;
              } else {
                this.relevance.documents = [];
              }
            }
          }
          let extensionsData = {};
          extensionsIndex.forEach((item) => {
            extensionsData = Object.assign(extensionsData, response[item]);
          });
          var extensions_relevance_documents = {};
          for (let key in extensionsData) {
            if (key == "related_documents") {
              if (extensionsData[key] != undefined) {
                extensions_relevance_documents = {
                  related_documents: extensionsData.related_documents,
                };
              } else {
                extensions_relevance_documents = {};
              }
            }
          }
          var formData = Object.assign(detailsData, {
            id: this.params.id || undefined,
            extension: Object.assign(
              this.params.id ? this.form._extension : {},
              extensionsData
            ),
            froms: {
              name: detailsData.fromname || null,
              url: detailsData.fromurl || null,
            },
            relevance: Object.assign({}, this.relevance, aboutinfos, {
              words: detailsData.wordfiles || [],
              pdfs: detailsData.pdffiles || [],
            }),
            forms: this.documentForms, //扩展表单
            keyword: this.keyword,
            extensions_relevance_documents: extensions_relevance_documents,
          });
          delete formData["fromname"];
          delete formData["fromname"];
          // delete formData['relevance_documents'];
          delete formData["pdffiles"];
          delete formData["wordfiles"];
          console.log("formData1111", formData);
          return formData;
        })
        .catch((err) => {
          console.log(err);
          this.Submitloading = false;
        });
    },
    onPreview(file) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    },
    // 文件上传
    filesUpLoad(info) {
      let files = info.fileList;
      if (info.file.status == "done") {
        const res = info.file.response;
        if (res.status == 200) {
          setTimeout(() => {
            this.relevance.files = files.map((item) => {
              if (typeof item.response !== "undefined") {
                const ress = item.response;
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: ress.data.fileId || Date.now(),
                  url: ress.data.url || "",
                };
              } else {
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: item.uid,
                  url: item.url || "",
                };
              }
            });
          }, 10);
        } else {
          this.fileList.pop();
          this.$message.error(`文件上传失败`);
        }
      } else if (info.file.status === "removed") {
        this.relevance.files = this.relevance.files.filter((item) => {
          item.uid != info.file.uid;
        });
      } else if (info.file.status === "error") {
        this.$message.error(`文件上传失败`);
      }
    },
    // 视频上传
    videosUpLoad(info) {
      let videos = info.fileList;
      if (info.file.status == "done") {
        const res = info.file.response;
        if (res.status == 200) {
          setTimeout(() => {
            this.relevance.videos = videos.map((item) => {
              if (typeof item.response !== "undefined") {
                const res = item.response;
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: res.data.fileId || Date.now(),
                  url: res.data.url || "",
                };
              } else {
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: item.uid,
                  url: item.url || "",
                };
              }
            });
          }, 10);
        } else {
          // this.fileList.pop();
          this.$message.error(`文件上传失败`);
        }
      } else if (info.file.status === "removed") {
        this.relevance.videos = this.relevance.videos.filter((item) => {
          item.uid != info.file.uid;
        });
      } else if (info.file.status === "error") {
        this.$message.error(`文件上传失败`);
      }
    },
    // 图片上传
    imagesUpLoad(info) {
      let images = info.fileList;
      if (info.file.status == "done") {
        const res = info.file.response;
        if (res.status == 200) {
          setTimeout(() => {
            this.relevance.images = images.map((item) => {
              if (typeof item.response !== "undefined") {
                const res = item.response;
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: res.data.fileId || Date.now(),
                  url: res.data.url || "",
                };
              } else {
                return {
                  type: "file",
                  name: item.name,
                  status: item.status,
                  uid: item.uid,
                  url: item.url || "",
                };
              }
            });
          }, 10);
        } else {
          this.fileList.pop();
          this.$message.error(`文件上传失败`);
        }
      } else if (info.file.status === "removed") {
        this.relevance.images = this.relevance.images.filter((item) => {
          item.uid != info.file.uid;
        });
      } else if (info.file.status === "error") {
        this.$message.error(`文件上传失败`);
      }
    },
    // 提取标签
    onGetKeyWord() {
      this.$refs.defaultForm
        .getData()
        .then((formData) => {
          // console.log('this.form', this.form)
          // console.log('formData', formData)
          document_keyword({
            text: [
              formData.title,
              formData.subtitle,
              formData.summary,
              formData.content,
            ].join(),
          })
            .then((response) => {
              this.keyword = response.data.data;
            })
            .catch((error) => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message.error("参数异常");
        });
    },
    // 相关文档插件-文章查询
    onTabChange(activeKey) {
      this.currTabs = activeKey;
      this.flag = Math.random();
      for (let item in this.exForms) {
        const key = this.exForms[item].name;
        this.exData[key] = {
          flag: Math.random(),
          organizations: this.sitetreeData,
          onSearch: this.document_search,
        };
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    defaultChange(value, key) {
      this[`${key}Change`] && this[`${key}Change`](value);
    },
    // 更换目录==>刷新表单
    parentChange(value) {
      // this.channel_id = value;
      if (value) {
        channel_get({
          id: value,
        })
          .then((response) => {
            this.$nextTick(() => {
              const value = response.data.data.forms; //挂载表单
              this.channel = response.data.data;
              let exforms = [];
              for (let temp in value) {
                let item = value[temp];
                if (exforms.indexOf(item) === -1) {
                  exforms.push(item);
                }
              }
              this.channelForms = exforms;
            });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else {
        this.channelForms = [];
      }
    },
    getChannels() {
      this.loading = true;
      this.$nextTick(() => {
        channel_list({
          site: this.params.site,
          tree: true,
        })
          .then((response) => {
            this.treeData = response.data.data;
            this.loading = false;
          })
          .catch((error) => {
            this.$message.error(error);
            this.loading = false;
          });
      });
    },
    // 成功后返回
    backs(data) {
      // this.$emit("event", {
      //   method: "treeSelect",
      //   params: [data],
      // });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: this.params,
        },
      });
    },
    // 返回
    back() {
      // this.$emit("event", {
      //   method: this.params.key == "2" ? "treeSelectdire" : "treeSelect",
      //   params: [
      //     this.params.key == "2" ? this.params.directory : this.params.channel,
      //   ],
      // });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "info-details",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style>
.vl-notify.vl-notify-iframe {
  overflow: hidden;
}
.ant-drawer-content-wrapper {
  margin-top: 40px;
}
.ant-select-dropdown-content{
  max-height: 400px !important;
}
</style>