<template>
  <div class="vm">
    <h2 class="h-title">比例尺控件 ScaleLine</h2>

    <select id="units" v-model="scaleplate">
      <option v-for="item in scaleplateList" :key="item.v">{{item.t}}</option>
    </select>
    
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
  name: 'ScaleLine',
  data () {
    return {
      map: null,
      scaleLineControl: new control.ScaleLine(),
      scaleplate: '度',
      scaleplateList: [
        {
          t: '度',
          v: 'degrees'
        },
        {
          t: '英制英尺',
          v: 'imperial'
        },
        {
          t: '美制英尺',
          v: 'us'
        },
        {
          t: '海里',
          v: 'nautical'
        },
        {
          t: '公制',
          v: 'metric'
        }
      ]
    }
  },
  watch: {
    // 监听比例尺单位切换
    scaleplate (newVal, oldVal) {
      this.setScaleLine()
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target: 'map',
        // 添加控件
        controls: control.defaults().extend([
          this.scaleLineControl // 比例尺
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
      this.setScaleLine() // 设置比例尺单位
    },
    setScaleLine () { // 设置比例尺单位
      // 从列表里找到当前单位
      let unit = this.scaleplateList.find(item => {
        return item.t === this.scaleplate
      })
      // 设置单位，注意unit.v的值，必须使用这些值
      this.scaleLineControl.setUnits(unit.v)
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style>

</style>