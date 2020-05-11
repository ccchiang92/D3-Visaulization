var sars_file_path='oil_sars_gp.csv';
var mers_file_path='oil_mers_gp.csv';
var ebola_file_path='oil_ebola_gp.csv';
var covid_file_path='oil_covid_gp.csv';

// Create default chart
d3.csv("cleaned_data/in_progress/summary_table.csv");
var data = [
    {date: Date, cases: total_cases, deaths: total_deaths, price: current_price}
];

// Assemble data array
virus.forEach(function(data) {
  data.date = parseInt(data.Date);
  data.cases = parseInt(data.total_cases);
  data.deaths = parseInt(data.total_deaths);
  data.price = parseInt(data.current_price);
  date.push(data.Date);
  cases.push(data.total_cases);
  deaths.push(data.total_deaths);
  price.push(data.current_price);
});

//Listener for button clicks.
var button = d3.select(".dropdown-item");

button.on('click', function() {
    var inputElement = d3.select(".dropdown-item");
    var inputValue = inputElement.property('value');
    function filterData(input){
        return input.virus == inputValue
    };
    var filteredData = data.filter(filterData);
    populate(filteredData);
});