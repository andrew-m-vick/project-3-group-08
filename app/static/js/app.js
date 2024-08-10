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
  // Get top and bottom 5 results from sorted filtered data
  let top5Values = sortedAqiValues.slice(0, 5);
  let bottom5Values = sortedAqiValues.slice(-5);
  // Get ylimit to dynamically set ylimit based on aqi_value
  let highestAqi = sortedAqiValues[0];
  let ylimAqi = highestAqi.aqi_value;
  let ylimit = ylimAqi + 50;
  // Extract city, country and aqi_category for top and bottom 5 values
  let topCities = top5Values.map(item => item.city + ", " + item.country);
  let bottomCities = bottom5Values.map(item => item.city + ", " + item.country);
  let topChartText = top5Values.map(item => "AQI " + item.aqi_value + ": " + item.aqi_category);
  let bottomChartText = bottom5Values.map(item => "AQI " + item.aqi_value + ": " + item.aqi_category);
  // Extract AQI values and categories for top and bottom 5 values
  let topAqiValues = top5Values.map(item => item.aqi_value);
  let topAqiCategories = top5Values.map(item => item.aqi_category);
  let bottomAqiValues = bottom5Values.map(item => item.aqi_value);
  let bottomAqiCategories = bottom5Values.map(item => item.aqi_category);
  // Set each bar color according to AQI category
  function getColorByCategory(aqi_category) {
    switch (aqi_category) {
        case "Hazardous":
            return "0466C80";
        case "Very Unhealthy":
            return "#0353A451";
        case "Unhealthy":
            return "#023E7D";
        case "Unhealthy for Sensitive Groups":
            return "#5C677D";
        case "Moderate":
            return "#7D8597";
        case "Good":
            return "#979DAC";
        default:
            return 'orange'; // Default color catchall
    }
}
  // Create the data for the bar chart
  let data = [
      {
          y: topCities,
          x: topAqiValues,
          marker:{
            // Set bar color based on aqi_category
            color: topAqiCategories.map(category => getColorByCategory(category)),
            opacity: 0.75,
            line: {
              color: "black",
              width: 1},
          },
          type: 'bar',
          orientation: "h",
          text: topChartText,
          textposition: "auto",
          name: 'Top 5 Worst Cities',
      },
      {
          y: bottomCities,
          x: bottomAqiValues,
          marker:{
            color: bottomAqiCategories.map(category => getColorByCategory(category)),
            opacity: 0.75,
            line: {
              color: "black",
              width: 1},
          },
          type: 'bar',
          orientation: "h",
          text: bottomChartText,
          textposition: "auto",
          name: 'Top 5 Best Cities'
      },
  ];
  // Set layout options
  let layout = {
      showlegend: false,
      hoverlabel: {
      },
      title: {
        text:'Air Quality Index: Top 5 Best and Worst Cities',
        font: {
          family: "Arial, sans-serif",
          size: 24,
          Color: "black"
        },
      },
      xaxis: {
        title: {
            text: "Air Quality Index (AQI) Value",
            //standoff: 10,
            x: 110,
            y: 1000,
            //xanchor: ‘center’,
            //yanchor: ‘bottom’,
            font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'black'
            }
        }
    },
    yaxis: {
      title: {
          text: 'City',
          standoff: 20,
          x: 0,
          y: 0,
          xanchor: 'left',
          yanchor: 'middle',
          font: {
              family: 'Arial, sans-serif',
              size: 18,
              color: 'black'
          },
          range: [0, ylimit]
      }
    },
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 220,
      r: 100,
      b: 90,
      t: 90,
      pad: 5
    },
  };
  // Render the plot to the div tag with id “plot”
  Plotly.newPlot("bar_chart", data, layout);
}
  
  function make_bar2(filtered_data) {
    // sort values
    filtered_data.sort((a, b) => (b.aqi_value - a.aqi_value));
  
    // extract the x & y values for our bar chart
    let bar_x = filtered_data.map(x => x.aqi_category);
    let bar_text = filtered_data.map(x => x.aqi_category);
    let bar_y = filtered_data.map(x => x.count);
  
    // Trace1 for the Launch Attempts
    let trace1 = {
      x: bar_x,
      y: bar_y,
      type: 'bar',
      marker: {
        color: "skyblue"
      },
      text: bar_text,
      name: "Attempts"
    };
  
    // Create data array
    let data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      title: "AQI by category",
      // Include margins in the layout so the x-tick labels display correctly
      margin: {
        l: 50,
        r: 50,
        b: 200,
        t: 50,
        pad: 4
      }
    };
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar2_chart", data, layout);
  
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();