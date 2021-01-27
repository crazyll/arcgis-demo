import React, { useEffect } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView'
import basemap from '../../basemap';

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

  basemap(view);
}

export default function Index() {

  useEffect(() => {
    main();
  }, [])

  return (
    <div>home</div>
  )
}

