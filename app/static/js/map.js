function createMap(data) {
  // Create the tile layer
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Initialize an empty array to hold the heatmap data
  let heatArray = [];

  // Define a mapping from AQI Category to numerical values
  const aqiCategoryMapping = {
    'Good': 1,
    'Moderate': 2,
    'Unhealthy for Sensitive Groups': 3,
    'Unhealthy': 4,
    'Very Unhealthy': 5,
    'Hazardous': 6
  };

  // Iterate through the map data and prepare the heatmap array
  for (let i = 0; i < data.length; i++) {
    let location = data[i];
    let lat = location.latitude;
    let lon = location.longitude;
    let aqiCategory = location.aqi_category;

    // Get the numerical value for the AQI Category
    let aqiCategoryValue = aqiCategoryMapping[aqiCategory];

    // Add the location data to the heatArray using the AQI Category value
    heatArray.push([lat, lon, aqiCategoryValue]);
  }

  // Create a heatmap layer using the heatArray
  let heat = L.heatLayer(heatArray, {
    radius: 30,
    blur: 10,
    max: 8, // Maximum value in the aqiCategoryMapping
    opacity: 0.8,
    gradient: { 
      0.17: '#00E400',  // Good (aqiCategoryValue = 1)
      0.33: '#FFFF00',  // Moderate (aqiCategoryValue = 2)
      0.50: '#FF7E00',  // Unhealthy for Sensitive Groups (aqiCategoryValue = 3)
      0.67: '#FF0000',  // Unhealthy (aqiCategoryValue = 4)
      0.83: '#8F3F97',  // Very Unhealthy (aqiCategoryValue = 5)
      1.00: '#7E0023'   // Hazardous (aqiCategoryValue = 6)
    }
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
  myMap = L.map('map-container', {
    center: [37.09, -95.71], 
    zoom: 5,                 
    layers: [streetmap, heat, markers]
  });

  // Add a scale control to the map
  L.control.scale().addTo(myMap);

  // Add a legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');

    // Add the legend title
    let title = L.DomUtil.create('div');
    title.innerHTML = '<h5>AQI Category</h5>'; // Set the title text
    div.appendChild(title);

    let grades = Object.keys(aqiCategoryMapping), 
        labels = [];

    // Loop through the AQI Categories and generate labels with colored squares
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(aqiCategoryMapping[grades[i]]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
  };

  legend.addTo(myMap); 

  // Add geocoder control
  L.Control.geocoder({
    defaultMarkGeocode: false // Prevent default marker placement
  }).on('markgeocode', function(e) {
    var bbox = e.geocode.bbox; // Get the bounding box of the result
    myMap.fitBounds(bbox);     // Fit the map to the bounding box
  }).addTo(myMap);

  // Function to get color based on AQI Category value
  function getColor(aqiCategoryValue) {
    return aqiCategoryValue === 6 ? '#7E0023' : // Hazardous
           aqiCategoryValue === 5 ? '#8F3F97' : // Very Unhealthy
           aqiCategoryValue === 4 ? '#FF0000' : // Unhealthy
           aqiCategoryValue === 3 ? '#FF7E00' : // Unhealthy for Sensitive Groups
           aqiCategoryValue === 2 ? '#FFFF00' : // Moderate
           aqiCategoryValue === 1 ? '#00E400' : // Good
                                    '#fefefe' ;  
  }
}

// Fetch data from the Flask API and create the map
function do_work() {
  let url = `/api/v1.0/get_map`; // Fetch all data initially

  d3.json(url).then(function(data) {
    createMap(data);
  });
}

// Call do_work to initialize the map when the page loads
do_work();