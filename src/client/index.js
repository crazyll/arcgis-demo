import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import basemap from './basemap';

function main() {
  console.log('start')
  var map = new Map({
    basemap: "topo-vector",
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.805, 34.027], // longitude, latitude
    zoom: 13,
  });

  // Trailheads feature layer (points)
  var trailheadsLayer = new FeatureLayer({
    url:
      "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
  });
  // Trails feature layer (lines)
  var trailsLayer = new FeatureLayer({
    url:
      "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
  });
  // Parks and open spaces (polygons)
  var parksLayer = new FeatureLayer({
    url:
      "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
  });

  map.add(trailsLayer, 0);
  map.add(parksLayer, 0);
  map.add(trailheadsLayer);

  basemap(view);
}

main();