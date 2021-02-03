import React, { useEffect } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { addSearch, addTrack } from '../../helper/widgets';
import basemaps from '../../helper/basemaps';
import styles from './index.css';

// MapView
function init() {
  const map = new Map({
    basemap: 'topo-vector',
  });

  const view = new MapView({
    container: 'viewDiv',
    map,
    center: [114.03, 22.32], // 深圳
    zoom: 3,
  });

  return view;
}

export default function Index() {
  useEffect(() => {
    const view = init();
    addTrack(view);
    addSearch(view);
    basemaps(view);
  }, []);

  return (
    <div id="viewDiv" className="common-view" />
  );
}
