<template>
  <div class="vm">
    <h2 class="h-title">标记 marker</h2>
    <div id="map" class="map-x"></div>
    <a
      class="vienna"
      target="_blank"
      ref="viennaTxt"
			href="https://baike.baidu.com/item/%E7%BB%B4%E4%B9%9F%E7%BA%B3/6412?fr=aladdin"
    >维也纳</a>
    <div class="marker" title="Marker" ref="marker"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Overlay from 'ol/Overlay.js'
export default {
  name: 'MapMarker',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      let pos = fromLonLat([16.3725, 48.208889]) // 维也纳坐标
      
      // 维也纳文字标签
      let vienna = new Overlay({
			  position: pos,
			  element: this.$refs.viennaTxt
      })
      
      // 维也纳“圆点”标签
      let marker = new Overlay({
        position: pos,
        positioning: "center-center", // 如果不配置，则圆的左上角和坐标点对其
        element: this.$refs.marker,
        stopEvent: false, // 不阻止默认事件，比如鼠标放到圆点上时，滚动鼠标滚轮，也可以缩放地图
      })

      // 实例化地图
      this.map = new Map({
        target: 'map', // 地图容器id
        layers: [
          new Tile({
            source: new OSM()
          })
        ],
        // overlays: [marker, vienna],
        view: new View({
          center: pos,
          zoom: 12 // 地图缩放级别（打开页面时默认级别）
        })
      })

      this.map.addOverlay(marker); // 添加图形标记
      this.map.addOverlay(vienna); // 添加文字标记
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style>
  .marker {
    width: 20px;
    height: 20px;
    border: 1px solid #088;
    border-radius: 10px;
    background-color: #0ff;
    opacity: 0.5;
  }
  .vienna {
    text-decoration: none;
    color: white;
    font-size: 11pt;
    font-weight: bold;
    text-shadow: black 0.1em 0.1em 0.2em;
  }
</style>