import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

export default function(view) {
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite",
  });

  var basemapGallery = new BasemapGallery({
    view: view,
    source: {
      portal: {
        url: "https://www.arcgis.com",
        useVectorBasemaps: false, // Load vector tile basemaps
      },
    },
  });

  view.ui.add(basemapToggle, "bottom-right");
  view.ui.add(basemapGallery, "top-right");
}