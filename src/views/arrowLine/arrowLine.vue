<template>
  <div class="vm">
    <h2 class="h-title">带箭头的线段</h2>
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
import { Style, Stroke, Icon } from 'ol/style'
import Point from 'ol/geom/Point'

export default {
  data() {
    return {
      map: null,
      source: new SourceVector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      })
    }
  },
  methods: {
    initMap() {

      function styleFunction(feature) {
        let geometry = feature.getGeometry()
        let styles = [
          new Style({
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            })
          })
        ]

        geometry.forEachSegment((start, end) => {
          let dx = end[0] - start[0]
          let dy = end[1] - start[1]
          let rotation = Math.atan2(dy, dx)
          styles.push(new Style({
            geometry: new Point(end),
            image: new Icon({
              src: require('@/assets/images/arrow.png'),
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
          }))
        })
        return styles
      }

      let raster = new Tile({
        source: new OSM()
      });

      let vector = new LayerVector({
        source: this.source,
        style: styleFunction
      });

      this.map = new Map({
        target: this.$refs.map,
        layers: [raster, vector],
        view: new View({
          projection: "EPSG:4326",
          center: [115.543045,45.16871],
          zoom: 10
        })
      })

      this.map.addInteraction(new Draw({
        source: this.source,
        type: 'LineString',
        // freehand: true // 如果加上自由绘制哈哈哈哈哈哈
      }))
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>

</style>