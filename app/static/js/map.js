function createMap(data) {

  // Create the tile layer
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Initialize an empty array to hold the heatmap data
  let heatArray = [];

  // Initialize a variable to keep track of the maximum AQI value
  let maxAQI = 0;

  // Iterate through the map data
  for (let i = 0; i < data.length; i++) {
    let location = data[i];
    let lat = location.latitude;
    let lon = location.longitude;
    let aqiValue = location.aqi_value;

    // Update maxAQI if necessary
    maxAQI = Math.max(maxAQI, aqiValue);

    // Create the popup content for each marker
    let popupContent = `
      <b>City:</b> ${location.city}<br>
      <b>Country:</b> ${location.country}<br>
      <b>AQI Value:</b> ${location.aqi_value}<br>
      <b>AQI Category:</b> ${location.aqi_category}<br>
    `;

    // Add the location data to the heatArray
    heatArray.push([lat, lon, aqiValue]);
  }

  // Create a heatmap layer using the heatArray
  let heat = L.heatLayer(heatArray, {
      radius: 25,
      blur: 15,
      max: maxAQI,
      gradient: { 0.4: '#0466C8', 0.6: '#023E7D', 0.7: '#001845', 0.8: '#5C677D', 1: '#979DAC' }
  });

  // Create markers for each location and add them to a marker cluster group
  let markers = L.markerClusterGroup();
  for (let i = 0; i < data.length; i++) {
      let location = data[i];
      let lat = location.latitude;
      let lon = location.longitude;

      // Create the popup content for each marker
      let popupContent = `
        <b>City:</b> ${location.city}<br>
        <b>Country:</b> ${location.country}<br>
        <b>AQI Value:</b> ${location.aqi_value}<br>
        <b>AQI Category:</b> ${location.aqi_category}<br>
      `;

      // Create a marker and bind the popup to it
      L.marker([lat, lon])
          .bindPopup(popupContent)
          .addTo(markers);
  }

  // Create the map and add the layers
  let myMap = L.map('map-container', {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, heat, markers]
  });

  // Add a scale control to the map
  L.control.scale().addTo(myMap);
}

// Fetch data from the Flask API and create the map
function do_work() {
  // We need to make a request to the API
  let url = `/api/v1.0/get_map/`;

  // make TWO requests
  d3.json(url).then(function (data) {
    createMap(data);
  });
}

// Call do_work to initialize the map when the page loads
do_work();