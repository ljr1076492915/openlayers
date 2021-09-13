<template>
  <div class="vm">
    <h2 class="h-title">绘制图形</h2>
    <div class="tools-x">
      <select id="type" v-model="tool">
        <option v-for="item in tools" :key="item.value" :value="item.value">{{item.label}}</option>
      </select>
    </div>
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
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw'
import Polygon from 'ol/geom/Polygon'

export default {
  data() {
    return {
      tool: 'Circle', // 当前选中的工具
      tools: [ // 工具集
        {
          value: 'Circle',
          label: '圆'
        },
        {
          value: 'Square',
          label: '方形'
        },
        {
          value: 'Rectangle',
          label: '矩形'
        },
        {
          value: 'Hexagram',
          label: '六芒星'
        },
        {
          value: 'None',
          label: '无'
        }
      ],
      map: null, // 地图
      draw: null,
      source: new SourceVector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      })
    }
  },
  watch: {
    tool(newVal) {
      this.addInteraction()
    }
  },
  methods: {
    initMap() {
      let raster = new Tile({
        source: new OSM()
      });

      let vector = new LayerVector({
        source: this.source
      });
      this.map = new Map({
        target: this.$refs.map,
        layers: [raster, vector],
        view: new View({
          projection: "EPSG:4326",
          center: [113.1206, 23.034996],
          zoom: 10
        })
      })
      this.addInteraction()
    },
    addInteraction() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw)
      }
      if (this.tool !== 'None') {
        let geometryFunction
        let type = 'Circle'
        
        if (this.tool === 'Square') {
          // 方形
          geometryFunction = createRegularPolygon(4)
        } else if (this.tool === 'Rectangle') {
          // 矩形
          geometryFunction = createBox()
        } else if (this.tool === 'Hexagram') {
          geometryFunction = function (coordinates, geometry) {
            //中心点
						var center = coordinates[0];
						//鼠标点击的另一个点
						var last = coordinates[1];
						var dx = center[0] - last[0];
						var dy = center[1] - last[1];
						//半径
						var radius = Math.sqrt(dx * dx + dy * dy);
						//旋转的角度
						var rotation = Math.atan2(dy, dx);
						//用来记录顶点坐标的数组
						var newCoordinates = [];
						//顶点个数
						var numPoints = 12;
						for (var i = 0; i < numPoints; ++i) {
							//顶点相对转过的角度
							var angle = rotation + i * 2 * Math.PI / numPoints;
							//确定凸顶点和凹顶点
							var fraction = i % 2 === 0 ? 1 : 0.58;
							//计算顶点的坐标
							var offsetX = radius * fraction * Math.cos(angle);
							var offsetY = radius * fraction * Math.sin(angle);							
							newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
						}
						newCoordinates.push(newCoordinates[0].slice());
						if (!geometry) {
							geometry = new Polygon([newCoordinates]);
						} else {
							geometry.setCoordinates([newCoordinates]);
						}
						return geometry;
          }
        }

        this.draw = new Draw({
          source: this.source,
          type,
          geometryFunction
        })
        this.map.addInteraction(this.draw)
      }
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>

</style>