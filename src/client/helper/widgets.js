/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import Locate from '@arcgis/core/widgets/Locate';
import Track from '@arcgis/core/widgets/Track';
import Search from '@arcgis/core/widgets/Search';
import Sketch from '@arcgis/core/widgets/Sketch';
import Locator from '@arcgis/core/tasks/Locator';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

export function addLocate(view) {
  const locate = new Locate({
    view,
    useHeadingEnabled: false,
    // eslint-disable-next-line no-shadow
    goToOverride(view, options) {
      // eslint-disable-next-line no-param-reassign
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
  });
  view.ui.add(locate, 'top-left');
}

export function addTrack(view) {
  const track = new Track({
    view,
    graphic: new Graphic({
      symbol: {
        type: 'simple-marker',
        size: '12px',
        color: 'green',
        outline: {
          color: '#efefef',
          width: '1.5px',
        },
      },
    }),
    useHeadingEnabled: false,
  });
  view.ui.add(track, 'top-left');
}

export function addSearch(view) {
  const search = new Search({ // Add Search widget
    view,
  });
  view.ui.add(search, 'top-right'); // Add to the map

  const locatorTask = new Locator({
    url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
  });

  view.on('click', (evt) => {
    const params = {
      location: evt.mapPoint,
    };

    function showAddress(address, pt) {
      view.popup.open({
        title: `${+Math.round(pt.longitude * 100000) / 100000}, ${Math.round(pt.latitude * 100000) / 100000}`,
        content: address,
        location: pt,
      });
    }

    locatorTask.locationToAddress(params)
      .then((response) => { // Show the address found
        const { address } = response;
        showAddress(address, evt.mapPoint);
      }, (err) => { // Show no address found
        console.log(err);
        showAddress('No address found.', evt.mapPoint);
      });
  });
}

export function addSketch(map, view) {
  // Add sketch widget
  const graphicsLayerSketch = new GraphicsLayer();
  map.add(graphicsLayerSketch);

  const sketch = new Sketch({
    layer: graphicsLayerSketch,
    view,
    creationMode: 'update', // Auto-select
  });

  view.ui.add(sketch, 'top-right');

  // Add sketch events to listen for and execute query
  sketch.on('update', (event) => {
    // Create
    if (event.state === 'start') {
      queryFeaturelayer(event.graphics[0].geometry);
    }
    if (event.state === 'complete') {
      // Clear the graphic when a user clicks off of it or sketches new one
      graphicsLayerSketch.remove(event.graphics[0]);
    }
    // Change
    if (event.toolEventInfo && (event.toolEventInfo.type === 'scale-stop' || event.toolEventInfo.type === 'reshape-stop' || event.toolEventInfo.type === 'move-stop')) {
      queryFeaturelayer(event.graphics[0].geometry);
    }
  });

  // Reference query layer
  const parcelLayer = new FeatureLayer({
    url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/LA_County_Parcels/FeatureServer/0',
  });

  function queryFeaturelayer(geometry) {
    const parcelQuery = {
      spatialRelationship: 'intersects', // Relationship operation to apply
      geometry, // The sketch feature geometry
      outFields: ['APN', 'UseType', 'TaxRateCity', 'Roll_LandValue'], // Attributes to return
      returnGeometry: true,
    };

    parcelLayer.queryFeatures(parcelQuery)
      .then((results) => {
        displayResults(results);
        console.log(`Feature count: ${results.features.length}`);
      }).catch((error) => {
        console.log(error);
      });
  }

  // Show features (graphics)
  function displayResults(results) {
  // Create a blue polygon
    const symbol = {
      type: 'simple-fill',
      color: [20, 130, 200, 0.5],
      outline: {
        color: 'white',
        width: 0.5,
      },
    };

    const popupTemplate = {
      title: 'Parcel {APN}',
      content: 'Type: {UseType} <br> Land value: {Roll_LandValue} <br> Tax Rate City: {TaxRateCity}',
    };

    // Set symbol and popup
    results.features.map((feature) => {
      feature.symbol = symbol;
      feature.popupTemplate = popupTemplate;
      return feature;
    });

    // Clear display
    view.popup.close();
    view.graphics.removeAll();
    // Add features to graphics layer
    view.graphics.addMany(results.features);
  }
}
