<template>
  <div>
    <a-descriptions bordered :column="2">
      <a-descriptions-item label="验证">
        <a-tag color="pink">
          {{ 'v-auth="`' + params.parent.key + '`"' }}
        </a-tag>
        <a-tag color="pink"> {{ "$auth('" + params.parent.key + "')" }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="路由唯一标识(Key)">
        {{ params.parent.key }}
      </a-descriptions-item>
      <a-descriptions-item label="下游服务路由模板">
        {{ params.parent.downstreamPathTemplate }}
      </a-descriptions-item>
      <a-descriptions-item label="下游服务http schema">
        {{ params.parent.downstreamScheme || "http" }}
      </a-descriptions-item>
      <a-descriptions-item label="上游游服务路由模板">
        {{ params.parent.upstreamPathTemplate }}
      </a-descriptions-item>
      <a-descriptions-item label="上游请求http方法">
        <a-tag
          color="cyan"
          :key="index"
          v-for="(item, index) in params.parent.upstreamHttpMethod"
        >
          {{ item }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="下游服务的地址">
        <span
          :key="index"
          v-for="(item, index) in params.parent.downstreamHostAndPorts"
        >
          <a-tag color="cyan" :key="index">
            {{ item.host }}:{{ item.port }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="验证方式">
        <a-tag color="red">
          <template
            v-if="params.parent.authenticationOptions.authenticationProviderKey"
          >
            网关验证 ({{
              params.parent.authenticationOptions.authenticationProviderKey
            }})
          </template>
          <template v-else> 节点验证 </template>
        </a-tag>
      </a-descriptions-item>
    </a-descriptions>
    <a-empty v-if="!params.document">
      <div slot="description">
        <div>无描述信息</div>
      </div>
    </a-empty>
    <div v-else>
      <mark-down-editor
        v-model="params.document"
        :readonly="true"
      ></mark-down-editor>
    </div>
  </div>
</template>

<script>
import MarkDownEditor from "@/components/MarkDownEditor";
export default {
  namm: "detailes",
  components: { MarkDownEditor },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  watch: {},
  created() {
  },
  methods: {},
};
</script>
