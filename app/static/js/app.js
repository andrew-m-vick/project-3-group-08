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
  // Calculate the mean AQI value
  let totalAqiValue = filtered_data.reduce((sum, item) => sum + item.aqi_value, 0);
  let countryAvg = totalAqiValue / filtered_data.length;

  // Sort the data based on AQI values
  let sortedData = [...filtered_data].sort((a, b) => a.aqi_value - b.aqi_value);

  // Get the first 5 (lowest) and last 5 (highest) AQI values
  let bottom5Values = sortedData.slice(0, 5);
  let top5Values = sortedData.slice(-5);

  // Prepare data for the bar chart
  let bottom5Cities = bottom5Values.map(item => item.city);
  let bottom5AqiValues = bottom5Values.map(item => item.aqi_value);

  let top5Cities = top5Values.map(item => item.city);
  let top5AqiValues = top5Values.map(item => item.aqi_value);

  // Create the data for Plotly
  let data = [
      {
          x: bottom5Cities,
          y: bottom5AqiValues,
          type: 'bar',
          name: 'Bottom 5 Values',
          marker: { color: 'orange' }
      },
      {
          x: top5Cities,
          y: top5AqiValues,
          type: 'bar',
          name: 'Top 5 Values',
          marker: { color: 'blue' }
      },
      {
          x: bottom5Cities.concat(top5Cities),
          y: Array(bottom5Cities.length + top5Cities.length).fill(countryAvg),
          type: 'scatter',
          mode: 'lines',
          name: 'Average',
          line: {
              color: 'red',
              width: 2,
              dash: 'dash'
          }
      }
  ];

  // Set layout options
  let layout = {
      title: 'Top 5 and Bottom 5 AQI Values',
      xaxis: { title: 'City' },
      yaxis: { title: 'AQI Value', range: [0, 500] },
      barmode: 'group',  // Group the bars to show them separately
      margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 50,
          pad: 4
      }
  };

  // Render the plot to the div tag with id "bar_chart"
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