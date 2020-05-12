
// immediate pie chart
function init() {
  d3.csv('./static/data/covid_pie.csv', function(virus) {

    //console.log(virus);

    var countries = [],
        cases = [];

    virus.forEach(function(data) {
        data.countries = data.Country;
        data.cases = parseInt(data.cases);
        countries.push(data.countries);
        cases.push(data.cases);
    });

    var trace1 = {
      labels: countries,
      values: cases,
      type: 'pie'
    };

    var data = [trace1];


    var layout = {
      title: "Case Spread over Countries",
      hovermode: false,
      autosize: false,
        width: 350,
        height: 350,
        // margin: {
        // l: 80,
        // r: 50,
        // pad: 10
        // },
        legend: {
          x: -2.5
        }
      
        
    };


    Plotly.newPlot("pie", data, layout);
  
  })
};



// reference dropdown
d3.selectAll("#selDataset").on("change", updatePlotly);

// updare plot based on dropdown 
function updatePlotly() {

  var dropdownMenu = d3.select("#selDataset");
  var dataset = dropdownMenu.property("value");

  if (dataset === 'dataset2') {
    var file = "./static/data/sars_pie.csv";
  } 

  if (dataset === 'dataset1') {
    var file = "./static/data/covid_pie.csv";
  }

  if (dataset === 'dataset3') {
    var file = "./static/data/ebola_pie.csv";
  }

  d3.csv(file, function(virus) {

    console.log(virus);

    var countries = [],
        cases = [];

    virus.forEach(function(data) {
        data.countries = data.Country;
        data.cases = parseInt(data.cases);
        countries.push(data.countries);
        cases.push(data.cases);
    });

    var trace1 = {
      labels: countries,
      values: cases,
      type: 'pie'
    };

    var data = [trace1];

    var layout = {
      title: "Case Spread over Countries",
      hovermode: false,
      autosize: false,
      width: 350,
      height: 350,
      // margin: {
      // l: 80,
      // r: 50,
      // pad: 10
      // },
      legend: {
        x: -2.5
      }
    }
    


    Plotly.newPlot("pie", data, layout);

  

})
};

// show init graph upon opening page
init();