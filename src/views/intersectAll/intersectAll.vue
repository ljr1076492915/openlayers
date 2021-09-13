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
import "ol/ol.css";
import { Map, View } from "ol";
import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import Draw, { createRegularPolygon, createBox } from "ol/interaction/Draw";
import Polygon from "ol/geom/Polygon";
import ol from "../../api/ol";
const jsts = require("jsts");
export default {
  data() {
    return {
      tool: "Circle", // 当前选中的工具
      tools: [
        // 工具集
        {
          value: "Circle",
          label: "圆"
        },
        {
          value: "Square",
          label: "方形"
        },
        {
          value: "Rectangle",
          label: "矩形"
        },
        {
          value: "Hexagram",
          label: "六芒星"
        },
        {
          value: "None",
          label: "无"
        }
      ],
      map: null, // 地图
      draw: null,
      source: new SourceVector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      }),
      polygon1: [
        [112.81796099243165, 23.448356595703128],
        [112.87004659624436, 23.364905950447053],
        [112.82451231372445, 23.277707616554782],
        [112.92282549438478, 23.281089750000003],
        [112.9755743254432, 23.198056737648532],
        [113.02180190229082, 23.28488951634983],
        [113.12008501586915, 23.289054837890628],
        [113.06799941205644, 23.372505483146703],
        [113.11353369457635, 23.459703817038974],
        [113.01522051391602, 23.456321683593753],
        [112.9624716828576, 23.539354695945224],
        [112.91624410600998, 23.452521917243928],
        [112.81796099243165, 23.448356595703128]
      ],
      polygon2: [
        [113.05554033813478, 23.484062162109378],
        [112.97321983906973, 23.449628985641166],
        [112.9018110020347, 23.503136800036025],
        [112.89047075805665, 23.41462856835938],
        [112.8084272129722, 23.379540608629775],
        [112.8794074680592, 23.32546555342134],
        [112.86877276000978, 23.236869779296878],
        [112.95109325907482, 23.27130295576509],
        [113.02250209610985, 23.21779514137023],
        [113.0338423400879, 23.306303373046877],
        [113.11588588517235, 23.34139133277648],
        [113.04490563008535, 23.395466387984918],
        [113.05554033813478, 23.484062162109378]
      ]
    };
  },
  watch: {
    tool(newVal) {
      this.addInteraction();
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
      });
      this.addInteraction();
    },
    addInteraction() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw);
      }
      if (this.tool !== "None") {
        let geometryFunction;
        let type = "Circle";

        if (this.tool === "Square") {
          // 方形
          geometryFunction = createRegularPolygon(4);
        } else if (this.tool === "Rectangle") {
          // 矩形
          geometryFunction = createBox();
        } else if (this.tool === "Hexagram") {
          geometryFunction = function(coordinates, geometry) {
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
              var angle = rotation + (i * 2 * Math.PI) / numPoints;
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
          };
        }

        this.draw = new Draw({
          source: this.source,
          type,
          geometryFunction
        });
        this.map.addInteraction(this.draw);
        this.draw.on("drawend", evt => {
          let geom = evt.feature.getGeometry().flatCoordinates;
          let geomeZZ = [[]];
          var geometry = {
            rings: []
          };
          let geomeLS = [0, 0]; // 存每一个经纬度
          for (let i = 0; i < geom.length; i++) {
            if (i % 2 === 0) {
              geomeLS = [0, 0];
              geomeLS[0] = geom[i];
            } else {
              geomeLS[1] = geom[i];
              geomeZZ[0].push(geomeLS);
            }
          }
          geometry.rings = geomeZZ;
          geometry = JSON.stringify(geometry);
          //   console.log(geometry);
        });
      }
    },
    areaCs() {
      var style = {
        point: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 2 * 2,
            fill: new ol.style.Fill({
              color: "rgba(0, 0, 255, 0.8)"
            }),
            stroke: new ol.style.Stroke({
              color: "rgba(0, 0, 0, 0.8)",
              width: 1 / 2
            })
          }),
          zIndex: Infinity
        }),

        polygon: new ol.style.Style({
          fill: new ol.style.Fill({
            //矢量图层填充颜色，以及透明度
            color: "rgba(200, 100, 250, 0.8)"
          }),
          stroke: new ol.style.Stroke({
            //边界样式
            color: "#234120",
            width: 1
          })
        }),
        intersect: new ol.style.Style({
          fill: new ol.style.Fill({
            //矢量图层填充颜色，以及透明度
            color: "rgba(255, 255, 0, 0.8)"
          }),
          stroke: new ol.style.Stroke({
            //边界样式
            color: "#234120",
            width: 1
          })
        })
      };
      var plygon1 = new ol.geom.Polygon([this.polygon1]);
      var plygon2 = new ol.geom.Polygon([this.polygon2]);
      var feature1 = new ol.Feature({
        geometry: plygon1
      });
      var feature2 = new ol.Feature({
        geometry: plygon2
      });
      feature1.setStyle(style.polygon);
      feature2.setStyle(style.polygon);
      var layer1 = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [feature1]
        })
      });
      var layer2 = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [feature2]
        })
      });
      this.map.addLayer(layer1);
      this.map.addLayer(layer2);
      let parser = new jsts.io.OL3Parser();
      parser.inject(
        ol.geom.Point,
        ol.geom.LineString,
        ol.geom.LinearRing,
        ol.geom.Polygon,
        ol.geom.MultiPoint,
        ol.geom.MultiLineString,
        ol.geom.MultiPolygon
      );
      var jstsgeo1 = parser.read(plygon1);
      var jstsgeo2 = parser.read(plygon2);
      var buffer1 = jstsgeo1.buffer(0);
      var buffer2 = jstsgeo2.buffer(0);
      var intersects = buffer1.intersection(buffer2);
      let needArr = this.loadGeometry4362(
        parser.write(intersects).flatCoordinates
      );
      if (!needArr[0].length) return;
      let plygon3 = new ol.geom.Polygon(needArr);
      var fea = new ol.Feature();
      fea.setGeometry(plygon3);
      fea.setStyle(style.intersect);
      var layer3 = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [fea]
        })
      });
      this.map.addLayer(layer3);
      var area = ol.sphere.getArea(plygon3, {
        projection: "EPSG:4326"
      });
      var length = ol.sphere.getLength(plygon3, {
        projection: "EPSG:4326"
      });
      if (area > 10000) {
        area = Math.round((area / 1000000) * 100) / 100 + " " + "km²";
      } else {
        area = Math.round(area * 100) / 100 + " " + "m²";
      }
      if (length > 1000) {
        length = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        length = Math.round(length * 100) / 100 + " " + "m";
      }
      console.log(area);
      console.log(length);
    },
    loadGeometry4362(arr) {
      const geomeZZ = [[]];
      let geomeLS = [0, 0]; // 存每一个经纬度
      for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
          geomeLS = [0, 0];
          geomeLS[0] = arr[i];
        } else {
          geomeLS[1] = arr[i];
          geomeZZ[0].push(geomeLS);
        }
      }
      return geomeZZ;
    }
  },
  mounted() {
    this.initMap();
    this.areaCs();
  }
};
</script>

<style>
</style>