<template>
  <div class="vm">
    <h2 class="h-title">预加载 preload</h2>
    <div class="map-bx">
      <div id="map1" class="map-x"></div>
      <div id="map2" class="map-x"></div>
    </div>

    <div class="explain">
      <p>预加载：preload: Infinity</p>
      <p>默认值：preload: 0</p>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import BingMaps from 'ol/source/BingMaps'

export default {
  name: 'PreloadMap',
  data () {
    return {
      map1: null,
      map2: null,
      mapView: new View({
        projection: "EPSG:4326",
        center: [114.064839, 22.548857],
        zoom: 10
      })
    }
  },
  methods: {
    initMap () {
      // 初始化 map1
      this.map1 = new Map({
        target: 'map1',
        layers: [
          new Tile({
            prreload: Infinity, // 预加载
            source: new BingMaps({
              key: 'AiZrfxUNMRpOOlCpcMkBPxMUSKOEzqGeJTcVKUrXBsUdQDXutUBFN3-GnMNSlso-',
              imagerySet: 'Aerial'
            })
          })
        ],
        view: this.mapView
      })

      this.map2 = new Map({
        target: 'map2',
        layers: [
          new Tile({
            prreload: 0, // 默认值
            source: new BingMaps({
              key: 'AiZrfxUNMRpOOlCpcMkBPxMUSKOEzqGeJTcVKUrXBsUdQDXutUBFN3-GnMNSlso-',
              imagerySet: 'AerialWithLabels'
            })
          })
        ],
        view: this.mapView
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
  .map-bx {
    width: 800px;
    margin: 0 auto 40px;
  }

  .map-x {
    width: 800px;
    height: 380px;
    position: relative;
    margin-bottom: 40px;
  }

  #map1::after,
  #map2::after {
    position: absolute;
    display: block;
    font-size: 18px;
    left: 50%;
    bottom: -28px;
    transform: translateX(-50%);
  }

  #map1::after {
    content: '预加载'
  }

  #map2::after {
    content: '默认'
  }

</style>