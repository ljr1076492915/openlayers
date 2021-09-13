import Vue from 'vue'
import VueRouter from 'vue-router'
import FirstMap from '../views/firstMap/FirstMap'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FirstMap',
    component: FirstMap
  },
  {
    path: '/popup',
    name: 'Popup',
    component: () => import('../views/popup/Popup')
  },
  {
    path: '/mapMarker',
    name: 'MapMarker',
    component: () => import('../views/mapMarker/MapMarker')
  },
  {
    path: '/zoom',
    name: 'Zoom',
    component: () => import('../views/zoom/Zoom.vue')
  },
  {
    path: '/tabindex',
    name: 'TabIndex',
    component: () => import('../views/tabIndex/TabIndex')
  },
  {
    path: '/changeTarget',
    name: 'ChangeTarget',
    component: () => import('../views/changeTarget/ChangeTarget')
  },
  {
    path: '/synchronization',
    name: 'Synchronization',
    component: () => import('../views/synchronization/Synchronization')
  },
  {
    path: '/preloadMap',
    name: 'PreloadMap',
    component: () => import('../views/preloadMap/PreloadMap')
  },
  {
    path: '/vectorJSON',
    name: 'VectorJSON',
    component: () => import('../views/vectorJSON/VectorJSON')
  },
  {
    path: '/vectorHigh',
    name: 'VectorHigh',
    component: () => import('../views/vectorHigh/vectorHigh')
  },
  {
    path: '/rotationMap',
    name: 'RotationMap',
    component: () => import('../views/rotationMap/RotationMap')
  },
  {
    path: '/viewAnimate',
    name: 'ViewAnimate',
    component: () => import('../views/viewAnimate/ViewAnimate')
  },
  {
    path: '/graticule',
    name: 'Graticule',
    component: () => import('../views/graticule/Graticule')
  },
  {
    path: '/heatmap',
    name: 'Heatmap',
    component: () => import('../views/heatmap/heatmap')
  },
  {
    path: '/scaleLine',
    name: 'ScaleLine',
    component: () => import('../views/scaleLine/ScaleLine')
  },
  {
    path: '/fullScreen',
    name: 'FullScreen',
    component: () => import('../views/fullScreen/FullScreen')
  },
  {
    path: '/zoomToExtent',
    name: 'ZoomToExtent',
    component: () => import('../views/zoomToExtent/ZoomToExtent')
  },
  {
    path: '/overviewMap',
    name: 'OverviewMap',
    component: () => import('../views/overviewMap/OverviewMap')
  },
  {
    path: '/mousePosition',
    name: 'MousePosition',
    component: () => import('../views/mousePosition/MousePosition')
  },
  {
    path: '/zoomSlider',
    name: 'ZoomSlider',
    component: () => import('../views/zoomSlider/ZoomSlider')
  },
  {
    path: '/layerSet',
    name: 'LayerSet',
    component: () => import('../views/layerSet/LayerSet')
  },
  {
    path: '/setZIndex',
    name: 'SetZIndex',
    component: () => import('../views/setZIndex/SetZIndex')
  },
  {
    path: '/setResolution',
    name: 'SetResolution',
    component: () => import('../views/setResolution/SetResolution')
  },
  {
    path: '/setExtent',
    name: 'SetExtent',
    component: () => import('../views/setExtent/SetExtent')
  },
  {
    path: '/coverageModal',
    name: 'CoverageModal',
    component: () => import('../views/coverageModal/coverageModal')
  },
  {
    path: '/setSource',
    name: 'SetSource',
    component: () => import('../views/setSource/SetSource')
  },
  {
    path: '/simplenessLabel',
    name: 'SimplenessLabel',
    component: () => import('../views/simplenessLabel/SimplenessLabel')
  },
  {
    path: '/brightMark',
    name: 'BrightMark',
    component: () => import('../views/brightMark/BrightMark')
  },
  {
    path: '/polymerization',
    name: 'Polymerization',
    component: () => import('../views/polymerization/Polymerization')
  },
  {
    path: '/basicDraw',
    name: 'BasicDraw',
    component: () => import('../views/basicDraw/basicDraw')
  },
  {
    path: '/drawGraph',
    name: 'DrawGraph',
    component: () => import('../views/drawGraph/drawGraph')
  },
  {
    path: '/freeDrawing',
    name: 'FreeDrawing',
    component: () => import('../views/freeDrawing/freeDrawing')
  },
  {
    path: '/arrowLine',
    name: 'ArrowLine',
    component: () => import('../views/arrowLine/arrowLine')
  },
  {
    path: '/snapGraph',
    name: 'SnapGraph',
    component: () => import('../views/snapGraph/snapGraph')
  },
  {
    path: '/mouseRotationMap',
    name: 'MouseRotationMap',
    component: () => import('../views/mouseRotationMap/mouseRotationMap')
  },
  {
      path: '/drawCeshi',
      name: 'drawCeshi',
      component: () => import('../views/drawCeshi/drawCeshi')
  },
  {
      path: '/dynamicDraw',
      name: 'dynamicDraw',
      component: () => import('../views/dynamicDraw/dynamicDraw')
  },
  {
      path: '/intersectAll',
      name: 'intersectAll',
      component: () => import('../views/intersectAll/intersectAll')
  },
  {
      path: '/towDraw',
      name: 'towDraw',
      component: () => import('../views/towDraw/towDraw')
  },
  {
      path: '/wmsCeShi',
      name: 'wmsCeShi',
      component: () => import('../views/wmsCeShi/wmsCeShi')
  },
  {
      path: '/canvas',
      name: 'canvas',
      component: () => import('../views/canvas/canvas')
  },
  {
      path: '/mianJu',
      name: 'mianJu',
      component: () => import('../views/mianJu/mianJu')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
