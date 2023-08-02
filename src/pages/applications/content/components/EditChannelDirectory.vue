<template>
  <a-card
    :body-style="{ padding: '24px 32px', maxHeight: '80vh', overflow: 'auto' }"
    :bordered="false"
  >
    <a-spin tip="Loading..." :spinning="loading">
      <a-page-header
        style="
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding-bottom: 10px;
        "
        @back="backs"
      >
        <template slot="title">
          <a-button @click="backs"><span>返回</span></a-button>
        </template>
      </a-page-header>
      <!--  -->
      <div class="testa">
        <h3>目录拖动排序 ({{channelRowKeys.length}})
          <a-button type="primary" size="small"  @click="submint" style="float:right">保存</a-button>
        </h3>
        <draggable element="div" v-model="channelRowKeys">
          <a-tag
            v-for="(item, index) in channelRowKeys"
            showArrow
            color="blue"
            :key="item"
          >
            {{ selects(item) }}
            <a-icon
              type="close"
              style="margin-left: 5px"
              @click="handleClose(index)"
            ></a-icon>
          </a-tag>
        </draggable>
      </div>
      <a-tree-select
        v-model="channelRowKeys"
        multiple
        allowClear
        showSearch
        :maxTagCount="2"
        style="width: 100%; margin: 10px 0"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="channels"
        placeholder="检索目录"
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
      <a-table
        :rowKey="(record) => record.id"
        :columns="channelColumns"
        :data-source="channels"
        :selections="['id', 'children']"
        childrenColumnName="children"
        @expand="expands"
        :row-selection="{ selectedRowKeys: channelRowKeys, onSelect: onSelect }"
        :pagination="{
          'show-size-changer': true,
          'show-quick-jumper': true,
          'pageSize': 1004
        }"
        >
        <span slot="_title" slot-scope="text, record">{{ record.title }}</span>
      </a-table>
      <div style="text-align: right; padding: 20px 0">
        <a-button type="primary" @click="submint">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { directory_channel, channel_list, channel_get_children } from "@/services/content";
import draggable from "vuedraggable";
export default {
  title: "目录编辑",
  name: "editchannel",
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
  watch: {
    params(val) {
      this.init();
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      loading: true,
      channels: [],
      channeldatas: [],
      channelRowKeys: [],
      channelColumns: [
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
        },
      ],
      arrays: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {
        directorys: [],
      };
      return result;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.channelRowKeys = this.params.channel;
      Promise.all([
      channel_list({ site: this.params.organization, tree: true }),
      channel_get_children({site: this.params.organization})
      ]).then((res) => {
          this.channels = res[0].data.data;
          this.channeldatas = res[1].data.data;
          this.loading = false;
          this.treess(this.channels);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    treess(params) {
      for (var i = 0; i < params.length; i++) {
        this.arrays.push({
          name: params[i].title,
          id: params[i].id,
        });
        if (params[i].children) {
          this.treess(params[i].children);
        }
      }
    },

    selects(id) {
      var lasr = this.arrays.filter((item) => {
        return item.id == id;
      });
      return lasr.length ? lasr[0].name : "";
    },
    expands(expanded, record){
      console.log('expanded',expanded, record)
      channel_get_children({site: this.params.organization, parent: record.id }).then(res=>{
        console.log('resres', res)
      }).catch(err=>{
        console.log(err)
      })
    },
    handleClose(item) {
      this.loading = true;
      this.channelRowKeys.splice(item, 1);
      var datas = {
        id: this.params.id,
        channel: this.channelRowKeys,
      };
      directory_channel(datas)
        .then((response) => {
          this.loading = false;
          this.$message.success(response.data.message);
          // this.back(this.params.id, this.params.organization);
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    onSelect(record, selected) {
      //每个复选框点击都会触发
      const selectrows = [record.id];
      if (record.hasOwnProperty("children")) {
        const generator = (record) => {
          //这里做一个递归查找
          record.forEach((item) => {
            selectrows.push(item.id);

            if (item.children && item.children.length > 0) {
              generator(item.children);
            }
          });
        };
        generator(record.children);
      }
      const newselect = this.channelRowKeys.filter(
        (item) => !selectrows.includes(item)
      );
      //选中和取消选中的级联
      if (selected) {
        if(this.channelRowKeys.length + selectrows.length > 1000){
          this.$message.error("所选目录数量超过1000条!")
        }else{
          this.channelRowKeys = [...this.channelRowKeys, ...selectrows];
        }
      } else {
        this.channelRowKeys = newselect;
      }
    },

    // 保存
    submint() {
      this.loading = true;
      var datas = {
        id: this.params.id,
        channel: this.channelRowKeys,
      };
      directory_channel(datas)
        .then((response) => {
          this.loading = false;
          this.$message.success(response.data.message);
          this.back(this.params.id, this.params.organization);
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    back(data, site) {
      this.$emit("event", {
        method: "refreshes",
        params: {
          data: data,
          site: site,
        },
      });
    },
    backs() {
      this.$emit("event", {
        method: "treeSelectdire",
        params: [this.params.id],
      });
    },
  },
};
</script>
<style scoped>
.testa {
  width: 100%;
  border: 1px solid #cecece;
  padding: 10px;
  border-radius: 5px;
}
.testa >>> .ant-tag {
  margin: 5px;
}
</style>