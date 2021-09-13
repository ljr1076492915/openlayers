<template>
  <div class="vm">
    <h2 class="h-title">图层遮罩</h2>
    <div id="map" class="map-x" ref="map"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default {
  name: 'CoverageModal',
  data() {
    return {
      map: null
    }
  },
  methods: {
    initMap() {

      let osm = new Tile({
        source: new OSM()
      })
      
      this.map = new Map({
        target: this.$refs.map,
        layers: [osm],
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 1
        })
      })

      osm.on('postrender', event => {

        var ctx = event.context;
        ctx.save()
        var pixelRatio = event.frameState.pixelRatio;
        var size = this.map.getSize();
        // 平移
        ctx.translate(size[0] / 2 * pixelRatio, size[1] / 2 * pixelRatio);
        //缩放
        ctx.scale(3 * pixelRatio, 3 * pixelRatio);
        //平移
        ctx.translate(-75, -80);
        ctx.beginPath();
        ctx.moveTo(75, 40);
        ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
        ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
        ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
        ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
        ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
        ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
        ctx.clip();
        ctx.translate(75, 80);
        ctx.scale(1 / 3 / pixelRatio, 1 / 3 / pixelRatio);
        ctx.translate(-size[0] / 2 * pixelRatio, -size[1] / 2 * pixelRatio);
      })

      osm.on('rendercomplete', function(event) {
        var ctx = event.context;
         ctx.restore();
      });
      
    }
  },
  mounted() {
    this.initMap();
  }
}
</script>

<style lang="scss" scoped>

</style>