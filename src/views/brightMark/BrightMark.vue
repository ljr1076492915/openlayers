<template>
  <div class="vm">
    <h2 class="h-title">定义标记颜色</h2>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import Tile from 'ol/layer/Tile'
import TileJSON from 'ol/source/TileJSON'
import Point from 'ol/geom/Point'
import * as style from 'ol/style'
import sourceVector from 'ol/source/Vector'
import layerVecor from 'ol/layer/Vector'

export default {
  name: 'BrightMark',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {

      // 罗马
      let rome = new Feature({
        geometry: new Point([12.5, 41.9])
      })

      // 伦敦
      let london = new Feature({
        geometry: new Point([-0.12755, 51.507222])
      })

      // 马德里
      let madrid = new Feature({
        geometry: new Point([-3.683333, 40.4])
      })

      // 设置罗马标记点样式
      rome.setStyle(new style.Style({
        image: new style.Icon({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: require('../../assets/images/dot.png')
        })
      }))

      // 设置伦敦标记点样式
      london.setStyle(new style.Style({
        image: new style.Icon({
          color: '#4271AE',
          crossOrigin: 'anonymous',
          src: require('../../assets/images/dot.png')
        })
      }))

      // 设置马德里标记点样式
      madrid.setStyle(new style.Style({
        image: new style.Icon({
          color: [113, 140, 0],
          crossOrigin: 'anonymous',
          src: require('../../assets/images/dot.png')
        })
      }))

      let vectorSource = new sourceVector({
        features: [rome, london, madrid]
      })

      let vectorLayer = new layerVecor({
        source: vectorSource
      })

      // 底图
      let rasterLayer = new Tile({
        source: new TileJSON({
          url: 'https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q',
          crossOrigin: ''
        })
      })

      this.map = new Map({
        target: 'map',
        layers: [rasterLayer, vectorLayer],
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 3
        })
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>

</style>