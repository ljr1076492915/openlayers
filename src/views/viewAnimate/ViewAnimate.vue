<template>
  <div class="vm">
    <h2 class="h-title">动画 animate</h2>
    <div id="map" class="map-x"></div>
    <div class="btn-x">
      <button @click="rotateLeft">↻</button>
      <button @click="rotateRight">↺</button>
      <button @click="panToLondon">平移到伦敦</button>
      <button @click="elasticToMoscow">弹性平移到莫斯科</button>
      <button @click="bounceToIstanbul">弹跳平移到伊斯坦布尔</button>
      <button @click="spinToRome">旋转平移到罗马</button>
      <button @click="rotateAroundRome">绕着罗马旋转</button>
      <button @click="flyToBern">飞行到伯尔尼</button>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import * as olEasing from 'ol/easing'
import Tile from 'ol/layer/Tile'
import BingMaps from 'ol/source/BingMaps'

export default {
  name: 'ViewAnimate',
  data () {
    return {
      map: null,
      London: [-0.12755, 51.507222], // 伦敦
      Moscow: [37.6178, 55.7517], // 莫斯科
      Istanbul: [28.9744, 41.0128], // 伊斯坦布尔
      Rome: [12.5, 41.9], // 罗马
      Bern: [7.4458, 46.95], // 伯尔尼
    }
  },
  methods: {
    initMap () {
      this.map = new Map({
        target:'map',
        layers: [
          new Tile({
            source: new BingMaps({
              key: 'AiZrfxUNMRpOOlCpcMkBPxMUSKOEzqGeJTcVKUrXBsUdQDXutUBFN3-GnMNSlso-',
              imagerySet: 'Road'
            })
          })
        ],
        loadTilesWhileAnimating: true, // 当动画过渡当时候允许加载瓦片
        view: new View({
          projection: "EPSG:4326", // 坐标系，有EPSG:4326和EPSG:3857
          center: this.London, // 伦敦
          zoom: 6 // 地图缩放级别（打开页面时默认级别）
        })
      })
    },
    rotateLeft () { // 顺时针旋转
      let currentRotation = this.map.getView().getRotation()
      this.map.getView().animate({
        rotation: currentRotation + 1 // 旋转角度
      })
    },
    rotateRight () { // 逆时针旋转
      let currentRotation = this.map.getView().getRotation()
      this.map.getView().animate({
        rotation: currentRotation - 1 // 旋转角度
      })
    },
    panToLondon () { // 平移到伦敦
      this.map.getView().animate({
        center: this.London, // 目标位置
        duration: 2000 // 动画时长
      })
    },
    elasticToMoscow () { // 弹性平移到莫斯科
      this.map.getView().animate({
        center: this.Moscow, // 目标位置
        easing: olEasing.easeOut // 动画: 传入动画函数，olEasing是内置动画集
      })
    },
    bounceToIstanbul () { // 弹跳平移到伊斯坦布尔
      this.map.getView().animate({
        center: this.Istanbul,
        duration: 2000, // 动画时长
        easing: this.bounce // 动画：传入动画函数
      })
    },
    spinToRome () { // 旋转平移到罗马
      let view = this.map.getView()
      let center = view.getCenter()
      view.animate({ // 将多个动画连在一起使用
        center: [
          center[0] + (this.Rome[0] - center[0]) / 2,
          center[1] + (this.Rome[1] - center[1]) / 2
        ],
        rotation: Math.PI,
        easing: olEasing.easeIn
      }, {
        center: this.Rome,
        rotation: 2 * Math.PI, // 旋转角度
        easing: olEasing.easeOut
      })
    },
    rotateAroundRome () {
      let view = this.map.getView()
      let rotation = view.getRotation()
      view.animate({ // 将多个动画连在一起使用
        rotation: rotation + Math.PI,
        anchor: this.Rome, // 锚点
        easing: olEasing.easeIn // 动画：传入动画函数
      }, {
        rotation: rotation + 2 * Math.PI,
        anchor: this.Rome, // 锚点
        easing: olEasing.easeOut // 动画：传入动画函数
      })
    },
    flyToBern () {
      this.flyTo(this.Bern)
    },
    bounce (t) { // 弹跳动画
      let s = 7.5625;
      let p = 2.75;
      let l;
      if (t < (1 / p)) {
        l = s * t * t;
      } else {
        if (t < (2 / p)) {
          t -= (1.5 / p);
          l = s * t * t + 0.75;
        } else {
          if (t < (2.5 / p)) {
            t -= (2.25 / p);
            l = s * t * t + 0.9375;
          } else {
            t -= (2.625 / p);
            l = s * t * t + 0.984375;
          }
        }
      }
      return l;
    },
    flyTo (location, done = () => {}) { // 飞行动画
      let view = this.map.getView()
      let duration = 2000;
      let zoom = view.getZoom();
      let parts = 2;
      let called = false;
      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      }
      view.animate({
        center: location,
        duration: duration
      }, callback);
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
          zoom: zoom,
          duration: duration / 2
        }, callback);
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
  .btn-x {
    text-align: center;
    margin-top: 20px;

    button {
      margin: 0 10px;
    }
  }
</style>