// Define chart dimensions
var svgWidth = 300;
var svgHeight = 200;

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "COVID-19";

// function used for updating x-scale var upon click on axis label
function xScale(oil_prices, ) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(oil_prices, d => d[]) * 0.8,
        d3.max(oil_prices, d => d[]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// Create default chart
d3.csv("static/data/oil_prices.csv").then(function (oil_prices, err) {
    if (err) throw err;

    // // group the data: I want to draw one line per group
    // var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    //     .key(function (d) { return d.name; })
    //     .entries(data);

    // parse data
    oil_prices.forEach(function (data) {
        data.Date = +data.Date;
        data.Brent_Spot_Price = +data.Brent_Spot_Price;
        data.Cases = +data.Cases;
        data.Deaths = +data.Deaths;
        data.Virus = data.Virus
    });;

    // Create x scale function
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(oil_prices, d => d.Date)])
        .range([height, 0]);

    // Create y scale function
    var yLinearScale = xScale(oil_prices, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);


    // //Listener for button clicks.
    // var button = d3.select(".dropdown-item");

    // button.on('click', function() {
    //     var inputElement = d3.select(".dropdown-item");
    //     var inputValue = inputElement.property('value');
    //     function filterData(input){
    //         return input.virus == inputValue
    //     };
    //     var filteredData = data.filter(filterData);
    //     populate(filteredData);
    // });

    // Draw the line
    //     svg.selectAll(".line")
    //         .data(sumstat)
    //         .enter()
    //         .append("path")
    //         .attr("fill", "none")
    //         .attr("stroke", function (d) { return color(d.key) })
    //         .attr("stroke-width", 1.5)
    //         .attr("d", function (d) {
    //             return d3.line()
    //                 .x(function (d) { return x(d.year); })
    //                 .y(function (d) { return y(+d.n); })
    //                 (d.values)
    //         })

    // })


    var data = [trace1, trace2];

    var layout = {
        title: 'Oil Prices During Viral Outbreaks',
        yaxis: { title: 'Number of cases and deaths' },
        yaxis2: {
            title: 'Weekly oil price',
            titlefont: { color: 'rgb(148, 103, 189)' },
            tickfont: { color: 'rgb(148, 103, 189)' },
            overlaying: 'y',
            side: 'right'
        }
    };


    // function used for updating xAxis var upon click on axis label
    // function renderAxes(newXScale, xAxis) {
    //     var bottomAxis = d3.axisBottom(newXScale);

    //     xAxis.transition()
    //         .duration(1000)
    //         .call(bottomAxis);

    //     return xAxis;
    // }

    // function used for updating circles group with a transition to
    // new circles
    // function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    //     circlesGroup.transition()
    //         .duration(1000)
    //         .attr("cx", d => newXScale(d[chosenXAxis]));

    //     return circlesGroup;
    // }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenYAxis, linesGroup) {

        var label;

        if (chosenYAxis === "COVID-19") {
            label = "COVID-19";
        }
        else if (chosenYAxis === "SARS") {
            label = "SARS";
        }
        else if (chosenYAxis === "MERS") {
            label = "MERS";
        }
        else {
            label = "Ebola";
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.Date}<br>${label} ${d[Brent_Spot_Price]}`);
            });

        linesGroup.call(toolTip);

        linesGroup.on("mouseover", function (data) {
            toolTip.show(data);
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        return linesGroup;
    }



    // append initial circles
    // var circlesGroup = chartGroup.selectAll("circle")
    //     .data(hairData)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => xLinearScale(d[chosenXAxis]))
    //     .attr("cy", d => yLinearScale(d.num_hits))
    //     .attr("r", 20)
    //     .attr("fill", "pink")
    //     .attr("opacity", ".5");

    // Create group for four x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var covidLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "COVID-19") // value to grab for event listener
        .classed("active", true)
        .text("COVID-19");

    var sarsLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "SARS") // value to grab for event listener
        .classed("inactive", true)
        .text("SARS");

    var mersLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "MERS") // value to grab for event listener
        .classed("inactive", true)
        .text("MERS");
    var ebolaLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "Ebola") // value to grab for event listener
        .classed("inactive", true)
        .text("Ebola");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Number of Billboard 500 Hits");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // y axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = xScale(oil_prices, chosenYAxis);

                // updates x axis with transition
                xyAxis = renderAxes(yLinearScale, yAxis);

                // // updates lines with new x values
                // linesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // changes classes to change bold text
                if (chosenYAxis === "COVID-19") {
                    covidLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    sarsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    mersLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ebolaLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "SARS") {
                    covidLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    sarsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    mersLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ebolaLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "MERS") {
                    covidLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    sarsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    mersLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ebolaLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    covidLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    sarsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    mersLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ebolaLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});
