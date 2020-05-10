
// immediate pie chart
function init() {
  d3.csv('../../cleaned_data/In_progress/covid_pie.csv', function(virus) {

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
      title: "Countries with Most Cases",
      hovermode: false,
      autosize: false,
        width: 500,
        height: 500,
        margin: {
        l: 80,
        r: 50,
        pad: 10
        },
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
    var file = "../../cleaned_data/In_progress/sars_pie.csv";
  } 

  if (dataset === 'dataset1') {
    var file = "../../cleaned_data/In_progress/covid_pie.csv";
  }

  if (dataset === 'dataset3') {
    var file = "../../cleaned_data/In_progress/ebola_pie.csv";
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
      title: "Countries with Most Cases",
      hovermode: false,
      autosize: false,
      width: 500,
      height: 500,
      margin: {
      l: 80,
      r: 50,
      pad: 10
      },
    };


    Plotly.newPlot("pie", data, layout);

  

})
};

// show init graph upon opening page
init();