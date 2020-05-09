d3.csv("sars_pie.csv").then(function(virus) {

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