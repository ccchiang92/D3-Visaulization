// Call CSV data
d3.csv("static/data/summary_table.csv", function(chartData){

// Create summary table

    var table = d3.select("#table");
    table.html("");
    chartData.forEach(function (obj) {
        row = table.append("tr");
        row.append("td").text(obj.virus);
        row.append("td").text(obj.cases);
        row.append("td").text(obj.deaths);
    });
});
