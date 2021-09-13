<template>
  <div class="vm">
    <h2 class="h-title">修改已绘制的图形</h2>
    <div class="tools-x">
      <select id="type" v-model="tool">
        <option v-for="item in tools" :key="item.value" :value="item.value">{{item.label}}</option>
      </select>
    </div>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import { Draw, Modify, Snap} from 'ol/interaction'
import { Style, Fill, Stroke, Circle } from 'ol/style'

export default {
  data() {
    return {
      tool: 'Circle', // 当前选中的工具
      tools: [ // 工具集
        {
          value: 'Point',
          label: '点'
        },
        {
          value: 'LineString',
          label: '线'
        },
        {
          value: 'Polygon',
          label: '多边形'
        },
        {
          value: 'Circle',
          label: '圆'
        },
        {
          value: 'None',
          label: '无'
        }
      ],
      map: null,
      draw: null,
      source: new SourceVector(),
      draw: null,
      snap: null
    }
  },
  watch: {
    tool(newVal) {
      this.addInteractions()
    }
  },
  methods: {
    initMap() {
      let raster = new Tile({
        source: new OSM()
      });

      let vector = new LayerVector({
        source: this.source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      })

      this.map = new Map({
        target: 'map',
        layers: [raster, vector],
        view: new View({
          projection: "EPSG:4326",
          center: [115.543045,45.16871],
          zoom: 10
        })
      })

      let modify = new Modify({
        source: this.source,
        insertVertexCondition: () => false // 如果返回true，可以增加节点
      })

      this.map.addInteraction(modify)
      this.addInteractions()
    },
    addInteractions() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw)
      }
      if (this.snap !== null) {
        this.map.removeInteraction(this.snap)
      }

      this.draw = new Draw({
        source: this.source,
        type: this.tool
      })
      this.map.addInteraction(this.draw)

      this.snap = new Snap({source: this.source})
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>

</style>