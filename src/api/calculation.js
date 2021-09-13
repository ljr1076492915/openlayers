import ol from './ol.js';
const jsts = require('jsts');

function intersectArea(arr, brr) {
    try {
        let plygon1 = new ol.geom.Polygon(arr);
        let plygon2 = new ol.geom.Polygon(brr);
        let feature1 = new ol.Feature({
            geometry: plygon1
        });
        let feature2 = new ol.Feature({
            geometry: plygon2
        });
        let parser = new jsts.io.OL3Parser();
        parser.inject(
            ol.geom.Point,
            ol.geom.LineString,
            ol.geom.LinearRing,
            ol.geom.Polygon,
            ol.geom.MultiPoint,
            ol.geom.MultiLineString,
            ol.geom.MultiPolygon
        );
        let jstsgeo1 = parser.read(plygon1);
        let jstsgeo2 = parser.read(plygon2);
        let buffer1 = jstsgeo1.buffer(0);
        let buffer2 = jstsgeo2.buffer(0);
        let intersects = buffer1.intersection(buffer2);
        let needArr = loadGeometry4362(parser.write(intersects).flatCoordinates);
        if (needArr.length && needArr[0].length) {
            let plygon3 = new ol.geom.Polygon(needArr);
            let area = ol.sphere.getArea(plygon3, {
                projection: 'EPSG:4326'
            });
            let areaChinese = (Math.round(area * 100) / 100 / 666.666).toFixed(3);
            return areaChinese
        } else {
            return 0
        }
    } catch (err) {
        return 0
    }
}

function loadGeometry4362(arr) {
    const geomeZZ = [
        []
    ];
    let geomeLS = [0, 0]; // 存每一个经纬度
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
            geomeLS = [0, 0];
            geomeLS[0] = arr[i];
        } else {
            geomeLS[1] = arr[i];
            geomeZZ[0].push(geomeLS);
        }
    }
    return geomeZZ;
}

export {
    intersectArea
}
