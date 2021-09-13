<template>
  <div class="vm">
    <h2 class="h-title">控制图层层叠关系 Set zIndex</h2>
    <label for="idx1">
      <input type="number" v-model="squareZIndex" />
      方块所在图层的 Z-index
    </label>
    <label for="idx1">
      <input type="number" v-model="triangleZIndex" />
      三角形所在图层的 Z-index
    </label>
    <label for="idx1">
      <input type="number" v-model="starZIndex" />
      星形所在图层的 Z-index
    </label>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import Tile from 'ol/layer/Tile'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import { Style, RegularShape, Fill, Stroke } from 'ol/style'

export default {
  name: 'SetZIndex',
  data () {
    return {
      map: null,
      squareZIndex: 1,
      triangleZIndex: 0,
      starZIndex: 0,
      styles: {
        'square': new Style({
          image: new RegularShape({
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'black', width: 1 }),
            points: 4,
            radius: 80,
            angle: Math.PI / 4
          })
        }),
        'triangle': new Style({
          image: new RegularShape({
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'black', width: 1 }),
            points: 3,
            radius: 80,
            rotation: Math.PI / 4,
            angle: 0
          })
        }),
        'star': new Style({
          image: new RegularShape({
            fill: new Fill({ color: 'green' }),
            stroke: new Stroke({ color: 'black', width: 1 }),
            points: 5,
            radius: 80,
            radius2: 4,
            angle: 0
          })
        })
      },
      layer0: null,
      layer1: null,
      layer2: null
    }
  },
  watch: {
    squareZIndex (newVal) { // 方块所在图层的 Z-index
      this.layer1.setZIndex(parseInt(newVal, 10) || 0)
    },
    triangleZIndex (newVal) { // 三角形所在图层的 Z-index
      this.layer2.setZIndex(parseInt(newVal, 10) || 0)
    },
    starZIndex (newVal) { // 星形所在图层的 Z-index
      this.layer0.setZIndex(parseInt(newVal, 10) || 0)
    }
  },
  methods: {
    initMap () {
      this.layer0 = this.createLayer([40, 40], this.styles['star'], this.starZIndex)
      this.layer1 = this.createLayer([0, 0], this.styles['square'], this.squareZIndex)
      this.layer2 = this.createLayer([0, 40], this.styles['triangle'], this.triangleZIndex)


      // 如果zindex相等，那么🈷越靠后的元素就在越上层
      let layers = [this.layer1, this.layer2, this.layer0]

      this.map = new Map({
        layers,
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 18
        })
      })
    },
    createLayer (coordinates, style, zIndex) { // 绘制图形
      let feature = new Feature(new Point(coordinates))
      feature.setStyle(style)

      let source = new SourceVector({
        features: [feature]
      })

      let vectorLayer = new LayerVector({
        source: source
      })

      vectorLayer.setZIndex(zIndex)

      return vectorLayer
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
  label {
    display: block;
    margin: 10px;
  }
</style>