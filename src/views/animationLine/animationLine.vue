<template>
    <div id="map" class="map_box"></div>
</template>

<script>
import ol from '../../api/ol.js';
export default {
    data() {
        return {
            mainMap: '',
            points: [[122.2986, 37.3674], [122.297, 37.2329], [122.1192, 37.0836]],
            featureLine: '',
            interval: '',
            lineLayer: ''
        };
    },
    mounted() {
        this.initMap();
        this.addLineLayer();
        this.lineRoll();
    },
    methods: {
        initMap() {
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
                layers: [baseLayer],
                view: new ol.View({
                    projection: 'EPSG:4326',
                    center: [122.1959, 37.2117],
                    zoom: 12
                })
            });
        },
        addLineLayer() {
            this.featureLine = new ol.Feature({
                geometry: new ol.geom.LineString(this.points),
                dashOffset: 0
            });
            this.addFeatureStyle();
            this.lineLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    wrapX: false,
                    features: [this.featureLine]
                })
            });
            this.mainMap.addLayer(this.lineLayer);
        },
        lineRoll() {
            this.interval = setInterval(() => {
                let offset = this.featureLine.get('dashOffset');
                offset = offset == 8 ? 0 : offset + 1;
                this.featureLine.set('dashOffset', offset);
                this.addFeatureStyle();
            }, 100);
        },
        addFeatureStyle() {
            let outlineStroke = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [25, 25, 255, 1],// 蓝色
                    width: 5
                })
            });
            let getAnimationStrokeStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [204, 204, 255, 1],// 白块
                    width: 3,
                    lineDash: [2, 7],
                    lineDashOffset: this.featureLine.get('dashOffset')
                })
            });
            this.featureLine.setStyle([outlineStroke, getAnimationStrokeStyle]);
        }
    },
    beforeDestroy() {
        clearInterval(this.interval);
    }
};
</script>

<style scoped lang="scss">
.map_box {
    width: 100%;
    height: 100vh;
}
</style>
