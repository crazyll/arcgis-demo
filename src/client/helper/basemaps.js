import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

export default function addBaseMaps(view) {
  const basemapToggle = new BasemapToggle({
    view,
    nextBasemap: 'satellite',
  });

  const basemapGallery = new BasemapGallery({
    view,
    source: {
      portal: {
        url: 'https://www.arcgis.com',
        useVectorBasemaps: false, // Load vector tile basemaps
      },
    },
  });

  view.ui.add(basemapToggle, 'bottom-right');
  view.ui.add(basemapGallery, 'top-right');
}
