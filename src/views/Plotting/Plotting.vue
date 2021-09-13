<template>
    <div>
        <div id="map" class="map_box"></div>
        <div ref="mousePositionTxt"></div>
        <div class="clear" @click="clearP">清除</div>
        <div class="btn-list">
            <button type="button" @click="activate()">椭圆</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            map: '',
            plotDraw: '',
            plotEdit: '',
            drawOverlay: '',
            drawStyle: ''
        };
    },
    mounted() {
        this.initMap();
        this.initPlot();
        let chinese = {
            '点':  P.PlotTypes.MARKER,
            '弧线':  P.PlotTypes.ARC,
            '曲线':  P.PlotTypes.CURVE,
            '折线':  P.PlotTypes.POLYLINE,
            '自由线': P.PlotTypes.FREEHAND_LINE,
            '圆': P.PlotTypes.CIRCLE,
            '椭圆': P.PlotTypes.ELLIPSE,
            '弓形': P.PlotTypes.LUNE,
            '扇形':  P.PlotTypes.SECTOR,
            '曲线面': P.PlotTypes.CLOSED_CURVE,
            '多边形': P.PlotTypes.POLYGON,
            '矩形': P.PlotTypes.RECTANGLE,
            '自由面': P.PlotTypes.FREEHAND_POLYGON,
            '聚集地':  P.PlotTypes.GATHERING_PLACE,
            '钳击':  P.PlotTypes.DOUBLE_ARROW,
            '直箭头': P.PlotTypes.STRAIGHT_ARROW,
            '细直箭头':  P.PlotTypes.FINE_ARROW,
            '突击方向': P.PlotTypes.ASSAULT_DIRECTION,
            '进攻方向': P.PlotTypes.ATTACK_ARROW,
            '进攻方向（尾）': P.PlotTypes.TAILED_ATTACK_ARROW,
            '分队战斗行动': P.PlotTypes.SQUAD_COMBAT,
            '分队战斗行动（尾）': P.PlotTypes.TAILED_SQUAD_COMBAT
        }
        
    },
    methods: {
        initMap() {
            let baseLayer = new ol.layer.Tile({
                source: new ol.source.OSM(),
                name: 'OSM地图',
                id: 'osm'
            });
            this.map = new ol.Map({
                target: 'map',
                controls: ol.control.defaults().extend([
                    new ol.control.MousePosition({
                        coordinateFormat: ol.coordinate.createStringXY(4),
                        projection: 'EPSG:3857',
                        target: this.$refs.mousePositionTxt
                    })
                ]),
                layers: [baseLayer],
                view: new ol.View({
                    projection: 'EPSG:3857',
                    center: [13602785.365025777, 4468656.260515666],
                    zoom: 12
                })
            });
        },
        initPlot() {
            // 设置标绘符号显示的默认样式
            let stroke = new ol.style.Stroke({
                color: '#FF0000',
                width: 2
            });
            let fill = new ol.style.Fill({ color: 'rgba(0,255,0,0.4)' });
            let image = new ol.style.Circle({ fill, stroke, radius: 8 });
            this.drawStyle = new ol.style.Style({ image, fill, stroke });
            // 初始化标绘绘制工具，添加绘制结束事件响应
            this.plotDraw = new P.PlotDraw(this.map);
            this.plotDraw.on(P.Event.PlotDrawEvent.DRAW_END, this.onDrawEnd, false, this);
            // 初始化标绘编辑工具
            this.plotEdit = new P.PlotEdit(this.map);
            // 绘制好的标绘符号，添加到FeatureOverlay显示。
            this.drawOverlay = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            this.drawOverlay.setStyle(this.drawStyle);
            this.drawOverlay.setMap(this.map);

            // 初始化加载一个扇形标绘符号
            var sector = new P.PlotFactory.createPlot(P.PlotTypes.SECTOR, [
                [13595008.6365, 4473859.2655],
                [13609073.0497, 4481197.2202],
                [13609990.2940, 4463158.0816]
            ]);
            var feature = new ol.Feature({
                geometry: sector
            });
            this.drawOverlay.getSource().addFeature(feature);
        },
        onDrawEnd(event) {
            var feature = event.feature;
            this.drawOverlay.getSource().addFeature(feature);
        },
        activate(type) {
            this.plotEdit.deactivate();
            this.plotDraw.activate('ellipse');
        },
        clearP() {
            if (this.drawOverlay && this.plotEdit && this.plotEdit.activePlot) {
                this.drawOverlay.getSource().removeFeature(this.plotEdit.activePlot);
                this.plotEdit.deactivate();
            }
        }
    }
};
</script>

<style scoped lang="scss">
.map_box {
    width: 100%;
    height: 100vh;
}

.clear {
    padding: 3px 10px;
    background-color: #00ffff;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    left: 325px;
    top: 5px;
    z-index: 100;
}

.btn-list {
    width: 80px;
    padding: 10px;
    position: absolute;
    left: 325px;
    top: 50px;
}
</style>
