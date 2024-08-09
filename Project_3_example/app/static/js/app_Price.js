function do_work() {
    console.log("inside function dowork()")
    
    // extract user input
    let country = d3.select("#country_filter").property("value");
    
    let url = `/api/v1.0/get_dashboard/${country}`;
    d3.json(url).then(function (data) {
        console.log("inside");

        
        // Filter by user input
        let filtered_data = data.filter(x => x.country === country);

        // if (country !== "All"){
        //     filtered_data = filtered_data.filter(x => x.country === country)
        // }
        // create the graphs
        make_bar(filtered_data);
  });
}


function make_bar(filtered_data) {
    // Get data values for bar chart
    let countryAvg = df2.aqi_value.mean();
    let sortedAqiValues = df2.aqi_value.sort((a, b) => a - b);
    let top5Values = sortedAqiValues.slice(0, 5);
    let bottom5Values = sortedAqiValues.slice(-5);

    // Create the data for the bar chart
    let data = [
        {
            x: df2.city.slice(0, 5),
            y: top5Values,
            type: 'bar',
            name: 'Top 5 Values'
        },
        {
            x: df2.city.slice(-5),
            y: bottom5Values,
            type: 'bar',
            name: 'Bottom 5 Values'
        },
        {
            x: df2.city,
            y: Array(df2.city.length).fill(countryAvg),
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

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();