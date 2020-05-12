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
    var colors = ['maroon','blue','green','purple']
    var i =0;
    chartData.forEach(function (obj) {
        row = table.append("tr");
        row.append("td").style("color",colors[i]).text(obj.virus);
        row.append("td").style("color",colors[i]).text(obj.cases);
        row.append("td").style("color",colors[i]).text(obj.deaths);
        row.append("td").style("color",colors[i]).text((obj.deaths / obj.cases*100).toFixed(2)+'%');
        i++;

    });
});
