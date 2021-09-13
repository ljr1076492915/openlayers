<template>
    <div class="vm">
        <h2 class="h-title">绘制点、线、面</h2>
        <button @click="clean">清除</button>
        <div class="tools-x">
            <select id="type" v-model="tool">
                <option v-for="item in tools" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
        </div>
        <div ref="map" class="map-x"></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerVector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import Circle from 'ol/style/Circle';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

export default {
    data() {
        return {
            tool: 'Polygon', // 当前选中的工具
            tools: [
                // 工具集
                {
                    value: 'Point',
                    label: '点'
                },
                {
                    value: 'LineString',
                    label: '线'
                },
                {
                    value: 'Polygon',
                    label: '多边形'
                },
                {
                    value: 'Circle',
                    label: '圆'
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
            }),
            draws: []
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
                source: this.source,
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'rgba(227,215,230,0.7)'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                    // 线样式
                    stroke: new Stroke({
                        color: 'rgba(227,215,230,0.7)',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 5
                    }),
                    // 填充样式
                    fill: new Fill({
                        color: 'rgba(227,215,230,0.7)'
                    })
                })
            });
            this.map = new Map({
                target: this.$refs.map,
                layers: [raster, vector],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [113.1206, 23.034996],
                    zoom: 10
                })
            });
            this.addInteraction();
            this.mapClick();
        },
        addInteraction() {
            if (this.draw !== null) {
                this.map.removeInteraction(this.draw);
            }

            if (this.tool !== 'None') {
                this.draw = new Draw({
                    source: this.source,
                    id: 1,
                    type: this.tool
                });
                this.map.addInteraction(this.draw);
                let _this = this;
                this.draw.on('drawend', function(evt) {
                     let geom = evt.feature.getGeometry().flatCoordinates;
                     var geomeZZ = [
                         []
                     ];
                     var geomeLS = [0, 0];
                     var geometry = {
                         rings: []
                     };
                     for (let i = 0; i < geom.length - 2; i++) {
                         if (i % 2 === 0) {
                             geomeLS = [0, 0];
                             geomeLS[0] = geom[i];
                         } else {
                             geomeLS[1] = geom[i];
                             geomeZZ[0].push(geomeLS);
                         }
                     }
                     console.log(geomeLS)
                     console.log(geomeZZ)
                });
            }
        },
        mapClick() {
            let _this = this;
            this.map.on(
                'singleclick',
                function(evt) {
                    const coordinate = evt.coordinate;
                    var pixel = _this.map.getEventPixel(evt.originalEvent);
                    var feature = _this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                        return feature;
                    });
                    if (feature) {
                        // console.log(feature);
                    }
                }.bind(this)
            );
        },
        clean() {}
    },
    mounted() {
        this.initMap();
    }
};
</script>

<style></style>
