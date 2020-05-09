
// immediate pie chart
function init() {
  d3.csv('../../cleaned_data/In_progress/sars_pie.csv').then(function(virus) {

    console.log(virus);

    var countries = [],
        cases = [];

    virus.forEach(function(data) {
        data.countries = data.Country;
        data.cases = parseInt(data.Confirmed);
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
      title: "Virus Pie",
      hoverlabel: {
      }
    };


    Plotly.newPlot("plt", data, layout);
  
  }).catch(function(error) {
  console.log(error);
});
};



// reference dropdown
d3.selectAll("#selDataset").on("change", updatePlotly);

// updare plot based on dropdown 
function updatePlotly() {

  var dropdownMenu = d3.select("#selDataset");
  var dataset = dropdownMenu.property("value");

  if (dataset === 'dataset1') {
    var file = "../../cleaned_data/In_progress/sars_pie.csv";
  } 

  if (dataset === 'dataset2') {
    var file = "../../cleaned_data/In_progress/covid_pie.csv";
  }

  if (dataset === 'dataset3') {
    var file = "../../cleaned_data/In_progress/ebola_pie.csv";
  }

  d3.csv(file).then(function(virus) {

    console.log(virus);

    var countries = [],
        cases = [];

    virus.forEach(function(data) {
        data.countries = data.Country;
        data.cases = parseInt(data.Confirmed);
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
      title: "Virus Pie",
      hoverlabel: {
      }
    };


    Plotly.newPlot("plt", data, layout);

  

}).catch(function(error) {
  console.log(error);
});
};

// show init graph upon opening page
init();