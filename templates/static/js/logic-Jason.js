// Call CSV data
d3.csv("static/data/summary_table.csv")
//.then(function (chartData) {
    //D={
        // StackOverflow used this to sum a selected column
       // slice1:d3.sum(data, function(d){return parseFloat(d.cases);}),
    //};

// Create summary table
function populate(arr) {
    var table = d3.select("tbody");
    table.attr("id", "table");
    table.html("");
    arr.forEach(function (obj) {
        row = table.append("tr");
        row.append("td").text(obj.virus);
        row.append("td").text(obj.cases);
        row.append("td").text(obj.deaths);
    })
}
// Populate table
populate(data);