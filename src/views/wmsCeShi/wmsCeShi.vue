<template>
    <div>
        <h1>wms/wfs</h1>
        <select v-model="server" @change="changeMap">
            <option value="1">2019地类图斑</option>
            <option value="2">土地征收地块</option>
        </select>
        <div id="map" class="map_box"></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import ol from '../../api/ol.js';
var axios = require('axios');
import * as turf from '@turf/turf';
import proj4 from 'proj4';
export default {
    data() {
        return {
            mainMap: '',
            server: '1',
            mapServerLayer: ''
        };
    },
    mounted() {
        this.tranform4528();
        this.initMap();
        // this.ceshi();
        this.ceshi3();
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
        initMap() {
            let baseLayer = new ol.layer.Tile({
                source: new ol.source.OSM(),
                name: 'OSM地图',
                id: 'osm'
            });
            this.mapServerLayer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'http://192.168.80.103:3000/geniusserver/mapservices/chengyang/wms',
                    params: {
                        VERSION: '1.3.0',
                        REQUEST: 'GetMap',
                        LAYERS: '2019地类图斑'
                    }
                }),
                opacity: 1,
                name: '2019地类图斑'
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
                    center: [120.29621, 36.29735],
                    zoom: 12
                })
            });
        },
        changeMap() {
            let arr = this.mainMap.getLayers().array_;
            arr.forEach(x => {
                let id = x.get('id');
                if (id !== 'osm') this.mainMap.removeLayer(x);
            });
            this.mapServerLayer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'http://192.168.80.103:3000/geniusserver/mapservices/chengyang/wms',
                    params: {
                        VERSION: '1.3.0',
                        REQUEST: 'GetMap',
                        LAYERS: this.server == '1' ? '2019地类图斑' : '土地征收地块'
                    }
                }),
                opacity: 1,
                name: this.server == '1' ? '2019地类图斑' : '土地征收地块'
            });
            this.mainMap.addLayer(this.mapServerLayer);
        },
        ceshi() {
            let coor = [
                [
                    [40517868.25871233, 4008974.2169421497],
                    [40540004.00559341, 4009047.6611947683],
                    [40539931.71161335, 4024781.6784686707],
                    [40517835.96843785, 4024708.119380906],
                    [40517868.25871233, 4008974.2169421497]
                ]
            ];
            coor[0].forEach(x => {
                let i = x[0];
                x[0] = x[1];
                x[1] = i;
            }); // 多边形 xy坐标颠倒  单点xy坐标正常
            let polygon = new ol.geom.Polygon(coor);
            // let coor = [4021210.451124483, 40521080.24678648]
            // let point = new ol.geom.Point(coor)

            let coor1 = [120.39032629626466, 36.323056328186034];

            // 空间关系 intersects相交 within 包含   详情见官网ol​/format​/filter
            let filterSpatial = ol.format.filter.intersects('geom', polygon, 'EPSG:4528');
            let filter = ol.format.filter.equalTo('dlmc', '旱地'); // 查询条件  详情见官网
            let filterAnd = ol.format.filter.and(filterSpatial, filter);
            const srsName = 'EPSG:4528';
            const outputFormat = 'application/json';
            const featureResult = new ol.format.WFS().writeGetFeature({
                srsName, // 坐标系
                featureNS: 'http://openstreemap.org', // 默认
                featurePrefix: 'osm', // 默认
                featureTypes: ['城阳土地规划数据'], // 查询图层
                outputFormat, // 返回数据格式
                maxFeatures: 1000000, // 查询数量  分页用
                startIndex: 0, // 查询起始位置  分页用
                filter: filterAnd // 查询条件
            });
            // /wfsmap 指向  http://192.168.80.103:3000
            let url = '/wfsmap/geniusserver/mapservices/chengyang/wfs';
            axios({
                method: 'post',
                url,
                data: new XMLSerializer().serializeToString(featureResult), // 数据转xml
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/xml'
                }
            })
                .then(res => {
                    console.log(JSON.parse(res.data));
                })
                .catch(err => {
                    console.log(err);
                });
        },
        ceshi2() {
            let url = '/wfsmap/geniusserver/mapservices/chengyangrelease/wfs';
            let coor1 = [120.39032629626466, 36.323056328186034];
            let filterSpatial = ol.format.filter.intersects('geom', coor1, 'EPSG:4326');
            const featureResult = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:4326', // 坐标系
                featureNS: 'http://openstreemap.org', // 默认
                featurePrefix: 'osm', // 默认
                featureTypes: ['城阳土地规划数据'], // 查询图层
                outputFormat: 'application/json', // 返回数据格式
                maxFeatures: 1000000, // 查询数量  分页用
                startIndex: 0, // 查询起始位置  分页用
                filter: filterSpatial // 查询条件
            });

            axios({
                method: 'post',
                url,
                data: new XMLSerializer().serializeToString(featureResult), // 数据转xml
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/xml'
                }
            })
                .then(function(res) {
                    console.log(JSON.parse(res.data));
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        ceshi3() {
            let arr1 = [
                [
                    [120.37996225406091, 36.310589387077336],
                    [120.38575582553308, 36.310589387077336],
                    [120.38575582553308, 36.31470926012421],
                    [120.37996225406091, 36.31470926012421],
                    [120.37996225406091, 36.310589387077336]
                ]
            ];
            let arr2 = [
                [
                    [120.37828855563562, 36.3085294505539],
                    [120.38618497897546, 36.3085294505539],
                    [120.38618497897546, 36.31196267809296],
                    [120.37828855563562, 36.31196267809296],
                    [120.37828855563562, 36.3085294505539]
                ]
            ];
            
            // console.log(ol.proj.transform([ 40533706.28545001, 4020457.3635536376], 'EPSG:4528', 'EPSG:4326'))
            let Polygon1 = new ol.geom.Polygon(arr1);
            let Polygon2 = new ol.geom.Polygon(arr2);
            let layer2 = this.setLayer(Polygon2, 'yellow');
            this.mainMap.addLayer(layer2)
            let layer1 = this.setLayer(Polygon1, 'rgba(200, 100, 250, 0.9)');
            this.mainMap.addLayer(layer1)
            let poly1 = turf.polygon([arr1[0]])
            let poly2 = turf.polygon([arr2[0]])
            let intersection = turf.bboxClip(poly1, poly2);
            let arr3 = intersection.geometry.coordinates;
            let Polygon3 = new ol.geom.Polygon(arr3);
            let layer3 = this.setLayer(Polygon3, 'red');
            this.mainMap.addLayer(layer3)
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
                    // 线样式
                    stroke: new ol.style.Stroke({
                        color: '#6E6E6E',
                        lineCap: 'round', // 设置线的两端为圆头
                        width: 1
                    }),
                    // 填充样式
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });
            return layer
        },
        sortArr(arr) {
            let brr = arr.map(x => [x[1], x[0]]);
            return brr;
        },
        getIntersectionPolygon(arr1, arr2) {
            // arr1  arr2  arr3   [[[x, y], [x, y]]]
            try {
                let poly1 = turf.polygon([arr1[0]])
                let poly2 = turf.polygon([arr2[0]])
                let intersection = turf.intersect(poly1, poly2);
                let arr3 = intersection.geometry.coordinates;
                if(arr3.length && arr3[0].length) {
                    let Polygon3 = new ol.geom.Polygon(arr3);
                    let area = ol.sphere.getArea(Polygon3, {
                        projection: 'EPSG:4326'
                    });
                    let areaChinese = (Math.round(area * 100) / 100 / 666.666).toFixed(3);
                    return { area: areaChinese, arr: arr3 }
                } else {
                    return 0
                }
            } catch (err) {
                return 0
            }
        
        }
    }
};
</script>

<style lang="scss" scoped>
h1 {
    text-align: center;
}

.map_box {
    width: 90%;
    height: 80vh;
    margin: 0 auto;
    margin-top: 2vh;
    border: 1px solid;
}
</style>
