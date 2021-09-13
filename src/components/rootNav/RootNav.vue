<template>
    <nav id="nav">
        <router-link class="link" to="/" active-class="active" exact tag="div">第一个地图 map</router-link>
        <router-link v-for="(nav, index) in navList" :key="index" class="link" :to="nav.to" active-class="active" tag="div">
            {{ nav.title }}
        </router-link>
    </nav>
</template>

<script>
export default {
    name: 'rootNav',
    data() {
        return {
            navList: [
                {
                    title: '弹窗 popup',
                    to: '/popup'
                },
                {
                    title: '标记 marker',
                    to: '/mapMarker'
                },
                {
                    title: '地图缩放级别 zoom',
                    to: '/zoom'
                },
                {
                    title: '单击激活地图 tabindex',
                    to: '/tabindex'
                },
                {
                    title: '切换地图容器',
                    to: '/changeTarget'
                },
                {
                    title: '同步两个地图',
                    to: '/synchronization'
                },
                {
                    title: '预加载 preload',
                    to: '/preloadMap'
                },
                {
                    title: '矢量图 JSON',
                    to: '/vectorJSON'
                },
                {
                    title: '矢量图 高亮',
                    to: '/vectorHigh'
                },
                {
                    title: '旋转 rotation',
                    to: '/rotationMap'
                },
                {
                    title: '鼠标拖拽旋转/缩放',
                    to: '/mouseRotationMap'
                },
                {
                    title: '动画 animate',
                    to: '/viewAnimate'
                },
                {
                    title: '网格 Graticule',
                    to: '/graticule'
                },
                {
                    title: '热力图 Heatmap',
                    to: '/heatmap'
                },
                {
                    title: '比例尺控件 ScaleLine',
                    to: '/scaleLine'
                },
                {
                    title: '全屏控件 FullScreen',
                    to: '/fullScreen'
                },
                {
                    title: '导览控件 ZoomToExtent',
                    to: '/zoomToExtent'
                },
                {
                    title: '总览控件 OverviewMap',
                    to: '/overviewMap'
                },
                {
                    title: '鼠标位置控件 MousePosition',
                    to: '/mousePosition'
                },
                {
                    title: '缩放滑块控件 ZoomSlider',
                    to: '/zoomSlider'
                },
                {
                    title: '图层组 Group',
                    to: '/layerSet'
                },
                {
                    title: '控制图层层叠关系 Set zIndex',
                    to: '/setZIndex'
                },
                {
                    title: '限制分辨率',
                    to: '/setResolution'
                },
                {
                    title: '按限制范围加载图层',
                    to: '/setExtent'
                },
                {
                    title: '图层遮罩效果',
                    to: '/coverageModal'
                },
                {
                    title: '设置图层的源 setSource',
                    to: '/setSource'
                },
                {
                    title: '简单的标记',
                    to: '/simplenessLabel'
                },
                {
                    title: '定义标记颜色',
                    to: '/brightMark'
                },
                {
                    title: '聚合数据',
                    to: '/polymerization'
                },
                {
                    title: '绘制点、线、面',
                    to: '/basicDraw'
                },
                {
                    title: '绘制图形',
                    to: '/drawGraph'
                },
                {
                    title: '自由绘制图形',
                    to: '/freeDrawing'
                },
                {
                    title: '带箭头的线段',
                    to: '/arrowLine'
                },
                {
                    title: '修改已绘制的图形',
                    to: '/snapGraph'
                },
                {
                    title: '测试',
                    to: '/drawCeshi'
                },
                {
                    title: '动态draw',
                    to: '/dynamicDraw'
                },
                {
                    title: 'toDo',
                    to: '/TodosTwo'
                },
                {
                    title: '相交',
                    to: '/intersectAll'
                },
                {
                    title: '相交地块',
                    to: '/towDraw'
                },
                {
                    title: 'wms/wfs服务',
                    to: '/wmsCeShi'
                },
                {
                    title: 'canvas图层',
                    to: '/canvas'
                },
                {
                    title: 'turf面具',
                    to: '/mianJu'
                },
                {
                    title: '动态路线',
                    to: '/animationLine'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/varibles.scss';

#nav {
    min-width: 200px;
    height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-right: 20px;
    border-right: 1px solid #eee;
}

.link {
    padding: 10px;
    border-bottom: 1px dashed #ccc;
    text-decoration: none;
    color: $darkTextColor;
    cursor: pointer;
}

.active {
    background: $abgColor;
    color: #fff;
    border-bottom: none;
}
</style>
