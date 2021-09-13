<template>
    <div><div id="map" class="map_box"></div></div>
</template>

<script>
import 'ol/ol.css';
import ol from '../../api/ol.js';
import * as turf from '@turf/turf';
import proj4 from 'proj4';

export default {
    data() {
        return {
            mainMap: '',
            mapServerLayer: ''
        };
    },
    mounted() {
        this.tranform4528();
        this.intMap();
        this.loadPolygon();
    },
    methods: {
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
        },
        intMap() {
            let baseLayer = new ol.layer.Tile({
                source: new ol.source.OSM(),
                name: 'OSM地图',
                id: 'osm'
            });
            this.mainMap = new ol.Map({
                target: 'map',
                controls: ol.control
                    .defaults({
                        zoom: false,
                        attribution: false // 关闭归属控件
                    })
                    .extend([]),
                layers: [baseLayer], // , this.mapServerLayer
                view: new ol.View({
                    projection: 'EPSG:4326',
                    center: [120.38549833346765, 36.30567558016205],
                    zoom: 15
                })
            });
        },
        loadPolygon() {
            let arr1 = [
                [
                    [120.30429960299888, 36.247114693779004],
                    [120.46669706393642, 36.247114693779004],
                    [120.46669706393642, 36.3642364665451],
                    [120.30429960299888, 36.3642364665451],
                    [120.30429960299888, 36.247114693779004]
                ]
            ];
            let arr2 = [
                [
                    [120.37554197360437, 36.31406552996064],
                    [120.37798814822595, 36.31406552996064],
                    [120.37798814822595, 36.31629712786103],
                    [120.37554197360437, 36.31629712786103],
                    [120.37554197360437, 36.31406552996064]
                ]
            ];
            const arr3 = this.getDifferencePolygon4326(arr1, arr2);
            /* let Polygon1 = new ol.geom.Polygon(arr1);
            let Polygon2 = new ol.geom.Polygon(arr2);
            let layer1 = this.setLayer(Polygon1, 'rgba(255, 255, 255, 0.7)');
            this.mainMap.addLayer(layer1);
            let layer2 = this.setLayer(Polygon2, 'rgba(200, 100, 250, 0.9)');
            this.mainMap.addLayer(layer2); */
            let Polygon3 = new ol.geom.Polygon(arr3);
            let layer3 = this.setLayer(Polygon3, 'rgba(255, 255, 255, 0.7)');
            this.mainMap.addLayer(layer3);
        },
        getDifferencePolygon4326(arr1, arr2) {
            try {
                let poly1 = turf.polygon([arr1[0]])
                let poly2 = turf.polygon([arr2[0]])
                let intersection = turf.mask(poly1, poly2);
                let arr3 = intersection.geometry.coordinates;
                if(arr3.length && arr3[0].length) {
                    return arr3
                } else {
                    return []
                }
            } catch (err) {
                return []
            }
        },
        setLayer(polygon, color) {
            let layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: polygon
                        })
                    ]
                }),
                style: new ol.style.Style({
                    // 填充样式
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });
            return layer;
        }
    }
};
</script>

<style>
.map_box {
    width: 100%;
    height: 100vh;
}
</style>
