<template>
  <div class="vm">
    <h2 class="h-title">切换地图容器 getTarget/setTarget</h2>
    <div class="map-bx">
      <div id="map1" class="map-x"></div>
      <div id="map2" class="map-x"></div>
    </div>
    <button class="btn" @click="changeMap">change</button>

    <div class="explain">
      <p>getTarget：获取当前地图容器id值</p>
      <p>setTarget：设置地图容器，填写id值</p>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default {
  name: 'ChangeTarget',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        layers: [
          new Tile({
            source: new OSM()
          })
        ],
        view: new View({
          projection: "EPSG:4326",
          center: [113.100774,29.386975],
          zoom: 10
        })
      })
      this.map.setTarget('map1')
    },

    // 切换容器
    changeMap () {
      // 获取当前地图容器，并进行判断
      let target = this.map.getTarget() === 'map1' ? 'map2' : 'map1';

      // 重新设置地图容器
      this.map.setTarget(target);
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
    height: 380px;
    margin: 0 auto 40px;
    display: flex;
  }

  .map-x {
    width: 380px;
    height: 380px;
  }

  .btn {
    display: block;
    margin: 0 auto;
  }
</style>