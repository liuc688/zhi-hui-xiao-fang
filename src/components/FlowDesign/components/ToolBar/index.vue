<template>
  <div class="bar">
    <a-tooltip placement="bottom">
      <template #title>
        <span>清除 (Cmd + D)</span>
      </template>
      <a-button name="delete" @click="handleClick" class="item-space" size="small" icon="delete" >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>撤销 (Cmd + Z)</span>
      </template>
      <a-button
        :disabled="!canUndo"
        name="undo"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="undo">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>Redo (Cmd + Shift + Z)</span>
      </template>
      <a-button
        :disabled="!canRedo"
        name="redo"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="redo">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>复制 (Cmd + Shift + Z)</span>
      </template>
      <a-button name="copy" @click="handleClick" class="item-space" size="small" icon="copy">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>剪切 (Cmd + X)</span>
      </template>
      <a-button name="cut" @click="handleClick" class="item-space" size="small" icon="scissor">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>粘贴 (Cmd + V)</span>
      </template>
      <a-button name="paste" @click="handleClick" class="item-space" size="small" icon="snippets">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>保存PNG (Cmd + S)</span>
      </template>
      <a-button name="savePNG" @click="handleClick" class="item-space" size="small" icon="download">
        png
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>保存SVG (Cmd + S)</span>
      </template>
      <a-button name="saveSVG" @click="handleClick" class="item-space" size="small" icon="download">
        svg
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>打印 (Cmd + P)</span>
      </template>
      <a-button name="print" @click="handleClick" class="item-space" size="small" icon="printer">
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>导出 (Cmd + P)</span>
      </template>
      <a-button name="toJSON" @click="handleClick" class="item-space" size="small">
        toJSON
      </a-button>
    </a-tooltip>

  </div>
</template>

<script>
import FlowGraph from '../../graph'
import { DataUri } from '@antv/x6'

export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      canUndo: '',
      canRedo: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.initEvent()
    }, 200)
  },
  methods: {
    initEvent () {
      const { graph } = FlowGraph
      const { history } = graph
      history.on('change', () => {
        this.canUndo = history.canUndo()
        this.canRedo = history.canRedo()
      })
      graph.bindKey('ctrl+z', () => {
        if (history.canUndo()) {
          history.undo()
        }
        return false
      })
      graph.bindKey('ctrl+shift+z', () => {
        if (history.canRedo()) {
          history.redo()
        }
        return false
      })
      graph.bindKey('ctrl+d', () => {
        graph.clearCells()
        return false
      })
      graph.bindKey('ctrl+s', () => {
        graph.toPNG((datauri) => {
          DataUri.downloadDataUri(datauri, 'chart.png')
        })
        return false
      })
      graph.bindKey('ctrl+p', () => {
        graph.printPreview()
        return false
      })
      graph.bindKey('ctrl+c', this.copy)
      graph.bindKey('ctrl+v', this.paste)
      graph.bindKey('ctrl+x', this.cut)
    },
    copy () {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    },
    cut () {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    },
    paste () {
      const { graph } = FlowGraph
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    },
    handleClick (event) {
      const { graph } = FlowGraph
      const name = event.currentTarget.name
      switch (name) {
        case 'undo':
          graph.history.undo()
          break
        case 'redo':
          graph.history.redo()
          break
        case 'delete':
          graph.clearCells()
          break
        case 'savePNG':
          graph.toPNG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(dataUri, 'chartx.png')
          }, {
            backgroundColor: 'white',
            padding: {
              top: 20,
              right: 30,
              bottom: 40,
              left: 50
            },
            quality: 1
          })
          break
        case 'saveSVG':
          graph.toSVG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
          })
          break
        case 'print':
          graph.printPreview()
          break
        case 'copy':
          this.copy()
          break
        case 'cut':
          this.cut()
          break
        case 'paste':
          this.paste()
          break
        case 'toJSON':
          console.log(graph.toJSON())
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}
.bar{
  margin-left:16px;
  margin-right:16px;
}
.item-space{
  //margin-left:16px;
}
</style>
