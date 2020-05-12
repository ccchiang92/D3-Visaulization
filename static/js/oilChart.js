let csv_data;

d3.csv('./static/data/oil_prices.csv', function (error, oilData) {
    csv_data = oilData;
    console.log(csv_data)
    init()
});

function oilChange(virus) {
    oilChart(virus)
}

function init() {
    const selector = d3.select("#oil-dropdown");
    let viruses = [];
    const virusData = csv_data.map(row => row.Virus);
    virusData.forEach(v => {
        if (!viruses.includes(v)) {
            viruses.push(v);
        };
    });
    viruses.forEach(v => {
        selector.append("option")
            .property("value", v)
            .text(v);
    });
    oilChange(viruses[0])
}

function oilChart(virus) {
    // Code from https://plotly.com/javascript/multiple-axes/
    const filteredData = csv_data.filter(row => row.Virus === virus);
    console.log(filteredData);
    var trace1 = {
        x: filteredData.map(row => row.Date),
        y: filteredData.map(row => row.Brent_Spot_Price),
        name: 'weekly oil price, in dollars',
        type: 'scatter'
      };
      
      var trace2 = {
        x: filteredData.map(row => row.Date),
        y: filteredData.map(row => row.Cases),
        name: 'number of cases',
        yaxis: 'y2',
        type: 'scatter'
      };
    
    var data = [trace1, trace2];

    var layout = {
        title: 'Oil Prices During Viral Outbreaks',
        yaxis: { title: 'Number of cases and deaths' },
        yaxis2: {
            title: 'Weekly oil price, US$',
            titlefont: { color: 'rgb(148, 103, 189)' },
            tickfont: { color: 'rgb(148, 103, 189)' },
            overlaying: 'y',
            side: 'right'
        }
    };
    Plotly.newPlot('oil-chart', data, layout)
}

