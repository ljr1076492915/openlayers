<template>
    <div class="vm">
        <h2 class="h-title">加载多边形</h2>
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
import ol from '../../api/ol.js';
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
                wrapX: false
            }),
            draws: [],
            deleteMapBox: '',
            drawDyData: [
                [119.18954447642137, 1.6834658203125],
                [119.13804606333544, 1.6633814392089843],
                [119.24018458262255, 1.6501635131835937],
                [119.18954447642137, 1.6834658203125]
            ],
            drawDyDataNew: [
                [119.12894801035692, 1.7080133972167968],
                [119.11727503672411, 1.6990870056152343],
                [119.12139490977098, 1.6839808044433593],
                [119.11881998911669, 1.6688746032714843],
                [119.12826136484911, 1.6499918518066405],
                [119.16654185190966, 1.6469019470214843],
                [119.1795881165581, 1.6760843811035155],
                [119.23726633921434, 1.6853540954589843],
                [119.24430445566942, 1.7092150268554687],
                [119.15624216929247, 1.7080133972167968],
                [119.1524656189995, 1.7212313232421874],
                [119.12894801035692, 1.7080133972167968]
            ],
            drawLayer: ''
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
            this.map = new Map({
                target: this.$refs.map,
                layers: [raster],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [119.202808, 1.656],
                    zoom: 13
                })
            });
            
            
            this.addVectior()
            this.addInteraction();
            this.mapClick();
        },
        addVectior() {
            if(this.drawLayer) this.map.removeLayer(this.drawLayer)
            var plygon = new ol.geom.Polygon([this.drawDyDataNew])
            var feature = new ol.Feature({
                geometry: plygon
            });
            this.source.addFeature(feature);
            this.drawLayer = new LayerVector({
                source: this.source,
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: '#C9F2D0'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                    // 线样式
                    stroke: new Stroke({
                        color: '#6E6E6E',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 1
                    }),
                    // 填充样式
                    fill: new Fill({
                        color: '#C9F2D0'
                    })
                })
            });
            this.map.addLayer(this.drawLayer)
        },
        addInteraction() {
            if (this.draw !== null) {
                this.map.removeInteraction(this.draw);
            }

            if (this.tool !== 'None') {
                this.draw = new Draw({
                    source: this.source,
                    type: this.tool
                });
                this.map.addInteraction(this.draw);
                if(this.tool !== 'Point') {
                    let _this = this;
                    this.draw.on('drawend', function(evt) {
                        let geom = evt.feature.getGeometry().flatCoordinates;
                        var geomeZZ = [[]];
                        var geomeLS = [0, 0];
                        var geometry = {
                            rings: []
                        };
                        for (let i = 0; i < geom.length; i++) {
                            if (i % 2 === 0) {
                                geomeLS = [0, 0];
                                geomeLS[0] = geom[i];
                            } else {
                                geomeLS[1] = geom[i];
                                geomeZZ[0].push(geomeLS);
                            }
                        }
                        console.log(geomeZZ)
                        let obj = {
                            geometry: {
                                rings: geomeZZ,
                                spatialReference: { wkid: 102100, latestWkid: 4326 }
                            },
                            attributes: { ID: null }
                        }
                        let data = {
                            f: 'json',
                            adds: '[' + JSON.stringify(obj) + ']'
                        };
                        _this.$axios.post('/arcgis/rest/services/%E6%B5%8B%E8%AF%95/Test/FeatureServer/0/applyEdits', data, res => {
                            evt.feature.mapId = res.addResults[0].objectId;
                            evt.feature.layer.drawFeature(e.feature)
                        },
                        err => {
                            
                        })
                    });
                }
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
                        console.log(feature)
                        _this.deleteMapBox = {
                            f: 'json',
                            deletes: feature.mapId
                        }
                    }
                }.bind(this)
            );
        },
        clean() {
            this.$axios.post('/arcgis/rest/services/%E6%B5%8B%E8%AF%95/Test/FeatureServer/0/applyEdits', this.deleteMapBox, res => {
            },
            err => {})
        }
    },
    mounted() {
        this.initMap();
    }
};
</script>

<style>
.map-x {
    width: 100%;
}
</style>
