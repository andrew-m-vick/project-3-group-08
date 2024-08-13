function do_work() {
  // extract user input
  let country = d3.select("#country_filter").property("value");
  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${country}`;
  d3.json(url).then(function (data) {
    // create the graphs
    make_bar(data.bar_data);
    make_bar2(data.bar2_data);
    make_table(data.table_data)
  });
}

function make_table(filtered_data) {
  // re-init the datatable
  $('#data_table').DataTable().clear().destroy();
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows
  // create table
  for (let i = 0; i < filtered_data.length; i++){
    // get data row
    let data_row = filtered_data[i];
    // creates new row in the table
    let row = table_body.append("tr");
    row.append("td").text(data_row.city);
    row.append("td").text(data_row.aqi_value);
    row.append("td").text(data_row.co_aqi_value);
    row.append("td").text(data_row.no2_aqi_value);
    row.append("td").text(data_row.latitude);
    row.append("td").text(data_row.longitude);
  }
  // Create the datatable
  $('#data_table').DataTable();
}

// Create a single function to get the color based on AQI category
function getColorByCategory(aqi_category) {
    switch (aqi_category) {
        case "Hazardous":
            return "#7E0023";
        case "Very Unhealthy":
            return "#8F3F97";
        case "Unhealthy":
            return "#FF0000";
        case "Unhealthy for Sensitive Groups":
            return "#FF7E00";
        case "Moderate":
            return "#FFFF00";
        case "Good":
            return "#00E400";
        default:
            return 'black'; // Default color catchall
    }
}

function make_bar(filtered_data) {
  // Get data values for bar chart
  // Filter out duplicate results from array of objects
  let uniqueValues = {};
  let result = filtered_data.filter(obj => {
    return uniqueValues.hasOwnProperty(obj.city) ? false : (uniqueValues[obj.city] = true);
  });
  // Sort filtered results
  let sortedAqiValues = result.sort((a, b) => (b.aqi_value - a.aqi_value));
  // If results have at least 10 cities, slice off the top 5 and bottom 5 and add to
  // combinedAqi.  If results have less then 5, add them directly to combinedAqi
  if (sortedAqiValues.length >= 10) {
      top5Values = sortedAqiValues.slice(0, 5);
      bottom5Values = sortedAqiValues.slice(-5);
      combinedAqi = top5Values.concat(bottom5Values);
  } else {
      combinedAqi = sortedAqiValues.slice().sort((a, b) => a - b);
  }
  // Get ylimit to dynamically set ylimit based on aqi_value
  let ylimit = 0;
  if (sortedAqiValues.length > 0) {
      let highestAqi = sortedAqiValues[0];
      ylimit = highestAqi.aqi_value + 50;
  }
  // Extract city, country and aqi_category
  let chartLocationLabel = combinedAqi.map(item => item.city + ", " + item.country);
  let chartDataLabel = combinedAqi.map(item => "AQI " + item.aqi_value + ": " + item.aqi_category);
  // Extract AQI values and categories
  let combinedAqiValues = combinedAqi.map(item => item.aqi_value);
  let combinedCategoryValues = combinedAqi.map(item => item.aqi_category);

  // Set each bar color according to AQI category
  let barColors = combinedCategoryValues.map(category => getColorByCategory(category));

  // Create the data for the bar chart
  let data = [
      {
          y: chartLocationLabel,
          x: combinedAqiValues,
          marker:{
            // Set bar color based on aqi_category
            color: barColors,
            opacity: 0.75,
            line: {
              color: "black",
              width: 1},
          },
          type: 'bar',
          hoverinfo: "none",
          orientation: "h",
          text: chartDataLabel,
          textposition: "auto",
          name: 'Top 5 Worst Cities',
      }
  ];
  // Set layout options
  let layout = {
    showlegend: false,
    title: {
      text: 'Air Quality Index: Top 5 Best and Worst Cities',
      font: {
        family: "Arial, sans-serif",
        size: 22,
        color: "black"
      }
    },
    // From xpert
    annotations: [
      {
        x: 0.5,
        y: -0.2,
        xref: 'paper',
        yref: 'paper',
        text: 'Air Quality Index (AQI) Value',
        showarrow: false,
        font: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
      },
      {
        x: -0.35,
        y: 0.5,
        xref: 'paper',
        yref: 'paper',
        text: 'City',
        showarrow: false,
        font: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        },
        textangle: -90
      }
    ],
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 200,
      r: 60,
      b: 90,
      t: 90,
      pad: 5
    },
  };
    // Check if the result array is empty
if (result.length === 0) {
  // Render a message instead of the chart
  document.getElementById("bar_chart").innerHTML = "<p>No data available for the selected country.</p>";
} else {
  // Render the plot to the div tag with id "bar2_chart"
  document.getElementById("bar_chart").innerHTML = "";
  Plotly.newPlot("bar_chart", data, layout);
}
}

function make_bar2(filtered_data) {
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
          // Use the same color function and desired order
          color: bar_x.map(category => getColorByCategory(category))
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

  // Check if the result array is empty
  if (filtered_data.length === 0) {
      // Render a message instead of the chart
      document.getElementById("bar2_chart").innerHTML = "<p>No data available for the selected country.</p>";
  } else {
      // Render the plot to the div tag with id "bar2_chart"
      document.getElementById("bar2_chart").innerHTML = "";
      Plotly.newPlot("bar2_chart", data, layout);
  }
}
  
// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);
// on page load, don't wait for the click to make the graph, use default
do_work();