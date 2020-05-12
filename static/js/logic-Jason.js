// Call CSV data
d3.csv("static/data/summary_table.csv", function(chartData){

// Create summary table
    var table = d3.select("#table");
    table.html("");
    head = table.append("tr");
    head.append("th").text("Virus");
    head.append("th").text("Cases");
    head.append('th').text("Deaths");
    head.append("th").text("Death Rate")
    chartData.forEach(function (obj) {
        row = table.append("tr");
        row.append("td").text(obj.virus);
        row.append("td").text(obj.cases);
        row.append("td").text(obj.deaths);
        row.append("td").text(`${(obj.deaths / obj.cases).toFixed(2)}%`);
    });
});
