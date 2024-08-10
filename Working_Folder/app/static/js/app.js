function do_work() {
    // extract user input
    let country = d3.select("#country_filter").property("value");
  
    // We need to make a request to the API
    let url = `/api/v1.0/get_dashboard/${country}`;
    d3.json(url).then(function (data) {
  
      // create the graphs
      //make_bar(data.bar_data);
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
    // sort values
    filtered_data.sort((a, b) => (b.aqi_value - a.aqi_value));
  
    // extract data for pie chart
    let bar_x = filtered_data.map(x => x.aqi_category);
    let bar_y = filtered_data.map(x => x.count);
  
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
  
    Plotly.newPlot("bar_chart", data, layout);
  }
  
  function make_bar2(filtered_data) {

    // Get data values for bar chart
    //let countryAvg = (filtered_data.aqi_value.sum() / filtered_data.aqi_value.length);

    
    let sortedAqiValues = filtered_data.sort((a, b) => (b.aqi_value - a.aqi_value));

    let top5Values = sortedAqiValues.slice(0, 5);
    let bottom5Values = sortedAqiValues.slice(-5);
    console.log(top5Values);

    // Get ylimit to dynamically set ylimit
    let highestAqi = sortedAqiValues[0];
    console.log(highestAqi);
    let ylimAqi = highestAqi.aqi_value;
    console.log(ylimAqi);
    let ylimit = ylimAqi + 50;

    // Extract city names for top and bottom 5 values
    let topCities = top5Values.map(item => item.city + ", " + item.country);
    let bottomCities = bottom5Values.map(item => item.city + ", " + item.country);

    // Extract AQI values for top and bottom 5 values
    let topAqiValues = top5Values.map(item => item.aqi_value);
    let bottomAqiValues = bottom5Values.map(item => item.aqi_value);

    // Set each bar color according to AQI category
    // Loop through topAqiValues and bottomAqiValues, set the color based on category, save data to new array.



    // Create the data for the bar chart
    let data = [
        {
            x: topCities,
            y: topAqiValues,
            marker:{
              color: "blue",
              line: {
                color: "black",
                width: 1},
            },
            type: 'bar',
            name: 'Top 5 Worst Cities'
        },
        {
            x: bottomCities,
            y: bottomAqiValues,
            marker:{
              color: "green",
              line: {
                color: "black",
                width: 1},
            },
            type: 'bar',
            name: 'Top 5 Best Cities'
        },
        // {
        //     x: filtered_data.city,
        //     y: Array(filtered_data.city.length).fill(countryAvg),
        //     type: 'scatter',
        //     mode: 'lines',
        //     name: 'Average',
        //     line: {
        //         color: 'red',
        //         width: 2,
        //         dash: 'dash'
        //     }
        // }
    ];

    // Set layout options
    let layout = {
        title: 'AQI Values Comparison',
        xaxis: { title: 'City' },
        yaxis: { title: '\n AQI Value \n', range: [0, ylimit] },
        images: [
          {
            "source": "/aqi_category_background.png",
            "xref": "paper",
            "yref": "paper",
            "x": 0,
            "y": 1,
            "sizex": 0.2,
            "sizey": 0.2,
            "xanchor": "right",
            "yanchor": "bottom"
          }
        ],
      // Include margins in the layout so the x-tick labels display correctly
      margin: {
        l: 70,
        r: 70,
        b: 120,
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