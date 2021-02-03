import React, { useEffect } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView'

// SceneView
export default function About (){
  function init() {
    const map = new Map({
      basemap: "arcgis-topographic", //Basemap layer service
      ground: "world-elevation", //Elevation service
    });
    const view = new SceneView({
      container: "viewDiv",
      map: map,
      camera: {
        position: {
          x: -118.808, //Longitude
          y: 33.961, //Latitude
          z: 2000 //Meters
        },
        tilt: 75
      }
      });
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <div className="common-view" />
      about, hahaha
    </>
  )
}