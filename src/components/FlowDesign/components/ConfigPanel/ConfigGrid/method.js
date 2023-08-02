import FlowGraph from '../../../graph/index'

export function gridOpt (globalGridAttr) {
  let options
  if (globalGridAttr.type === 'doubleMesh') {
    options = {
      type: globalGridAttr.type,
      args: [
        {
          color: globalGridAttr.color,
          thickness: globalGridAttr.thickness
        },
        {
          color: globalGridAttr.colorSecond,
          thickness: globalGridAttr.thicknessSecond,
          factor: globalGridAttr.factor
        }
      ]
    }
  } else {
    options = {
      type: globalGridAttr.type,
      args: [
        {
          color: globalGridAttr.color,
          thickness: globalGridAttr.thickness
        }
      ]
    }
  }
  const { graph } = FlowGraph
  graph.drawGrid(options)
}

export function gridSizeOpt (globalGridAttr) {
  const { graph } = FlowGraph
  graph.setGridSize(globalGridAttr.size)
}

const tryToJSON = (val) => {
  try {
    return JSON.parse(val)
  } catch (error) {
    return val
  }
}

export function backGroundOpt (globalGridAttr) {
  const options = {
    color: globalGridAttr.bgColor,
    image: globalGridAttr.showImage ? require('@/assets/images/logo.png') : undefined,
    repeat: globalGridAttr.repeat,
    angle: globalGridAttr.angle,
    size: tryToJSON(globalGridAttr.bgSize),
    position: tryToJSON(globalGridAttr.position),
    opacity: globalGridAttr.opacity
  }
  const { graph } = FlowGraph
  graph.drawBackground(options)
}
