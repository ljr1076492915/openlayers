<template>
    <div class="vm">
        <h2 class="h-title">加载多边形</h2>
        <div class="tools-x">
            <select id="type" v-model="tool" ref="tools">
                <option v-for="item in tools" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
        </div>
        <div ref="map" class="map-x"></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import proj4 from 'proj4';
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
import { intersectArea } from '../../api/calculation.js';

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
            source1: new SourceVector({
                wrapX: false
            }),
            draws: [],
            deleteMapBox: '',
            drawDyData: [
                [120.25570934543298, 36.30230870266342],
                [120.25573592483782, 36.302152254984385],
                [120.25575825590798, 36.3019945403048],
                [120.25532626976502, 36.301979200841366],
                [120.25531620684156, 36.30207505527932],
                [120.25568843701572, 36.30209956555398],
                [120.25568188063805, 36.3021772081489],
                [120.25567482418715, 36.30226077935223],
                [120.25567482363398, 36.30226077931198],
                [120.25567482363049, 36.30226077935342],
                [120.25564009325083, 36.30225825204814],
                [120.25529957585526, 36.302233473245764],
                [120.25529546816092, 36.302272596171115],
                [120.25557138634876, 36.30229666716656],
                [120.25570934543298, 36.30230870266342]
            ],
            drawDyDataNew: [
                [40522932.16190055, 4019091.713293689],
                [40522932.1619, 4019091.7132999995],
                [40522965.588, 4019094.521400001],
                [40522964.97640141, 4019103.135400398],
                [40522965.58805, 4019094.521349998],
                [40522932.16195, 4019091.713299998],
                [40522932.16190055, 4019091.713293689],
                [40522964.318050325, 4019112.407195402],
                [40522961.19935546, 4019112.1185169024],
                [40522964.31805, 4019112.4071999984],
                [40522964.318050325, 4019112.407195402]
            ],
            plygon3: [
                [40522933.093852684, 4019081.079202449],
                [40522933.0938, 4019081.0791999996],
                [40522932.16190055, 4019091.713293689],
                [40522932.16195, 4019091.713299998],
                [40522933.093852684, 4019081.079202449]
            ],
            plygon4: [
                [40522967.404699996, 4019117.7332000006],
                [40522969.8379, 4019100.3792999997],
                [40522971.8899, 4019082.8837999986],
                [40522933.093852684, 4019081.079202449],
                [40522932.16195, 4019091.713299998],
                [40522965.58805, 4019094.521349998],
                [40522964.97640141, 4019103.135400398],
                [40522964.3181, 4019112.4072],
                [40522964.318050325, 4019112.407195402],
                [40522964.31805, 4019112.4071999984],
                [40522961.19935546, 4019112.1185169024],
                [40522930.6218, 4019109.2882000003],
                [40522930.2414, 4019113.6284999982],
                [40522955.01693768, 4019116.3649490555],
                [40522967.404699996, 4019117.7332000006]
            ],
            drawLayer: '',
            drawLayer1: '',
            drawLayer2: '',
            drawLayer3: ''
        };
    },
    methods: {
        initMap() {
            this.tranform4528();
            let raster = new Tile({
                source: new OSM()
            });
            this.map = new Map({
                target: this.$refs.map,
                layers: [raster],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [120.25, 36.3],
                    zoom: 13
                })
            });
            // this.addVectior1();
            // this.addVectior2();
            this.addVectior();
            // this.addInteraction();
        },
        addVectior() {
            if (this.drawLayer) this.map.removeLayer(this.drawLayer);
            let arr = this.drawDyData;
            var plygon = new ol.geom.Polygon([arr]);
            var feature = new ol.Feature({
                geometry: plygon
            });
            this.source.addFeature(feature);
            this.drawLayer = new LayerVector({
                source: this.source,
                style: new Style({
                    // 线样式
                    stroke: new Stroke({
                        color: '#6E6E6E',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 1
                    }),
                    // 填充样式
                    fill: new Fill({
                        color: 'rgba(200, 100, 250, 0.9)'
                    })
                })
            });
            this.map.addLayer(this.drawLayer);
        },
        addVectior1() {
            if (this.drawLayer2) this.map.removeLayer(this.drawLayer2);
            let arr = this.plygon3.map(x => ol.proj.transform(x, 'EPSG:4528', 'EPSG:4326'));
            var plygon = new ol.geom.Polygon([arr]);
            var feature = new ol.Feature({
                geometry: plygon
            });
            let source = new SourceVector({
                wrapX: false
            });
            source.addFeature(feature);
            this.drawLayer2 = new LayerVector({
                source,
                style: new Style({
                    // 线样式
                    stroke: new Stroke({
                        color: '#6E6E6E',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 1
                    }),
                    // 填充样式
                    fill: new Fill({
                        color: 'rgba(200, 100, 250, 0.9)'
                    })
                })
            });
            this.map.addLayer(this.drawLayer2);
        },
        addVectior2() {
            if (this.drawLayer3) this.map.removeLayer(this.drawLayer3);
            let arr = this.plygon4.map(x => ol.proj.transform(x, 'EPSG:4528', 'EPSG:4326'));
            var plygon = new ol.geom.Polygon([arr]);
            var feature = new ol.Feature({
                geometry: plygon
            });
            let source = new SourceVector({
                wrapX: false
            });
            source.addFeature(feature);
            this.drawLayer3 = new LayerVector({
                source,
                style: new Style({
                    // 线样式
                    stroke: new Stroke({
                        color: '#6E6E6E',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 1
                    }),
                    // 填充样式
                    fill: new Fill({
                        color: 'rgba(200, 100, 250, 0.9)'
                    })
                })
            });
            this.map.addLayer(this.drawLayer3);
        },
        addInteraction() {
            if (this.drawLayer1) this.map.removeLayer(this.drawLayer1);
            let arr = this.drawDyDataNew.map(x => ol.proj.transform(x, 'EPSG:4528', 'EPSG:4326'));
            console.log(arr);
            var plygon = new ol.geom.Polygon([arr]);
            var feature = new ol.Feature({
                geometry: plygon
            });
            this.source1.addFeature(feature);
            this.drawLayer1 = new LayerVector({
                source: this.source1,
                style: new Style({
                    // 填充样式
                    fill: new ol.style.Fill({
                        //矢量图层填充颜色，以及透明度
                        color: 'rgba(255, 0, 0, .8)'
                    }),
                    stroke: new ol.style.Stroke({
                        //边界样式
                        color: '#234120',
                        width: 1
                    })
                })
            });
            this.map.addLayer(this.drawLayer1);
        },
        loadArea() {
            this.tranform4528();
            let arr = [this.drawDyData];
            // arr = arr.map(x => ol.proj.transform(x, 'EPSG:4528', 'EPSG:4326'));
            let brr = [this.drawDyDataNew];
            // brr = brr.map(x => ol.proj.transform(x, 'EPSG:4528', 'EPSG:4326'));

            // console.log(intersectArea(arr, brr));
        },
        tranform4528() {
            // 定义自定义坐标系
            proj4.defs('EPSG:4528', '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs');
            var projection = new ol.proj.Projection({
                code: 'EPSG:4528',
                units: 'm',
                axisOrientation: 'neu',
                global: false
            });
            // 结合proj4在ol3中自定义坐标系
            ol.proj.addProjection(projection);
            ol.proj.addCoordinateTransforms(
                //  添加坐标转换方法
                'EPSG:4326',
                'EPSG:4528',
                function(coordinate) {
                    return proj4('EPSG:4326', 'EPSG:4528', coordinate);
                },
                function(coordinate) {
                    return proj4('EPSG:4528', 'EPSG:4326', coordinate);
                }
            );
        }
    },
    mounted() {
        this.initMap();
        this.loadArea();
        console.log(this.$refs.tools)
        this.tool = 'Point'
        this.$nextTick(() => {
            console.log(this.$refs.tools)
        })
    }
};
</script>

<style>
.map-x {
    width: 100%;
}
</style>
