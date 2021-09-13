<template>
  <div class="vm">
    <h2 class="h-title">按限制范围加载图层</h2>
    <button @click="replaceTheRegion('India')">印度</button>
    <button @click="replaceTheRegion('Argentina')">阿根廷</button>
    <button @click="replaceTheRegion('Nigeria')">尼日利亚</button>
    <button @click="replaceTheRegion('Sweden')">瑞典</button>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import TileJSON from 'ol/source/TileJSON'

export default {
  name: 'SetExtent',
  data () {
    return {
      map: null,
      India: [68.17665, 7.96553, 97.40256, 35.49401],
      Argentina:[-73.41544, -55.25, -53.62835, -21.83231],
      Nigeria: [2.6917, 4.24059, 14.57718, 13.86592],
      Sweden: [11.02737, 55.36174, 23.90338, 69.10625],
      overlay: new Tile({ // 默认显示印度
        extent: [68.17665, 7.96553, 97.40256, 35.49401],
        source: new TileJSON({
          url: 'https://api.tiles.mapbox.com/v4/mapbox.world-black.json?secure&access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q',
          crossOrigin: 'anonymous'
        })
      })
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'map',
        layers: [
          new Tile({
            source: new TileJSON({
              url: 'https://api.tiles.mapbox.com/v4/mapbox.world-light.json?secure&access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q',
              crossOrigin: 'anonymous'
            })
          }),
          this.overlay // 显示指定范围的图层
        ],
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 1
        })
      })
    },
    replaceTheRegion (data) { // 更改显示的国家
      this.overlay.setExtent(this[data]);
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style>

</style>