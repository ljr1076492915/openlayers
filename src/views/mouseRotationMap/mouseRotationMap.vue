<template>
  <div class="vm">
    <h2 class="h-title">鼠标拖拽旋转/缩放</h2>
    <div>按住Shift并使用鼠标拖拽可以旋转、缩放地图</div>
    <div ref="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom'
import * as olInteraction from 'ol/interaction'

export default {
  data() {
    return {
      map: null
    }
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: this.$refs.map,
        interactions: olInteraction.defaults().extend([new DragRotateAndZoom()]),
        layers: [
          new Tile({
            source: new OSM()
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      })
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>

</style>