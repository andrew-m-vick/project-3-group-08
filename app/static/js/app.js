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
  let sortedAqiValues = filtered_data.aqi_value.sort((a, b) => a - b);
  let top5Values = sortedAqiValues.slice(0, 5);
  let bottom5Values = sortedAqiValues.slice(-5);

  // Create the data for the bar chart
  let data = [
      {
          x: filtered_data.city.slice(0, 5),
          y: top5Values,
          type: 'bar',
          name: 'Top 5 Values'
      },
      {
          x: filtered_data.city.slice(-5),
          y: bottom5Values,
          type: 'bar',
          name: 'Bottom 5 Values'
      },
      {
          x: filtered_data.city,
          y: Array(filtered_data.city.length).fill(countryAvg),
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
      title: 'AQI Values Comparison',
      xaxis: { title: 'City' },
      yaxis: { title: 'AQI Value', range: [0, 500] }
  };
      
  // Include margins in the layout so the x-tick labels display correctly
  // margin: {
  //     l: 50,
  //     r: 50,
  //     b: 200,
  //     t: 50,
  //     pad: 4
  // };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart", data, layout);

}
  
  function make_bar2(filtered_data) {
    // sort values
    filtered_data.sort((a, b) => (b.aqi_value - a.aqi_value));
  
    // extract the x & y values for our bar chart
    let bar_x = filtered_data.map(x => x.city);
    let bar_text = filtered_data.map(x => x.city);
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
      title: "SpaceX Launch Results",
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