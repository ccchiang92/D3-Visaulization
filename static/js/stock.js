// Responsive interactive d3 scatter plot script
// Uses code from class activities

var colors= ['red','blue','green','orange','yellow','pink','grey','purple']

function makeResponsive(){
    var initSvg = d3.select('#chart').select('svg');
    if (!initSvg.empty()) {
        initSvg.remove();
    }
    // Setting SVG parameters
    var svgHeight = window.innerHeight*0.8;
    var svgWidth = window.innerWidth*0.8;

    // margins
    var margin = {
        top: svgHeight/15,
        right: svgWidth/8,
        bottom: svgHeight/10,
        left: svgWidth/8
    };
    var chartH = svgHeight - margin.top - margin.bottom;
    var chartW = svgWidth - margin.right - margin.left;

    var chartSvg = d3.select('#chart')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);
    
    var lineChartG = chartSvg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    lineChartG.append("text")
        .attr("x", (chartW / 4))             
        .attr("y", 0 - (margin.top / 2))
        .style("font-size", "24px")
        .attr("value", "Covid-19")
        .classed("virusLabel active clickable", true)
        .text("Covid-19");
    lineChartG.append("text")
        .attr("x", (chartW / 2))             
        .attr("y", 0 - (margin.top / 2))
        .style("font-size", "24px") 
        .attr("value", 'Ebola')
        .classed("virusLabel inactive clickable", true)
        .text("Ebola");
    lineChartG.append("text")
        .attr("x", (chartW / 4*3))             
        .attr("y", 0 - (margin.top / 2))
        .style("font-size", "24px")
        .attr("value", 'SARS')
        .classed("virusLabel inactive clickable", true)
        .text("SARS");
    var data_loc = '../cleaned_data/In_progress/'
    var curVirus ='Covid-19';
    var curCountry ='Total';
    var curIndex = 'DJI';

    // Label creation function
    function setupOptions (virus){
        var year;
        var indexes=['DJI','SSE'];
        var countries=['World Total']
        switch (virus){
            case 'Covid-19':
                year ='2020'
                indexes.push('EU50');
                indexes.push('FTSE');
                countries.push('USA');
                countries.push('China');
                countries.push('Italy');
                break;
            case 'Ebola':
                year ='2014'
                indexes.push('EU50');
                indexes.push('NSE');
                countries.push('Nigeria');
                countries.push('Sierra Leone');
                break;
            case 'SARS':
                year ='2003'
                indexes.push('HSI')
                countries.push('Hong Kong');
                break;
        }
    
        // Create axis labels
        var old_labels = d3.select('.countryLables');
        // remove old labels
        if (!old_labels.empty()){
            old_labels.remove()
            d3.select('.indexLabels').remove();
        }

            var countryGroup = lineChartG.append('g')
            .classed('countryLabels', true)
            .attr("transform", `translate(${chartW}, ${chartH/5})`);
            
    
            var indexGroup = lineChartG.append('g')
            .classed('indexLabels', true)
            .attr("transform", `translate(0, ${chartH/5})`);
    
                
            var i =1;
            indexGroup.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "16px")
                .attr("y", 0)
                .attr("x", 0- margin.left )
                .attr('fill','maroon')  
                .text('Stock Indexes');
            indexGroup.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("y", 20)
                .attr("x", 0- margin.left )
                .attr('fill','maroon')  
                .text('In respective currency');
            indexes.forEach((ind)=>{
                if (i==1){
                    var ac ='active';
                }else{
                    var ac ='inactive';
                }
                indexGroup.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "16px")
                .attr("value", ind)
                .attr("y", i*90)
                .attr("x", 0- margin.left/2 )
                .classed(ac+ " clickable indexLabel", true)
                .text(ind);
                i++;
            });
            i=1;
            countryGroup.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("y", 0)
            .attr("x", 0+ margin.left/5  )
            .attr('fill','darkblue')  
            .text('Cases/Deaths');
            countries.forEach((coun)=>{
                if (i==1){
                    var ac ='active';
                }else{
                    var ac ='inactive';
                }
                var labValue;
                if (coun=='World Total'){
                    labValue='Total';
                }else if (coun=='USA'){
                    labValue = 'United States of America';
                }else{
                    labValue=coun;
                }
                countryGroup.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "16px")
                .attr("value", coun)
                .attr("y", i*90)
                .attr("x", 0 + margin.left/2)
                .classed(ac+" clickable countryLabel", true)
                .text(coun);
                i++;
            });
    
    
    
        
    
        // X label
            lineChartG.append("text")
            .attr("transform", `translate(${chartW / 2-margin.left*0.7}, ${chartH + margin.top*0.7})`)
            .attr("font-size", "16px")
            .attr('fill','olive')
            .classed("yLabel", true)
            .text('Date in '+year);
    
    }



    // init line graph
    // load covid data
    d3.csv(data_loc+'covid_daily_world.csv', function(error, virusData) {
        if (error) throw error;
        var virus = 'Covid-19'
        var file_name;
        var case_col;
        var death_col;
        var country_col;
        var country ='Total'
        switch (virus){
            case 'Covid-19':
                file_name = 'covid_daily_world.csv';
                case_col='Confirmed';
                death_col='Deaths';
                country_col = 'Country/Region';
                break;
            case 'Ebola':
                file_name = 'ebola_final';
                country_col = 'Country';
                case_col='No. of confirmed cases';
                death_col='No. of confirmed deaths';
                break;
            case 'SARS':
                country_col = 'Country';
                file_name = 'SARS_data.csv';
                case_col='Cases';
                death_col='Deaths';
                break;
        }
        setupOptions(virus);
        // format data
            var just_one_country =[];
            virusData.forEach(function(row) {
              if (row[country_col]==country){
                row.Date = d3.isoParse(row.Date);
                row[case_col] = +row[case_col];
                row[death_col] = +row[death_col];
                just_one_country.push(row);
              }
              
            });
            
            // create x time scale
            var xTimeScale = d3.scaleTime()
              .range([0, chartW])
              .domain(d3.extent(just_one_country, data => data.Date));
          
            //   create right axis
            var yLinearScale = d3.scaleLinear()
              .range([chartH, 0])
              .domain([0, d3.max(just_one_country, data => data[case_col])]);
          
            var bottomAxis = d3.axisBottom(xTimeScale);
            var rightAxis = d3.axisRight(yLinearScale);
          
            var drawConfirm = d3
              .area()
              .x(data => xTimeScale(data.Date))
              .y1(data => yLinearScale(data[case_col]))
              .y0(yLinearScale(0));
            var drawDeath = d3
              .area()
              .x(data => xTimeScale(data.Date))
              .y1(data => yLinearScale(data[death_col]))
              .y0(yLinearScale(0));
          
            // draw 2 areas
            var confirmedArea = lineChartG.append("path")
              .attr("d", drawConfirm(just_one_country))
              .classed("stockLine", true)
              .attr("opacity", ".5")
              .attr("fill", "CornflowerBlue")
              .attr("stroke", "grey")
              .attr("stroke-width", 3);
            var deathArea = lineChartG.append("path")
              .attr("d", drawDeath(just_one_country))
              .classed("stockLine", true)
              .attr("opacity", ".3")
              .attr("fill", "Orange")
              .attr("stroke", "grey")
              .attr("stroke-width", 3);
          
            lineChartG.append("g")
              .classed("axis", true)
              .attr("transform", "translate(" + chartW + ", 0)")
              .call(rightAxis);

          
         
            lineChartG.append("g")
              .classed("axis", true)
              .attr("transform", "translate(0, " + chartH + ")")
              .call(bottomAxis);
            
            //   Load default stock data
              d3.csv(data_loc+'/stock/'+'DJI'+' '+'2020'+'.csv', function(error, stockData) {
                if (error) throw error;
                    stockData.forEach(function(data) {
                      data.Date = d3.isoParse(data.Date);
                      data.Price = +data.Price;
                    });
                    var yLeftScale = d3.scaleLinear()
                                .range([chartH, 0])
                                .domain([0, d3.max(stockData, data => data.Price)]);
                      
                    var leftAxis = d3.axisLeft(yLeftScale);
                            
                    lineChartG.append("g")
                                .classed("axis", true)
                                .call(leftAxis);
                  
                  
                    var drawLine = d3
                      .line()
                      .x(data => xTimeScale(data.Date))
                      .y(data => yLeftScale(data.Price));
                  
                    // Append an SVG path and plot its points using the line function
                    lineChartG.append("path")
                      // The drawLine function returns the instructions for creating the line for milesData
                      .attr("d", drawLine(stockData))
                      .classed("stockLine", true)
                      .attr("opacity", ".8")
                      .attr("fill", "none")
                      .attr("stroke", colors[0])
                      .attr("stroke-width", 3);
                  
                    // handle clicks
                      lineChartG.selectAll('.virusLabel')
                      .on('click',function(){
                          var value = d3.select(this).attr("value");
                          if (value !== curVirus) {
                                curVirus = value;
                                //   xScale = setScale(censusData, currentX,'x');
                                //   xAxis = renderAxes(xScale, xAxis,'x');
                                //   circles = renderCircles(circles, xScale, currentX,'x');
                                  d3.selectAll('.virusLabel').classed("inactive", true);
                                  d3.selectAll('.virusLabel').classed("active", false);
                                  d3.select(this).classed("active", true)
                                  d3.select(this).classed("inactive", false)

                              
                              }
                              // update tooltips
                            //   circles = updateToolTip(currentX,currentY, circles);
                            
                      });



                  });


          });

    function draw_virus(path,virus,country){
        var file_name;
        var case_col;
        var death_col;
        var country_col;
        switch (virus){
            case 'Covid-19':
                file_name = 'covid_daily_world.csv';
                case_col='Confirmed';
                death_col='Deaths';
                country_col = 'Country/Region';
                break;
            case 'Ebola':
                file_name = 'ebola_final';
                country_col = 'Country';
                case_col='No. of confirmed cases';
                death_col='No. of confirmed deaths';
                break;
            case 'SARS':
                country_col = 'Country';
                file_name = 'SARS_data.csv';
                case_col='Cases';
                death_col='Deaths';
                break;
        }
        d3.csv(path+file_name, function(error, virusData) {
            if (error) throw error;
                // Format the date and cast the miles value to a number
                var just_one_country =[];
                virusData.forEach(function(row) {
                  if (row[country_col]==country){
                    row.Date = d3.isoParse(row.Date);
                    row[case_col] = +row[case_col];
                    row[death_col] = +row[death_col];
                    just_one_country.push(row);
                  }
                  
                });
                
                // Configure a time scale with a range between 0 and the chartWidth
                // Set the domain for the xTimeScale function
                // d3.extent returns the an array containing the min and max values for the property specified
                var xTimeScale = d3.scaleTime()
                  .range([0, chartW])
                  .domain(d3.extent(just_one_country, data => data.Date));
              
                // Configure a linear scale with a range between the chartHeight and 0
                // Set the domain for the xLinearScale function
                var yLinearScale = d3.scaleLinear()
                  .range([chartH, 0])
                  .domain([0, d3.max(just_one_country, data => data[case_col])]);
              
                // Create two new functions passing the scales in as arguments
                // These will be used to create the chart's axes
                var bottomAxis = d3.axisBottom(xTimeScale);
                var rightAxis = d3.axisRight(yLinearScale);
              
                // Configure a drawLine function which will use our scales to plot the line's points
                var drawConfirm = d3
                  .area()
                  .x(data => xTimeScale(data.Date))
                  .y1(data => yLinearScale(data[case_col]))
                  .y0(yLinearScale(0));
                var drawDeath = d3
                  .area()
                  .x(data => xTimeScale(data.Date))
                  .y1(data => yLinearScale(data[death_col]))
                  .y0(yLinearScale(0));
              
                // Append an SVG path and plot its points using the line function
                lineChartG.append("path")
                  // The drawLine function returns the instructions for creating the line for milesData
                  .attr("d", drawConfirm(just_one_country))
                  .classed("stockLine", true)
                  .attr("opacity", ".5")
                  .attr("fill", "CornflowerBlue")
                  .attr("stroke", "grey")
                  .attr("stroke-width", 3);
                lineChartG.append("path")
                  // The drawLine function returns the instructions for creating the line for milesData
                  .attr("d", drawDeath(just_one_country))
                  .classed("stockLine", true)
                  .attr("opacity", ".3")
                  .attr("fill", "Orange")
                  .attr("stroke", "grey")
                  .attr("stroke-width", 3);
              
                // Append an SVG group element to the SVG area, create the left axis inside of it
                lineChartG.append("g")
                  .classed("axis", true)
                  .attr("transform", "translate(" + chartW + ", 0)")
                  .call(rightAxis);

              
                // Append an SVG group element to the SVG area, create the bottom axis inside of it
                // Translate the bottom axis to the bottom of the page
                lineChartG.append("g")
                  .classed("axis", true)
                  .attr("transform", "translate(0, " + chartH + ")")
                  .call(bottomAxis);



                  scatterChartG.selectAll('.clickable')
                  .on('click',function(){
                      var value = d3.select(this).attr("value");
                      if (value !== currentX | value !== currentY) {
                          // if click on a x label
                          // change currentX value and call update functions
                          if (value === 'poverty' | value === 'age'){
                              currentX = value;
                              xScale = setScale(censusData, currentX,'x');
                              xAxis = renderAxes(xScale, xAxis,'x');
                              circles = renderCircles(circles, xScale, currentX,'x');
                              abbrGroup = renderAbbr(abbrGroup, xScale, currentX,'x');
                              if (currentX === "poverty") {
                              povertyLabel
                                  .classed("active", true)
                                  .classed("inactive", false);
                              ageLabel
                                  .classed("active", false)
                                  .classed("inactive", true);
                              }
                              else {
                              povertyLabel
                                  .classed("active", false)
                                  .classed("inactive", true);
                              ageLabel
                                  .classed("active", true)
                                  .classed("inactive", false);
                              }
                          }else{
                              currentY = value;
                              yScale = setScale(censusData, currentY,'y');
                              yAxis = renderAxes(yScale, yAxis,'y');
                              circles = renderCircles(circles, yScale, currentY,'y');
                              abbrGroup = renderAbbr(abbrGroup, yScale, currentY,'y');
                              if (currentY === "healthcare") {
                              healthLabel
                                  .classed("active", true)
                                  .classed("inactive", false);
                              smokeLabel
                                  .classed("active", false)
                                  .classed("inactive", true);
                              }
                              else {
                              healthLabel
                                  .classed("active", false)
                                  .classed("inactive", true);
                              smokeLabel
                                  .classed("active", true)
                                  .classed("inactive", false);
                              }
                          }
                          // update tooltips
                          circles = updateToolTip(currentX,currentY, circles);
                        }
                  });
              });
    };
   


function draw_stock(path, index,year,color,yScale){
    d3.csv(path+'/stock/'+index+' '+year+'.csv', function(error, stockData) {
        if (error) throw error;
            // Format the date and cast the miles value to a number
            stockData.forEach(function(data) {
              data.Date = d3.isoParse(data.Date);
              data.Price = +data.Price;
            });
          
            // Configure a time scale with a range between 0 and the chartWidth
            // Set the domain for the xTimeScale function
            // d3.extent returns the an array containing the min and max values for the property specified
            var xTimeScale = d3.scaleTime()
              .range([0, chartW])
              .domain(d3.extent(stockData, data => data.Date));
          
            // Configure a linear scale with a range between the chartHeight and 0
            // Set the domain for the xLinearScale function
           
          
            // Create two new functions passing the scales in as arguments
            // These will be used to create the chart's axes
            // var bottomAxis = d3.axisBottom(xTimeScale);
        
            // Configure a drawLine function which will use our scales to plot the line's points
            var drawLine = d3
              .line()
              .x(data => xTimeScale(data.Date))
              .y(data => yScale(data.Price));
          
            // Append an SVG path and plot its points using the line function
            lineChartG.append("path")
              // The drawLine function returns the instructions for creating the line for milesData
              .attr("d", drawLine(stockData))
              .classed("stockLine", true)
              .attr("opacity", ".8")
              .attr("fill", "none")
              .attr("stroke", color)
              .attr("stroke-width", 3);
          
            // Append an SVG group element to the SVG area, create the left axis inside of it
            
          
            // Append an SVG group element to the SVG area, create the bottom axis inside of it
            // Translate the bottom axis to the bottom of the page
            // lineChartG.append("g")
            //   .classed("axis", true)
            //   .attr("transform", "translate(0, " + chartH + ")")
            //   .call(bottomAxis);
          });
};
function drawLegend(index){
    var i = 1;
    var legend = lineChartG.append('g')
    .attr("transform", `translate(${chartW-margin.left}, 0)`);
    legend.append("rect")
    .attr("x", 0)
    .attr("y", 0-margin.top*0.8-6)
    .attr("width", 20)
    .attr("height", 20)
    .attr("opacity", ".5")  
    .style("fill", "CornflowerBlue")
    legend  
    .append("text")
    .attr("x", 0 + 20*1.2)
    .attr("y", 0-margin.top*0.8)
    .style("fill", "CornflowerBlue")
    .text('Confirmed Cases')
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    legend.append("rect")
    .attr("x", 0)
    .attr("y", i*25-margin.top*0.8-6)
    .attr("width", 20)
    .attr("height", 20)
    .attr("opacity", ".3")  
    .style("fill", "Orange")
    legend  
    .append("text")
    .attr("x", 0 + 20*1.2)
    .attr("y", i*25-margin.top*0.8)
    .style("fill", "Orange")
    .text('Confirmed Deaths')
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    i++;
    legend.append('line')
    .style("stroke", "red")
    .style("stroke-width", 3)
    .attr("x1", 0)
    .attr("y1", i*25-margin.top*0.8)
    .attr("x2", 20)
    .attr("y2", i*25-margin.top*0.8)
    legend  
    .append("text")
    .attr("x", 0+ 20*1.2 )
    .attr("y", i*25-margin.top*0.8)
    .style("fill", "red")
    .text(index +' index')
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}
drawLegend('DJI')


// // Draw default lines
// draw_virus(data_loc,'Covid-19','Total')

// var year ='2020'
// d3.csv(data_loc+'/stock/'+'DJI'+' '+year+'.csv', function(error, stockData) {
//     var yDJIScale = d3.scaleLinear()
//             .range([chartH, 0])
//             .domain([0, d3.max(stockData, data => data.Price)]);
  
//     var leftAxis = d3.axisLeft(yDJIScale);
          
//     lineChartG.append("g")
//               .classed("axis", true)
//               .call(leftAxis);
//     if (error) throw error;
//     var stocks=['DJI','EU50','SSE'];
//     var colorI=0;
//     stocks.forEach((index)=>{
//         draw_stock(data_loc, index,year,colors[colorI],yDJIScale)
//         colorI++;
//     });
// });
// setupOptions('Covid-19');

  









    
    // // set default axis
    // var currentX = 'poverty';
    // var currentY = 'healthcare';
    // // Data changing functions
    // // use activity 16.3.12 as base
    // // separate options for x and y
    // function setScale(data, chosenAxis,option) {
    //     if (option === 'x'){
    //         var scale = d3.scaleLinear()
    //         .domain([d3.min(data, d => d[chosenAxis]) * 0.8,
    //         d3.max(data, d => d[chosenAxis]) * 1.2
    //         ])
    //         .range([0, chartW]);
    //     }else{
    //         var scale = d3.scaleLinear()
    //         .domain([d3.min(data, d => d[chosenAxis]) * 0.8,
    //         d3.max(data, d => d[chosenAxis]) * 1.2
    //         ])
    //         .range([chartH, 0]);
    //     }        
    //     return scale;
    // }
    // function renderAxes(newScale, Axis, option) {
    //     if (option === 'x'){
    //         var bottomAxis = d3.axisBottom(newScale);
    //         Axis.transition()
    //         .duration(1000)
    //         .call(bottomAxis);
    //     }else{
    //         var leftAxis = d3.axisLeft(newScale);
    //         Axis.transition()
    //         .duration(1000)
    //         .call(leftAxis);
    //     }
    //     return Axis;
    // }
    // function renderCircles(circlesGroup, newScale, chosenAxis, option){
    //     if (option === 'x'){
    //         circlesGroup.transition()
    //             .duration(1000)
    //             .attr("cx", d => newScale(d[chosenAxis]));
    //     }else{
    //         circlesGroup.transition()
    //             .duration(1000)
    //             .attr("cy", d => newScale(d[chosenAxis]));
    //     }
    //     return circlesGroup;
    // }
    // function renderAbbr(abbrGroup, newScale, chosenAxis, option) {
    //     if (option === 'x'){
    //     abbrGroup.transition()
    //         .duration(1000)
    //         .attr("x", d => newScale(d[chosenAxis]));
    //     }else{
    //         abbrGroup.transition()
    //         .duration(1000)
    //         .attr("y", d => newScale(d[chosenAxis]));
    //     }
    //     return abbrGroup;
    // }
    
    // function updateToolTip(x,y, circlesGroup) {
    //     var labelXStart;
    //     var labelXEnd;
    //     var labelY;
    //     if (x == "poverty") {
    //       labelXStart = "Poverty: ";
    //       labelXEnd = '%'
    //     }
    //     else {
    //       labelXStart = "Age: ";
    //       labelXEnd = '';
    //     }
    //     if (y == "healthcare") {
    //         labelY = "Healthcare: ";
    //       }
    //       else {
    //         labelY = "Smokers: ";
    //       }
    //     var toolTip = d3.tip()
    //       .attr("class", "tooltip")
    //       .html(function(d) {
    //         return (`${d.state}<br>${labelXStart+d[currentX]+labelXEnd}<br>
    //         ${labelY} ${d[currentY]}%`);
    //       });
    //     circlesGroup.call(toolTip);
    //     circlesGroup.on("mouseover", function(data) {
    //       toolTip.show(data);
    //     })
    //       // onmouseout event
    //       .on("mouseout", function(data) {
    //         toolTip.hide(data);
    //       });
    //     return circlesGroup;
    //   }

    // // Import csv using d3
    // d3.csv('assets/data/data.csv').then((censusData =>{
    //     // format data
    //     censusData.forEach((row)=>{
    //         row.poverty = +row.poverty;
    //         row.healthcare = +row.healthcare;
    //         row.age = +row.age;
    //         row.smokes = +row.smokes;
    //     });

    //     var xScale = setScale(censusData, currentX,'x');
    //     var yScale = setScale(censusData, currentY,'y');

    //     var bottomAxis =d3.axisBottom(xScale);
    //     var leftAxis =d3.axisLeft(yScale);

    //     var xAxis = scatterChartG.append('g')
    //         .attr("transform", `translate(0, ${chartH})`)
    //         .call(bottomAxis);
    //     var yAxis = scatterChartG.append("g")
    //         .call(leftAxis);
        
    //     var circles = scatterChartG.selectAll("circle")
    //         .data(censusData)
    //         .enter()
    //         .append("circle")
    //         .attr("cx", d => xScale(d[currentX]))
    //         .attr("cy", d => yScale(d[currentY]))
    //         .attr("r", "12")
    //         .attr("fill", "lightblue")
    //         .attr("stroke","black")
    //         .attr("opacity", ".8");
        
    //     // Add state abbreviations to circles
    //     // Had some trouble with data not binding for all states
    //     // So used a forEach function instead
    //     // var statesText = scatterChartG.selectAll('text')
    //     //     .data(censusData)
    //     //     .enter()
    //     //     .append('text')
    //     //     .attr("x", d => xScale(d.poverty))
    //     //     .attr("y", d => yScale(d.healthcare))
    //     //     .attr("font-family", "sans-serif")
    //     //     .attr("font-size", "8px")
    //     //     .attr('text-anchor', 'middle')
    //     //     .attr("fill", "white")
    //     //     .text(d=> d.abbr);
    //     censusData.forEach((row)=>{
    //         scatterChartG.append('text')
    //         .attr("x", xScale(row.poverty))
    //         .attr("y", yScale(row.healthcare)+2)
    //         .attr("font-family", "sans-serif")
    //         .attr("font-size", "8px")
    //         .attr('text-anchor', 'middle')
    //         .attr("fill", "grey")
    //         .classed("stateABBR", true)
    //         .text(row.abbr)
    //     });
    //     abbrGroup = scatterChartG.selectAll('.stateABBR')
    //         .data(censusData);
        
    //     // Create axis labels
    //     var healthLabel = scatterChartG.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (chartH *0.5))
    //     .attr("dy", "1em")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "12px")
    //     .attr("value", "healthcare")
    //     .classed("active clickable", true)
    //     .text("Lacks Healthcare(%)");
        
    //     var smokeLabel = scatterChartG.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left*0.6)
    //     .attr("x", 0 - (chartH *0.5))
    //     .attr("dy", "1em")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "12px")
    //     .attr("value", "smokes")
    //     .classed("inactive clickable", true)
    //     .text("Smokes(%)");

    //     var povertyLabel = scatterChartG.append("text")
    //     .attr("transform", `translate(${chartW / 2+margin.left}, ${chartH + margin.top*0.8})`)
    //     .attr("font-size", "12px")
    //     .attr("value", "poverty")
    //     .classed("active clickable", true)
    //     .text("In Poverty(%)");

    //     var ageLabel = scatterChartG.append("text")
    //     .attr("transform", `translate(${chartW / 2-margin.left}, ${chartH + margin.top*0.8})`)
    //     .attr("font-size", "12px")
    //     .attr("value", "age")
    //     .classed("inactive clickable", true)
    //     .text("Age (median)");
    //     // tooltips
    //     var circles = updateToolTip(currentX, currentY, circles);


    //     // handle click event
    //     scatterChartG.selectAll('.clickable')
    //     .on('click',function(){
    //         var value = d3.select(this).attr("value");
    //         if (value !== currentX | value !== currentY) {
    //             // if click on a x label
    //             // change currentX value and call update functions
    //             if (value === 'poverty' | value === 'age'){
    //                 currentX = value;
    //                 xScale = setScale(censusData, currentX,'x');
    //                 xAxis = renderAxes(xScale, xAxis,'x');
    //                 circles = renderCircles(circles, xScale, currentX,'x');
    //                 abbrGroup = renderAbbr(abbrGroup, xScale, currentX,'x');
    //                 if (currentX === "poverty") {
    //                 povertyLabel
    //                     .classed("active", true)
    //                     .classed("inactive", false);
    //                 ageLabel
    //                     .classed("active", false)
    //                     .classed("inactive", true);
    //                 }
    //                 else {
    //                 povertyLabel
    //                     .classed("active", false)
    //                     .classed("inactive", true);
    //                 ageLabel
    //                     .classed("active", true)
    //                     .classed("inactive", false);
    //                 }
    //             }else{
    //                 currentY = value;
    //                 yScale = setScale(censusData, currentY,'y');
    //                 yAxis = renderAxes(yScale, yAxis,'y');
    //                 circles = renderCircles(circles, yScale, currentY,'y');
    //                 abbrGroup = renderAbbr(abbrGroup, yScale, currentY,'y');
    //                 if (currentY === "healthcare") {
    //                 healthLabel
    //                     .classed("active", true)
    //                     .classed("inactive", false);
    //                 smokeLabel
    //                     .classed("active", false)
    //                     .classed("inactive", true);
    //                 }
    //                 else {
    //                 healthLabel
    //                     .classed("active", false)
    //                     .classed("inactive", true);
    //                 smokeLabel
    //                     .classed("active", true)
    //                     .classed("inactive", false);
    //                 }
    //             }
    //             // update tooltips
    //             circles = updateToolTip(currentX,currentY, circles);
    //           }
    //     });
    // })).catch(function(error) {
    //     console.log(error);
    // });
}

makeResponsive();
d3.select(window).on('resize', makeResponsive);
