<template>
  <div id="app">
    <!-- <button @click="toUpdate">切换数据</button> -->
    <div id="container"></div>
  </div>
</template>

<script>
// import {init,update} from './utils/g6Utils.min.js';
import G6 from '@antv/g6';
// import insertCss from 'insert-css'

export default {
  name: 'gpolyline',
  data() {
    return {};
  },
  methods: {},
  mounted() {
    /**
     * 演示贝塞尔曲线的用法
     *
     *  **/
    const data = {
      nodes: [
        {
          id: 'node1',
          x: 700,
          y: 100,
          // size: [300, 60],
          label: 'node1\n换行',
          anchorPoints: [
            [0.5, 1],
            [0, 0.5],
          ],
        },
        {
          id: 'node2',
          x: 700,
          y: 200,
          label: '2',
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: 'node3',
          x: 100,
          y: 100,
          label: '3',
          anchorPoints: [
            [1, 0.5],
            [0.5, 1],
          ],
        },
        {
          id: 'node5',
          x: 100,
          y: 20,
          label: '5',
          anchorPoints: [
            [0, 0.5],
            [0.5, 1],
          ],
        },
        {
          id: 'node4',
          x: 100,
          y: 200,
          label: '4',
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: 'node20',
          x: 100,
          y: 600,
          label: '20',
          anchorPoints: [
            [0, 0.5],
            [0.8, 1],
            [0.3, 0],
            [0.5, 0],
          ],
        },
        {
          id: 'node20-1',
          x: 50,
          y: 675,
          label: '20-1',
          size: [100, 25],
          anchorPoints: [
            [1, 0.5],
            [0, 0.5],
          ],
        },
        {
          id: 'node20-2',
          x: 50,
          y: 725,
          label: '20-2',
          size: [100, 25],
          anchorPoints: [
            [1, 0.5],
            [0, 0.5],
          ],
        },
        {
          id: 'node6',
          x: 100,
          y: 350,
          label: '6',
          anchorPoints: [
            [0.5, 0],
            [0.3, 1],
            [0.8, 1],
          ],
        },
        {
          id: 'node7',
          x: 300,
          y: 350,
          label: '7',
          anchorPoints: [
            [0.5, 0],
            [1, 0.5],
          ],
        },
        {
          id: 'node8',
          x: 500,
          y: 350,
          label: '8',
          anchorPoints: [
            [0.5, 0],
            [1, 0.5],
          ],
        },
        {
          id: 'node9',
          x: 700,
          y: 350,
          label: '9',
          anchorPoints: [
            [0.5, 0],
            [0.2, 1],
            [0.3, 1],
            [0.4, 1],
            [0.5, 1],
            [0.6, 1],
            [0.7, 1],
            [0.8, 1],
            [0.85, 1],
          ],
        },
        {
          id: 'node18',
          x: 375,
          y: 450,
          label: '18',
          anchorPoints: [
            [0.5, 1],
            [1, 0.5],
          ],
        },
        {
          id: 'node19',
          x: 375,
          y: 550,
          label: '19',
          anchorPoints: [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.6],
            [0, 0.3],
          ],
        },
        {
          id: 'node19-1',
          x: 450,
          y: 625,
          size: [100, 25],
          label: '19-1',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        {
          id: 'node19-2',
          x: 450,
          y: 675,
          size: [100, 25],
          label: '19-1',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        {
          id: 'node19-3',
          x: 450,
          y: 725,
          size: [100, 25],
          label: '19-1',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
      ],
      edges: [
        {
          source: 'node1',
          target: 'node2',
          type: 'line',
          sourceAnchor: 0,
          // 该边连入 target 点的第 0 个 anchorPoint，
          targetAnchor: 0,
        },
        {
          source: 'node1',
          target: 'node3',
          sourceAnchor: 1,
          // 该边连入 target 点的第 0 个 anchorPoint，
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: 10,
          },
        },
        {
          source: 'node2',
          target: 'node9',
          sourceAnchor: 1,
          // 该边连入 target 点的第 0 个 anchorPoint，
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'end',
            refY: 40,
            refX: -10,
          },
        },
        {
          source: 'node2',
          target: 'node7',
          sourceAnchor: 1,
          // 该边连入 target 点的第 0 个 anchorPoint，
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'end',
            refY: 40,
            refX: -10,
          },
        },
        {
          source: 'node2',
          target: 'node8',
          sourceAnchor: 1,
          // 该边连入 target 点的第 0 个 anchorPoint，
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'end',
            refY: 40,
            refX: -10,
          },
        },
        {
          source: 'node3',
          target: 'node4',
          sourceAnchor: 1,
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: 10,
          },
        },
        {
          source: 'node4',
          target: 'node6',
          sourceAnchor: 1,
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: 10,
          },
        },
        {
          source: 'node20',
          target: 'node5',
          sourceAnchor: 0,
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: -5,
          },
        },
        {
          source: 'node18',
          target: 'node19',
          sourceAnchor: 0,
          targetAnchor: 0,
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: 10,
          },
        },
        {
          source: 'node18',
          target: 'node9',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
            startArrow: true,
          },
          sourceAnchor: 1,
          targetAnchor: 1,
        },
        {
          source: 'node19',
          target: 'node9',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
            startArrow: true,
          },
          sourceAnchor: 1,
          targetAnchor: 2,
        },
        {
          source: 'node19',
          target: 'node19-1',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 2,
          targetAnchor: 0,
        },
        {
          source: 'node19',
          target: 'node19-2',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 2,
          targetAnchor: 0,
        },
        {
          source: 'node19',
          target: 'node19-3',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 2,
          targetAnchor: 0,
        },
        {
          source: 'node9',
          target: 'node19-1',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
            startArrow: true,
          },
          sourceAnchor: 3,
          targetAnchor: 1,
        },
        {
          source: 'node9',
          target: 'node19-2',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
            startArrow: true,
          },
          sourceAnchor: 3,
          targetAnchor: 1,
        },
        {
          source: 'node9',
          target: 'node19-3',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
            startArrow: true,
          },
          sourceAnchor: 3,
          targetAnchor: 1,
        },
        {
          source: 'node6',
          target: 'node19',
          style: {
            offset: 15,
            endArrow: true,
            lineDash: [2, 2, 2],
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 2,
          targetAnchor: 4,
        },
        {
          source: 'node19',
          target: 'node20',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          label: '100%',
          labelCfg: {
            position: 'middle',
            refY: -10,
          },
          sourceAnchor: 3,
          targetAnchor: 3,
        },
        {
          source: 'node16',
          target: 'node16-1',
          label: '100%',
          labelCfg: {
            position: 'end',
            refX: 4,
            refY: 20,
          },
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 0,
          targetAnchor: 0,
        },
        {
          source: 'node16',
          target: 'node16-2',
          label: '100%',
          labelCfg: {
            position: 'end',
            refX: 4,
            refY: 20,
          },
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 0,
          targetAnchor: 0,
        },
        {
          source: 'node16',
          target: 'node16-3',
          label: '456',
          labelCfg: {
            position: 'end',
            refX: 120,
            refY: 20,
          },
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 0,
          targetAnchor: 0,
        },
        {
          source: 'node6',
          target: 'node20',
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
          },
          sourceAnchor: 1,
          targetAnchor: 2,
        },
        {
          source: 'node6',
          target: 'node20-1',
          style: {
            offset: 55,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
          },
          sourceAnchor: 1,
          targetAnchor: 1,
        },
        {
          source: 'node6',
          target: 'node20-2',
          style: {
            offset: 55,
            endArrow: true,
            lineWidth: 2,
            lineDash: [2, 2, 2],
            stroke: '#333',
          },
          sourceAnchor: 1,
          targetAnchor: 1,
        },
        {
          source: 'node20',
          target: 'node20-1',
          label: 'trhtr',
          labelCfg: {
            position: 'end',
            refX: 130,
            refY: 25,
          },
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 1,
          targetAnchor: 0,
        },
        {
          source: 'node20',
          target: 'node20-2',
          label: '100%',
          labelCfg: {
            position: 'end',
            refX: 10,
            refY: 20,
          },
          style: {
            offset: 15,
            endArrow: true,
            lineWidth: 2,
            stroke: '#333',
          },
          sourceAnchor: 1,
          targetAnchor: 0,
        },
      ],
    };

    const width = document.getElementById('container').scrollWidth;
    // const height = document.getElementById('container').scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height: 700,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'click-select'],
      },
      // 节点类型及样式
      defaultNode: {
        type: 'rect',
        size: [150, 50],
        style: {
          fill: '#DEE9FF',
          stroke: '#5B8FF9',
        },
      },
      // 连线类型及样式
      defaultEdge: {
        type: 'polyline',
        style: {
          // stroke: '#F6BD16',
          offset: 25,
          endArrow: true,
          lineWidth: 2,
          stroke: '#333',
        },
      },
    });
    graph.data(data);
    graph.render();
  },
};
</script>

<style>
#container {
  width: 100%;
  height: 100%;
  border: 1px saddlebrown solid;
}
</style>
