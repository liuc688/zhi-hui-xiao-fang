<template>
  <div class="config">
    <config-grid v-show="type === 'grid'" :globalGridAttr="globalGridAttr" :id="id"/>
    <config-node v-show="type === 'node'" :globalGridAttr="globalGridAttr" :id="id"/>
    <config-edge v-show="type === 'edge'" :globalGridAttr="globalGridAttr" :id="id"/>
  </div>
</template>

<script>
import ConfigGrid from './ConfigGrid/index.vue'
import ConfigNode from './ConfigNode/index.vue'
import ConfigEdge from './ConfigEdge/index.vue'
import FlowGraph from '../../graph'
import './index.less'
import { globalGridAttr } from '../../models/global'

export default {
  name: 'Index',
  components: {
    ConfigGrid,
    ConfigNode,
    ConfigEdge
  },
  data() {
    return {
      type: 'grid',
      id: '',
      globalGridAttr: globalGridAttr
    }
  },
  mounted() {
    setTimeout(() => {
      this.boundEvent()
    }, 200)
  },
  methods: {
    boundEvent() {
      const { graph } = FlowGraph
      graph.on('blank:click', () => {
        this.type = 'grid'
      })
      graph.on('cell:click', ({ cell }) => {
        this.type = cell.isNode() ? 'node' : 'edge'
        this.id = cell.id
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
