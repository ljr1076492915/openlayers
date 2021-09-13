<template>
  <div class="vm">
    <h2 class="h-title">矢量图 JSON</h2>
    <div id="map" class="map-x"></div>

    <div class="explain">
      
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import CN from '@/assets/data/MapOfChina.json'
import { Map, View } from 'ol'
import SourceVector from 'ol/source/Vector'
import LayerVector from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  name: 'VectorJSON',
  data () {
    return {
      map: null,
      source: new SourceVector({
        features: new GeoJSON().readFeatures(CN, {
          dataProjection: 'EPSG:4326',
          featureProjection: "EPSG:4326"
        })
      }),
      view: new View({
        projection: "EPSG:4326",
        center: [116.403963,39.915119], // 中国
        zoom: 3
      })
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target:'map',
        layers: [
          new LayerVector({
            source: this.source
          })
        ],
        view: this.view
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