function do_work() {
  // extract user input
  let country = d3.select("#country_filter").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${country}`;
  d3.json(url).then(function (data) {

    // create the graphs
    make_bar(data.bar_data);
    
  });
}



function make_bar(filtered_data) {
  // ordering categories to display from best to worst
  const desiredOrder = [
    'Good',
    'Moderate',
    'Unhealthy for Sensitive Groups',
    'Unhealthy',
    'Very Unhealthy',
    'Hazardous'
];

// Sorting filtered_data based on the desired order
filtered_data.sort((a, b) => {
    return desiredOrder.indexOf(a.aqi_category) - desiredOrder.indexOf(b.aqi_category);
});
  // Initialize category counts
  let bar_x = filtered_data.map(item => item.aqi_category);
    let bar_y = filtered_data.map(item => item.count);

    let trace1 = {
        x: bar_x,
        y: bar_y,
        type: 'bar',
        marker: {
            color: ["#0466C8", "#0353A4", "#023E7D", "#33415C", "#002855", "#001845"]
        }
    };

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
      title: "AQI Category Counts",
      margin: {
          l: 50,
          r: 50,
          b: 200,
          t: 50,
          pad: 4
      },
      xaxis: {
          title: "AQI Category"
      },
      yaxis: {
          title: "Count"
      }
  };

  // Render the plot
  Plotly.newPlot("bar_chart", data, layout);
}

// Event listener for CLICK on Button
d3.select("#filter").on("click", function() {
  let country = d3.select("#country_filter").property("value");
  do_work(country); // Ensure fetchData is defined
});

// On page load, don't wait for the click to make the graph, use default
do_work();
