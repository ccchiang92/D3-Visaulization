// Call CSV data
d3.csv("cleaned_data/in_progress/mers_final.csv").then(function (chartData) {
    D={
        // StackOverflow used this to sum a selected column
        slice1:d3.sum(data, function(d){return parseFloat(d.cases);}),
    };

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
