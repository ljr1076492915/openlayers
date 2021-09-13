<template>
  <div class="vm">
    <h2 class="h-title">限制图层的最大/最小分辨率 minResolution / maxResolution</h2>
    <div class="explain">
      <p>在限制的范围之内时显示图层，在限制的范围之外时不显示图层</p>
      <p>只有当指定图层在 minResolution 和 maxResolution 范围内，才显示。</p>
    </div>
    <div id="map" class="map-x"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import { OSM, TileJSON } from 'ol/source'

export default {
  name: 'Resolution',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'map',
        layers: [
          new Tile({
            source: new OSM()
          }),
          new Tile({
            source: new TileJSON({
              url: 'https://api.tiles.mapbox.com/v4/mapbox.natural-earth-hypso-bathy.json?secure&access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q',
              crossOrigin: 'anonymous'
            }),

            // 当图层不在 2000 至 20000 时，将不显示该图层
            minResolution: 2000,
            maxResolution: 20000
          })
        ],
        view: new View({
          center: [653600, 5723680],
          zoom: 5
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