<template>
  <div class="vm">
    <h2 class="h-title">简单的标记</h2>
    <div ref="popup" class="popup" v-show="shopPopup"></div>
    <div id="map" class="map-x"></div>
    <div class="explain">
      <p>可以用Overlay实现，像弹窗那个demo里那样。</p>
      <p>但当图标比较多的情况下，就需要加入非常多的HTML元素，从而造成效率降低。</p>
      <hr>
      <p>需要注意的是，这个标记使用了一张图标图片，这个图片放在项目的assets里。如果要引入这个图片，就需要使用import或者require引入这个图片。</p>
    </div>
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
import Overlay from 'ol/Overlay'

// 引入图标图片
import iconPng from '@/assets/images/icon.png'

export default {
  name: 'SimplenessLabel',
  data () {
    return {
      map: null,
      overlay: null,
      popup: null,
      shopPopup: false
    }
  },
  methods: {
    initMap () {
      // 创建图标特性
      let iconFeature = new Feature({
        geometry: new Point([0, 0]), // 图标展示的位置
        name: '你点我了',
        population: 4000,
        rainfall: 500
      })

      // 创建图标样式
      let iconStyle = new style.Style({
        image: new style.Icon({ // 定义图标锚点
          anchor: [0.5, 46], // 根据图标的大小，对应上面 [0, 0] 的坐标
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          // 图标所使用的图片文件
          // src: require('../../assets/images/icon.png')
          // 或者
          src: iconPng
        })
      })

      // 把样式应用到图标上
      iconFeature.setStyle(iconStyle)

      // 创建矢量容器，将图标特性添加进容器中
      let vectorSource = new sourceVector({
        features: [iconFeature]
      })

      // 创建矢量图层
      let vectorLayer = new layerVecor({
        source: vectorSource
      })

      // 底图源
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
          center: [0, 0],
          zoom: 3
        })
      })

      // 弹窗
      this.map.on('singleclick', e => {
        let elPopup = this.$refs.popup
        this.popup = new Overlay({
          element: elPopup,
          positioning: 'bottom-center',
          stopEvent: false,
          offset: [0, -50]
        })
        this.map.addOverlay(this.popup)
        let feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
        
        if (feature) {
          this.shopPopup = true
          elPopup.innerHTML = feature.values_.name
          let coordinates = feature.getGeometry().getCoordinates()
          setTimeout(() => {
            this.popup.setPosition(coordinates)
          }, 0)
        } else {
          this.shopPopup = false
        }
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
  .popup {
    background: #fff;
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  }
</style>