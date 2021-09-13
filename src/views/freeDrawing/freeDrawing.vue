<template>
  <div class="vm">
    <h2 class="h-title">自由绘制绘制图形</h2>
    <div class="tools-x">
      <select id="type" v-model="tool">
        <option v-for="item in tools" :key="item.value" :value="item.value">{{item.label}}</option>
      </select>
    </div>
    <div ref="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import Draw from 'ol/interaction/Draw'

export default {
  data() {
    return {
      tool: 'LineString', // 当前选中的工具
      tools: [ // 工具集
        {
          value: 'LineString',
          label: '线条'
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
      map: null, // 地图
      draw: null,
      source: new SourceVector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      })
    }
  },
  watch: {
    tool(newVal) {
      this.addInteraction()
    }
  },
  methods: {
    initMap() {
      let raster = new Tile({
        source: new OSM()
      });

      let vector = new LayerVector({
        source: this.source
      });
      this.map = new Map({
        target: this.$refs.map,
        layers: [raster, vector],
        view: new View({
          projection: "EPSG:4326",
          center: [113.1206, 23.034996],
          zoom: 10
        })
      })
      this.addInteraction()
    },
    addInteraction() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw)
      }
      if (this.tool !== 'None') {
        this.draw = new Draw({
          source: this.source,
          type: this.tool,
          freehand: true
        })
        this.map.addInteraction(this.draw)
      }
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>

</style>