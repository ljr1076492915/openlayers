<template>
    <div class="vm"><div id="map" style="width: 100%;height: 100%;"></div></div>
</template>

<script>
import 'ol/ol.css';
import ol from '../../api/ol.js';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default {
    name: 'FirstMap',
    data() {
        return {
            map: null,
            canvasLayer: '',
            index: 1
        };
    },
    methods: {
        initMap() {
            // 地图实例
            this.map = new ol.Map({
                target: 'map', // 对应页面里 id 为 map 的元素
                layers: [
                    // 图层
                    new Tile({
                        source: new OSM() // 图层数据源
                    })
                ],
                view: new ol.View({
                    // 地图视图
                    projection: 'EPSG:4326', // 坐标系，有EPSG:4326和EPSG:3857
                    center: [114.064839, 22.548857], // 深圳坐标
                    minZoom: 10, // 地图缩放最小级别
                    zoom: 12 // 地图缩放级别（打开页面时默认级别）
                })
            });
            setInterval(() => {
                this.addCanvasLayer()
            }, 300)
        },
        addCanvasLayer() {
            if (this.canvasLayer) this.map.removeLayer(this.canvasLayer);
            this.canvasLayer = new ol.layer.Image();
            this.canvasLayer.setSource(
                new ol.source.ImageCanvas({
                    canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
                        var pix = this.map.getPixelFromCoordinate([114.064839, 22.548857]);// 中心点
                        let pix0 = pix[0];
                        let pix1 = pix[1];
                        let mapSize = this.map.getSize();// 地图大小
                        var canvas = document.createElement('canvas');
                        canvas.width = size[0];
                        canvas.height = size[1];
                        var ctx = canvas.getContext('2d');
                        var deg = 30;
                        var hud = deg * (Math.PI / 180);
                        var r = 100;
                        var p1 = {
                            x: pix0,
                            y: pix1 - 150
                        };

                        var p2 = {
                            x: p1.x + Math.cos(hud) * r,
                            y: p1.y - Math.sin(hud) * r
                        };

                        // 动画效果
                        // 清空画布
                        var BW = canvas.width;
                        var BH = canvas.height;
                        ctx.clearRect(0, 0, BW, BH);

                        // 用于参考倾斜度的直线
                        ctx.strokeStyle = 'red';
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.closePath();

                        // 无效果
                        this.arrowTo(ctx, p1, p2, {
                            color: 'blue'
                        });

                        // 高亮效果
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 - 200,
                                y: pix1 - 150
                            },
                            {
                                x: pix0 - 50,
                                y: pix1 + 150
                            },
                            {
                                activeIndex: this.index
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 - 100,
                                y: pix1 - 50
                            },
                            {
                                x: pix0 + 150,
                                y: pix1 - 50
                            },
                            {
                                activeIndex: this.index
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 + 200,
                                y: pix1 - 550
                            },
                            {
                                x: pix0 + 150,
                                y: pix1 - 50
                            },
                            {
                                activeIndex: this.index
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 - 100,
                                y: pix1 - 50
                            },
                            {
                                x: pix0 - 100,
                                y: pix1 - 250
                            },
                            {
                                activeIndex: this.index
                            }
                        );

                        // 整体偏移效果
                        var offset = (this.index % 3) * 5;
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 - 100,
                                y: pix1 + 100
                            },
                            {
                                x: pix0 + 200,
                                y: pix1 + 100
                            },
                            {
                                offset,
                                color: 'red',
                                justifyAlign: false
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 + 200,
                                y: pix1 + 100
                            },
                            {
                                x: pix0 + 150,
                                y: pix1 + 280
                            },
                            {
                                offset,
                                color: 'red',
                                justifyAlign: false
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 + 150,
                                y: pix1 + 280
                            },
                            {
                                x: pix0 + 160,
                                y: pix1 + 280
                            },
                            {
                                offset,
                                color: 'red',
                                justifyAlign: false
                            }
                        );
                        this.arrowTo(
                            ctx,
                            {
                                x: pix0 + 160,
                                y: pix1 + 280
                            },
                            {
                                x: pix0 - 100,
                                y: pix1 + 100
                            },
                            {
                                offset,
                                color: 'red',
                                justifyAlign: false
                            }
                        );

                        // 其他处理
                        if (this.index >= 50) {
                            this.index = 1;
                        } else {
                            this.index++;
                        }
                        return canvas;
                    }
                })
            );
            this.map.addLayer(this.canvasLayer);
        },
        arrowTo(ctx, p1, p2, arrowOptions) {
            // 初始化参数
            var opts = {
                startOffset: 5, // 起点的留空长度
                endOffset: 5, // 终点的留空长度
                offset: 0, // 偏移位（模拟动画效果用, 使用时建议将justifyAlign设为false）
                color: '#E6E6FA', // 默认颜色
                activeIndex: -1, // 高亮箭头的索引, 超出回到一圈起始位置。(默认-1，不做高亮处理)
                activeColor: '#00FF00', // 高亮颜色(Highligh Color)
                stepLength: 10, // 间隔(步长)
                justifyAlign: true, // 两端对齐(两边撑满, 配合activeIndex > 0时使用)
                arrowLength: 15, // 箭头长度(柄到顶点)
                arrowTheta: 25, // 箭头两边的夹角（度数）
                arrowHeadlen: 6, // 箭头两边斜边长度
                arrowLineWidth: 1, // 画箭头的线宽度
                lineWidth: 1 // 两点间的连丝宽度（>0时，有效）
            };

            if (arrowOptions !== undefined && arrowOptions !== null) {
                opts = Object.assign(opts, arrowOptions);
            }

            // 画连结两点的线
            if (opts.lineWidth > 0) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                //颜色，线宽
                ctx.strokeStyle = opts.color;
                ctx.lineWidth = opts.lineWidth;
                ctx.stroke();
                ctx.closePath();
            }

            // 计两点距离
            var len = Math.floor(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)));

            // 计算画多少个箭头(注意：最后一个箭头是不需要间隔(步长)，所以可用长度要加一个opts.stepLength)
            var loops = Math.floor(
                (len - (opts.startOffset + opts.offset + opts.endOffset) + opts.stepLength) / (opts.arrowLength + opts.stepLength)
            );

            // 两端对齐(两边撑满)，重算步长
            if (opts.justifyAlign === true) {
                opts.stepLength = (len - (opts.startOffset + opts.offset + opts.endOffset) - opts.arrowLength * loops) / (loops - 1);
            }

            // 高亮箭头的索引, 超出回到一圈起始位置。(用于动画效果)
            var highlightIndex = 0; // 0 - 无动画效果
            if (opts.activeIndex > 0) {
                if (opts.activeIndex % loops === 0) {
                    highlightIndex = loops;
                } else {
                    highlightIndex = opts.activeIndex % loops;
                }
            }

            var hudu = Math.atan2(p1.y - p2.y, p2.x - p1.x); // 计算p1, p2两点的倾斜度（弧度）。(注意参数：p1.y - p2.y, p2.x - p1.x, 请勿搞错)
            var p0 = {
                x: p1.x,
                y: p1.y
            }; // 原点坐标, 作为圆心。 (辅助计算箭头起点(柄)与顶点的坐标)
            var r; // 半径。 (辅助计算箭头起点(柄)与顶点的坐标)
            var color;
            for (var i = 0; i < loops; i++) {
                // 箭头起点(柄)
                r = opts.startOffset + opts.offset + (opts.arrowLength + opts.stepLength) * i; // 原点到箭头起点(柄)的半径
                p1 = {
                    x: p0.x + Math.cos(hudu) * r,
                    y: p0.y - Math.sin(hudu) * r
                };

                // 箭头终点（顶点）
                r = r + opts.arrowLength; // 原点到箭头顶点(柄)的半径
                p2 = {
                    x: p0.x + Math.cos(hudu) * r,
                    y: p0.y - Math.sin(hudu) * r
                };

                // 画一个箭头
                if (highlightIndex > 0 && i === highlightIndex - 1) {
                    color = opts.activeColor; //高亮箭头（动画效果）
                } else {
                    color = opts.color;
                }
                this.drawArrow(ctx, p1, p2, opts.arrowTheta, opts.arrowHeadlen, opts.arrowLineWidth, color);
            }
        },
        drawArrow(ctx, p1, p2, theta, headlen, width, color) {
            theta = theta !== undefined && theta !== null ? theta : 25; //夹角(度数)
            headlen = headlen !== undefined && headlen !== null ? headlen : 6; //斜边长度
            width = width !== undefined && width !== null ? width : 1; //线宽
            color = color !== undefined && color !== null ? color : '#000'; //颜色

            var angle = (Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180) / Math.PI, //倾斜度(度数)
                angle1 = ((angle + theta) * Math.PI) / 180, //夹角1
                angle2 = ((angle - theta) * Math.PI) / 180, //夹角2
                topX = headlen * Math.cos(angle1), //箭头上面点, X偏移位
                topY = headlen * Math.sin(angle1), //箭头上面点, Y偏移位
                botX = headlen * Math.cos(angle2), //箭头下面点, X偏移位
                botY = headlen * Math.sin(angle2); //箭头下面点, Y偏移位

            ctx.save();

            ctx.beginPath();

            //连结两点的线
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            //终点箭头的两侧
            var arrowX = p2.x + topX;
            var arrowY = p2.y + topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(p2.x, p2.y); //终点
            arrowX = p2.x + botX;
            arrowY = p2.y + botY;
            ctx.lineTo(arrowX, arrowY);

            //颜色，线宽
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();

            ctx.restore();
        }
    },
    mounted() {
        this.initMap();
    }
};
</script>

<style lang="scss" scoped></style>
