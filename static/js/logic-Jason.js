// Call CSV data
d3.csv("assets/data/data.csv").then(function (chartData) {
    chartData.forEach(function (dataPoint) {
        dataPoint.index = +dataPoint.index;
        dataPoint.index2 = +dataPoint.index2;
    });

//Listener for button clicks.
button.on('click', function() {
    var inputElement = d3.select(html_element);
    var inputValue = inputElement.property('value');
    function filterData(input){
        return input.virus == inputValue
    };
    var filteredData = data.filter(filterData);
    populate(filteredData);
});

// Create summary table
function populate(arr) {
    var table = d3.select("tbody");
    table.attr("id", "table");
    table.html("");
    arr.forEach(function (obj) {
        row = table.append("tr");
        row.append("td").text(obj.datetime);
        row.append("td").text(obj.city);
        row.append("td").text(obj.state);
        row.append("td").text(obj.country);
        row.append("td").text(obj.shape);
        row.append("td").text(obj.durationMinutes);
        row.append("td").text(obj.comments);
    })
}
// Populate table
populate(data);