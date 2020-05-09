d3.csv("../../cleaned_data/In_progress/deaths.csv").then(function(virus) {

    console.log(virus);

    var days = [],
        sars = [],
        ebola = [],
        covid = [];

    virus.forEach(function(data) {
        data.days = parseInt(data.days);
        data.ebola = parseInt(data.ebola_death);
        data.covid = parseInt(data.covid_death);
        data.sars = parseInt(data.sars_death);
        days.push(data.days);
        sars.push(data.sars);
        ebola.push(data.ebola);
        covid.push(data.covid);
    });

    var trace1 = {
        x: days,
        y: sars,
        name: "SARS",
        type: "line"
    };

    var trace2 = {
        x: days,
        y: covid,
        name: "COVID",
        type: "line"
    };

    var trace3 = {
        x: days,
        y: ebola,
        name: "Ebola",
        type: "line"
    };

    var data = [trace1, trace2, trace3];

    var layout = {
        title: {
            text:'Number of Deaths over Time',
            font: {
                size: 18
            },
        },

        yaxis: {
            title: {
                text: 'Number of Deaths',
                font: {
                    size: 13
                }
            },
            range: [0, 100000]
        },
        xaxis: {
            title: {
                text: 'Days Since First Case',
                font: {
                    size: 13
                }
            },
        },
        autosize: false,
        width: 400,
        height: 300,
        margin: {
        l: 80,
        r: 50,
        pad: 10
        },
    };

    Plotly.newPlot("deaths", data, layout);

  

}).catch(function(error) {
  console.log(error);
});
