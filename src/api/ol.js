import 'ol/ol.css';
import {
    Map,
    View
} from 'ol';
import Tile from 'ol/layer/Tile';
import Image from 'ol/layer/Image';
import Vector from 'ol/layer/Vector';
import WFS from 'ol/format/WFS';
import OSM from 'ol/source/OSM.js';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import {
    createBox
} from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import * as control from 'ol/control';
import * as Condition from 'ol/events/condition';
import * as interaction from 'ol/interaction';
import * as Observable from 'ol/Observable';
import * as coordinate from 'ol/coordinate';
import * as source from 'ol/source';
import * as sphere from 'ol/sphere';
import * as geom from 'ol/geom';
import * as filter from 'ol/format/filter'
import {
    transform,
    fromLonLat,
    toLonLat,
    get,
    Projection,
    addProjection,
    addCoordinateTransforms
} from 'ol/proj'
import ImageStyle from 'ol/style/Image';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';
import * as extent from 'ol/extent'
let ol = {
    View,
    Map,
    interaction,
    Observable,
    coordinate,
    createBox,
    events: {
        Condition
    },
    Feature,
    Overlay,
    geom,
    layer: {
        TileLayer,
        Tile,
        Image,
        Vector
    },
    control,
    source,
    sphere,
    format: {
        WFS,
        GeoJSON,
        filter
    },
    style: {
        Style,
        Text,
        Stroke,
        Fill,
        Image: ImageStyle,
        Icon,
        Circle,
    },
    proj: {
        transform,
        fromLonLat,
        toLonLat,
        get,
        Projection,
        addProjection,
        addCoordinateTransforms
    },
    extent
}

export default ol
