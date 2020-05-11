sars_file_path='oil_sars_gp.csv'
mers_file_path='oil_mers_gp.csv'
ebola_file_path='oil_ebola_gp.csv'
covid_file_path='oil_covid_gp.csv'

// LineBarAreaComposedChart from recharts.org
import React, { PureComponent } from 'react';
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, Scatter,
} from 'recharts';

// Create default chart
d3.csv("cleaned_data/in_progress/summary_table.csv");
var data = [
    {date: Date, cases: total_cases, deaths: total_deaths, price: current_price}
  // {
  //   name: 'Page A', uv: 590, pv: 800, amt: 1400, cnt: 490,
  // },
  // {
  //   name: 'Page B', uv: 868, pv: 967, amt: 1506, cnt: 590,
  // },
  // {
  //   name: 'Page C', uv: 1397, pv: 1098, amt: 989, cnt: 350,
  // },
  // {
  //   name: 'Page D', uv: 1480, pv: 1200, amt: 1228, cnt: 480,
  // },
  // {
  //   name: 'Page E', uv: 1520, pv: 1108, amt: 1100, cnt: 460,
  // },
  // {
  //   name: 'Page F', uv: 1400, pv: 680, amt: 1700, cnt: 380,
  // },
];

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/9xopwa9v/';

  render() {
    return (
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="cases" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="deaths" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="price" stroke="#ff7300" />
        {/* <Scatter dataKey="cnt" fill="red" /> */}
      </ComposedChart>
    );
  }
}

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