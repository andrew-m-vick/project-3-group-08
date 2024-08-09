function do_work() {
    // extract user input
    let country = d3.select("#region_filter").property("value");
  
    // We need to make a request to the API
    let url = `/api/v1.0/get_dashboard/${region}`;
    d3.json(url).then(function (data) {
  
      // create the graphs
      make_bar(data.bar_data);
      make_pie(data.pie_data);
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
    // sort values
    filtered_data.sort((a, b) => (b.aqi_value - a.aqi_value));
  
    // extract data for pie chart
    let bar_data = filtered_data.map(x => x.aqi_value);
    let bar_labels = filtered_data.map(x => x.city);
  
    let trace1 = {
      values: bar_data,
      labels: bar_labels,
      type: 'bar',
      hoverinfo: 'label+percent+name',
      hole: 0.4,
      name: "Attempts"
    }
  
    // Create data array
    let data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      title: "AQI Value per Country",
    }
  
    Plotly.newPlot("bar_chart", data, layout);
  }
  
  function make_bar2(filtered_data) {
    // sort values
    filtered_data.sort((a, b) => (b.country - a.country));
  
    // extract the x & y values for our bar chart
    let bar_x = filtered_data.map(x => x.city);
    let bar_text = filtered_data.map(x => x.full_name);
    let bar_y1 = filtered_data.map(x => x.launch_attempts);
    let bar_y2 = filtered_data.map(x => x.launch_successes);
  
    // Trace1 for the Launch Attempts
    let trace1 = {
      x: bar_x,
      y: bar_y1,
      type: 'bar',
      marker: {
        color: "skyblue"
      },
      text: bar_text,
      name: "Attempts"
    };
  
    // Trace 2 for the Launch Successes
    let trace2 = {
      x: bar_x,
      y: bar_y2,
      type: 'bar',
      marker: {
        color: "firebrick"
      },
      text: bar_text,
      name: "Successes"
    };
  
    // Create data array
    let data = [trace1, trace2];
  
    // Apply a title to the layout
    let layout = {
      title: "SpaceX Launch Results",
      barmode: "group",
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
    Plotly.newPlot("bar_chart", data, layout);
  
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();