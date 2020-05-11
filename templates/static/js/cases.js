d3.csv("../../cleaned_data/In_progress/cases.csv", function(virus) {

    console.log(virus);

    var days = [],
        sars = [],
        ebola = [],
        covid = [];

    virus.forEach(function(data) {
        data.days = parseInt(data.days);
        data.ebola = parseInt(data.ebola_cases);
        data.covid = parseInt(data.covid_cases);
        data.sars = parseInt(data.sars_cases);
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
        type: "line",
        yaxis: 'y2'
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
            text:'Number of Cases over Time',
            font: {
                size: 18
            },
        },

        yaxis: {
            title: {
                text: 'Ebola & SARS Cases',
                font: {
                    size: 13
                }
            },
            range: [0, 15000]
        },

        yaxis2: {
            title: {
                text: 'COVID Cases',
                font: {
                    size: 13
                }
            },
            overlaying: 'y',
            range: [0, 4000000],
            side: 'right'
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
        // margin: {
        // l: 80,
        // r: 50,
        // pad: 10
        // },
        legend : {"x" : 1.3, "y" : 1}
    };

    Plotly.newPlot("cases", data, layout);
  
    
  
  });
  