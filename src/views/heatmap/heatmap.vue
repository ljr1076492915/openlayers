<template>
  <div class="vm">
    <h2 class="h-title">热力图 Heatmap</h2>

    <label>半径大小</label>
    <input id="radius" type="range" min="1" max="50" step="1" v-model="radius" @change="changeRadius" />
    
    <label>模糊半径</label>
    <input id="blur" type="range" min="1" max="50" step="1" v-model="blur" @change="changeBlur" />

    <button @click="getHeatName">输出涂层名</button>

    <div id="map" class="map-x" ref="map"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Heatmap, Tile } from 'ol/layer'
import { Vector as SourceVector, Stamen } from 'ol/source' // Stamen是底图
import HeatData from '@/assets/data/heatData.json' // 热力图数据
import GeoJSON from 'ol/format/GeoJSON' // 解析geojson格式

export default {
  data() {
    return {
      map: null,
      radius: 5,
      blur: 15,
      vector: new Heatmap({ // 热力图
        name: '热力热力',
        source: new SourceVector({
          features: new GeoJSON().readFeatures(HeatData, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:4326"
          })
        }),
        radius: 10, // 半径大小
        blur: 10, // 模糊
        gradient: ["#00f", "#0ff", "#0f0", "#ff0", "#f00"], // 热力图颜色（可以不设置）
      })
    }
  },
  methods: {

    // 初始化地图
    initMap() {
      let raster = new Tile({
        source: new Stamen({
          layer: 'toner'
        })
      })

      this.map = new Map({
        target: this.$refs.map,
        layers: [raster, this.vector],
        view: new View({
          center: [20.042007, -35.349998],
          zoom: 19
        })
      })
    },

    // 修改半径大小
    changeRadius() {
      this.vector.setRadius(parseInt(this.radius, 10));
    },

    // 修改模糊半径
    changeBlur() {
      this.vector.setBlur(parseInt(this.blur, 10))
    },

    getHeatName() {
      let layers = this.map.getLayers()
      for (var i = 0; i < layers.getLength(); i++) {
        // console.log(layers.item(i))
        console.log('图层名：', layers.item(i).get('name'))
      }
    }
  },
  mounted() {
    this.initMap();
  }
}
</script>
 
<style lang="scss" scoped>

</style>