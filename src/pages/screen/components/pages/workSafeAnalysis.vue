<template>
  <div class="workSafeAnalysis_page">
    <div class="workSafeAnalysis_page_header">
      <div class="workSafeAnalysis_page_header_title">单位隐患统计</div>
      <div class="workSafeAnalysis_page_header_data">
        <span class="workSafeAnalysis_page_header_data_items">得分：52</span>
        <span class="workSafeAnalysis_page_header_data_items">等级：D</span>
        <span class="workSafeAnalysis_page_header_data_items">评估时间：2023-07-17 14:53:17</span>
      </div>
    </div>
    <div class="workSafeAnalysis_page_content">
      <a-row>
        <a-col :span="8" style="height: 220px; padding: 15px" v-for="item in items">
          <div class="workSafeAnalysis_page_content_item">
            <div
              :class="
                item.flag == 1
                  ? 'workSafeAnalysis_page_content_item_top1'
                  : item.flag == 2
                  ? 'workSafeAnalysis_page_content_item_top1_warning'
                  : 'workSafeAnalysis_page_content_item_top1_error'
              "
            >
              {{ item.title }}
            </div>
            <div
              :class="
                item.flag == 1
                  ? 'workSafeAnalysis_page_content_item_top2'
                  : item.flag == 2
                  ? 'workSafeAnalysis_page_content_item_top2_warning'
                  : 'workSafeAnalysis_page_content_item_top2_error'
              "
            >
              {{ item.notes }}
            </div>
            <div class="workSafeAnalysis_page_content_item_top3">{{ item.content }}</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          key: 1,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 2,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 3,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 4,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 2,
        },
        {
          key: 5,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 3,
        },
        {
          key: 6,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 7,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 8,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 9,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
        {
          key: 10,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 3,
        },
        {
          key: 11,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 2,
        },
        {
          key: 12,
          title: '单位基础信息，详细地址(3分)',
          notes: '单位应维护好本单位的详细地址信息真实有效。',
          content: '得分：3分(得分情况：已填写详细地址)',
          flag: 1,
        },
      ],
    };
  },
  methods: {},
};
</script>
<style lang="less">
.workSafeAnalysis_page {
  width: 100%;
  height: calc(100% - 60px);
  margin-top: 24px;
  overflow-y: auto;

  .workSafeAnalysis_page_header {
    width: 100%;
    height: 120px;
    padding: 20px 0;
    background-color: rgb(2, 35, 58);

    .workSafeAnalysis_page_header_title {
      text-align: center;
      font-size: 22px;
      margin-bottom: 20px;
    }

    .workSafeAnalysis_page_header_data {
      text-align: center;
      font-size: 16px;

      .workSafeAnalysis_page_header_data_items {
        margin-right: 40px;
      }
    }
  }

  .workSafeAnalysis_page_content {
    width: 100%;
    min-height: 600px;
    background-color: rgb(2, 35, 58);

    .workSafeAnalysis_page_content_item {
      width: 100%;
      height: 100%;
      border: 1px solid rgb(181, 229, 239);

      .workSafeAnalysis_page_content_item_top1 {
        width: 100%;
        height: 20%;
        line-height: 30px;
        background-color: rgb(109, 163, 205);
        font-size: 16px;
        padding-left: 10px;
        color: rgb(235, 249, 254);
      }

      .workSafeAnalysis_page_content_item_top1_warning {
        width: 100%;
        height: 20%;
        line-height: 30px;
        background-color: rgb(206, 171, 119);
        font-size: 16px;
        padding-left: 10px;
        color: rgb(235, 249, 254);
      }

      .workSafeAnalysis_page_content_item_top1_error {
        width: 100%;
        height: 20%;
        line-height: 30px;
        background-color: rgb(202, 84, 78);
        font-size: 16px;
        padding-left: 10px;
        color: rgb(235, 249, 254);
      }

      .workSafeAnalysis_page_content_item_top2 {
        width: 100%;
        height: 20%;
        line-height: 33px;
        background-color: rgb(11, 66, 105);
        font-size: 14px;
        padding-left: 10px;
        color: rgb(137, 189, 226);
      }

      .workSafeAnalysis_page_content_item_top2_warning {
        width: 100%;
        height: 20%;
        line-height: 33px;
        background-color: rgb(74, 66, 54);
        font-size: 16px;
        padding-left: 10px;
        color: rgb(218, 178, 118);
      }

      .workSafeAnalysis_page_content_item_top2_error {
        width: 100%;
        height: 20%;
        line-height: 33px;
        background-color: rgb(101, 55, 53);
        font-size: 16px;
        padding-left: 10px;
        color: rgb(237, 96, 90);
      }

      .workSafeAnalysis_page_content_item_top3 {
        padding-left: 10px;
        font-size: 16px;
        width: 100%;
        height: 60%;
        padding-top: 10px;
        color: rgb(235, 249, 254);
      }
    }
  }
}
</style>
<style>
.workSafeAnalysis_page::-webkit-scrollbar {
  width: 5px;
}
.workSafeAnalysis_page::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(82, 82, 82, 0.1);
  background: rgba(214, 214, 214, 0.1);
}
.workSafeAnalysis_page::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(61, 61, 61, 0.1);
  border-radius: 0;
  background: rgba(204, 204, 204, 0.1);
}
</style>
