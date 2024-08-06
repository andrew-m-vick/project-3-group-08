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
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract the x & y values for our bar chart
  let bar_x = filtered_data.map(x => x.name);
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