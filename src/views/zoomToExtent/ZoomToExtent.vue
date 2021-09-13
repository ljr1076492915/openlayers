<template>
  <div class="vm">
    <h2 class="h-title">导览控件 ZoomToExtent</h2>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import BingMaps from 'ol/source/BingMaps'
import * as control from 'ol/control'

export default {
  name: 'ZoomToExtent',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'map',
        controls: control.defaults().extend([
          new control.ZoomToExtent({
            extent: [ // 坐标值
              813079.7791264898, 5929220.284081122,
              848966.9639063801, 5936863.986909639
            ]
          })
        ]),
        layers: [
          new Tile({
            source: new BingMaps({
              key: 'AiZrfxUNMRpOOlCpcMkBPxMUSKOEzqGeJTcVKUrXBsUdQDXutUBFN3-GnMNSlso-',
              imagerySet: 'Aerial'
            })
          })
        ],
        view: new View({
          projection: "EPSG:4326", // 坐标系，有EPSG:4326和EPSG:3857
          center: [114.064839, 22.548857],
          zoom: 6 // 地图缩放级别（打开页面时默认级别）
        })
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style>

</style>