// Responsive interactive d3 line plot script
// from plotting various virus against stock market indexes
// By Chris Chiang

// A color generator that switch between a few colors 
var colorGen = 0;
var colors= ['blue','red','green','orange','darkred','pink','grey','purple'];
function newColor(){
    if (colorGen <7){
        colorGen++;
    }else{
        colorGen=0
    }
    return colors[colorGen];
}
// redraw each time window size changes
function makeResponsive(){
    var initSvg = d3.select('#stock').selectAll('svg');
    if (!initSvg.empty()) {
        initSvg.remove();
    }
    // Setting SVG parameters
    var svgHeight = window.innerHeight*0.6;
    var svgWidth = window.innerWidth*0.6;

    // margins
    var margin = {
        top: svgHeight/15,
        right: svgWidth/7,
        bottom: svgHeight/10,
        left: svgWidth/7
    };
    var chartH = svgHeight - margin.top - margin.bottom;
    var chartW = svgWidth - margin.right - margin.left;

    var chartSvg = d3.select('#stock')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);
    
    var lineChartG = chartSvg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //  create clickable virus labels
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
    var data_loc = './static/data/'
    var curVirus ='Covid-19';
    var curCountry ='Total';
    var curIndex = 'DJI';

    // function to return different d3 scale base on options
    function setScale(data, col_name,option) {
        if (option === 'x'){
            var scale = d3.scaleTime()
            .domain(d3.extent(data, d => d.Date))
            .range([0, chartW]);
        }else if (option === 'right'){
            var scale = d3.scaleLinear()
            .domain([0,d3.max(data, d => d[col_name])])
            .range([chartH, 0]);
        }else{
            var scale = d3.scaleLinear()
            .domain([d3.min(data, d => d.Price)*0.8, d3.max(data, d => d.Price)*1.2])
            .range([chartH, 0]);

        }       
        return scale;
    }
    // render new axis base on options
    function renderAxes(newScale, Axis, option) {
        if (option === 'x'){
            var bottomAxis = d3.axisBottom(newScale);
            Axis.transition()
            .duration(1000)
            .call(bottomAxis);
        }else if(option ==='left'){
            var leftAxis = d3.axisLeft(newScale);
            Axis.transition()
            .duration(1000)
            .call(leftAxis);
        }else{
            var rightAxis = d3.axisRight(newScale);
            Axis.transition()
            .duration(1000)
            .call(rightAxis);
        }
        return Axis;
    }
    // draw legend function
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
        var line = legend.append('line')
        .style("stroke", colors[colorGen])
        .style("stroke-width", 3)
        .attr("x1", 0)
        .attr("y1", i*25-margin.top*0.8)
        .attr("x2", 20)
        .attr("y2", i*25-margin.top*0.8)
        var lineLab = legend  
        .append("text")
        .attr("x", 0+ 20*1.2 )
        .attr("y", i*25-margin.top*0.8)
        .style("fill", colors[colorGen])
        .text(index +' index')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        return [line,lineLab]
    }

    // function to draw new stock index
    function draw_stock(path, index, year, legend,yAxis){
        d3.csv(path+'/stock/'+index+' '+year+'.csv', function(error, stockData) {
            if (error) throw error;
                stockData.forEach(function(data) {
                  data.Date = d3.isoParse(data.Date);
                  data.Price = +data.Price;
                });
                var xScale = setScale(stockData,'Date','x')
                var yScale = setScale(stockData,'Price','left');
                var drawLine = d3
                  .line()
                  .x(data => xScale(data.Date))
                  .y(data => yScale(data.Price));
                lineChartG.selectAll('.stockLine').remove()
                lineChartG.append("path")
                  .attr("d", drawLine(stockData))
                  .classed("stockLine", true)
                  .attr("opacity", ".8")
                  .attr("fill", "none")
                  .attr("stroke", newColor())
                  .attr("stroke-width", 3);
                legend[0].style("stroke", colors[colorGen]);
                legend[1].style("stroke", colors[colorGen]);
                legend[1].text(index);
                renderAxes(yScale,yAxis,'left');
                
              });
    };
    


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
                countries.push('USA');
                break;
            case 'SARS':
                year ='2003'
                indexes.push('HSI')
                indexes.push('DAX')
                countries.push('USA');
                countries.push('China');
                countries.push('Hong Kong');
                break;
        }
    
        // Create axis labels
        var old_labels = d3.selectAll('.clickableC');
        // remove old labels
        if (!old_labels.empty()){
            old_labels.data(countries).enter()
            .append('text')
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("y", function(d,i){
                return i*90})
            .attr("x", 0- margin.left/2 )
            .classed("clickableC countryLabel", true)
            .merge(old_labels)
            .attr("value", function(d){
                if (d=='World Total'){
                    return 'Total';
                }else if (d=='USA'){
                    return 'United States of America';
                }else{
                    return d;
                }
            })
            .text(function(data){
                return data;
            }).exit().remove();

            old_labels = d3.selectAll('.clickableI');
            old_labels.data(indexes).enter()
            .append('text')
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("y", function(d,i){
                return i*90})
            .attr("x", 0- margin.left/2 )
            .classed("clickableI indexLabel", true)
            .merge(old_labels)
            .text(function(data){
                return data;
            }).attr("value", function(d){
                return d;
            })
            .exit().remove();
            d3.selectAll('.clickableC').classed('active',false);
            d3.selectAll('.clickableC').classed('inactive',true);
            d3.select('.clickableC').classed('active',true);
            d3.select('.clickableC').classed('inactive',false);
            d3.selectAll('.clickableI').classed('active',false);
            d3.selectAll('.clickableI').classed('inactive',true);
            d3.select('.clickableI').classed('active',true);
            d3.select('.clickableI').classed('inactive',false);
        }else{
            var countryGroup = lineChartG.append('g')
            .classed('countryLabels', true)
            .attr("transform", `translate(${chartW+margin.left/10}, ${chartH/6})`);
            
    
            var indexGroup = lineChartG.append('g')
            .classed('indexLabels', true)
            .attr("transform", `translate(0, ${chartH/6})`);
    
                
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
                .classed(ac+ " clickableI indexLabel", true)
                .text(ind);
                i++;
            });
            i=1;
            countryGroup.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("y", 0)
            .attr("x", 0+ margin.left/7)
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
                .attr("font-size", "12px")
                .attr("value", labValue)
                .attr("y", i*90)
                .attr("x", 0 + margin.left*0.4)
                .classed(ac+" clickableC countryLabel", true)
                .text(coun);
                i++;
            });
        }
    
    
    
        
    
        // X label
            d3.selectAll('.x_label').remove();
            var x_label = lineChartG.append("text")
            .classed('x_label',true)
            .attr("transform", `translate(${chartW / 2-margin.left*0.7}, ${chartH + margin.top*0.7})`)
            .attr("font-size", "16px")
            .attr('fill','olive')
            .text('Date in '+year);
    
    }
    function virusSelector(virus){
        var file_name;
        var case_col;
        var death_col;
        var country_col;
        var year;
        switch (virus){
            case 'Covid-19':
                file_name = 'covid_daily_world.csv';
                case_col='Confirmed';
                death_col='Deaths';
                country_col = 'Country/Region';
                year='2020';
                break;
            case 'Ebola':
                file_name = 'updated_ebola.csv';
                country_col = 'Country';
                case_col='No. of confirmed cases';
                death_col='No. of confirmed deaths';
                year='2014';
                break;
            case 'SARS':
                country_col = 'Country';
                file_name = 'SARS_data.csv';
                case_col='Cases';
                death_col='Deaths';
                year='2003';
                break;
        }
        return [file_name, case_col, death_col, country_col,year];
    }


    // init line graph
    // load covid data
    d3.csv(data_loc+'covid_daily_world.csv', function(error, virusData) {
        if (error) throw error;
        var curCountry ='Total'
        var virusAttr =virusSelector('Covid-19');
        var file_name = virusAttr[0] ;
        var case_col  = virusAttr[1] ;
        var death_col  = virusAttr[2] ;
        var country_col = virusAttr[3] ;
        var curYear  = virusAttr[4] ;
        setupOptions('Covid-19');
        // format data
            var just_one_country =[];
            virusData.forEach(function(row) {
              if (row[country_col]==curCountry){
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
              .classed("caseArea", true)
              .attr("opacity", ".5")
              .attr("fill", "CornflowerBlue")
              .attr("stroke", "grey")
              .attr("stroke-width", 3);
            var deathArea = lineChartG.append("path")
              .attr("d", drawDeath(just_one_country))
              .classed("caseArea", true)
              .attr("opacity", ".3")
              .attr("fill", "Orange")
              .attr("stroke", "grey")
              .attr("stroke-width", 3);
          
            var rYAxis = lineChartG.append("g")
              .classed("axis", true)
              .attr("transform", "translate(" + chartW + ", 0)")
              .call(rightAxis);

          
         
            var xAxis = lineChartG.append("g")
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
                                .domain([d3.min(stockData, data => data.Price)*0.8, d3.max(stockData, data => data.Price)*1.2]);
                      
                    var leftAxis = d3.axisLeft(yLeftScale);
                            
                    var lYAxis = lineChartG.append("g")
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
                      .attr("stroke", newColor())
                      .attr("stroke-width", 3);
                      
                    var curLegend = drawLegend('DJI');
                  
                    // handle index clicks
                      lineChartG.selectAll('.indexLabel')
                      .on('click',function(){
                          var value = d3.select(this).attr("value");
                          if (value !== curIndex) {
                                curIndex = value;
                                  d3.selectAll('.indexLabel').classed("inactive", true);
                                  d3.selectAll('.indexLabel').classed("active", false);
                                  d3.select(this).classed("active", true)
                                  d3.select(this).classed("inactive", false)
                                  draw_stock(data_loc,curIndex,curYear,curLegend,lYAxis)
                              }
                              // update tooltips
                            //   circles = updateToolTip(currentX,currentY, circles);
                      });
                    //   handle country change
                      lineChartG.selectAll('.countryLabel')
                      .on('click',function(){
                          var value = d3.select(this).attr("value");
                          if (value !== curCountry) {
                                curCountry = value;
                                  d3.selectAll('.countryLabel').classed("inactive", true);
                                  d3.selectAll('.countryLabel').classed("active", false);
                                  d3.select(this).classed("active", true)
                                  d3.select(this).classed("inactive", false)
                                  update_virus(data_loc,curVirus,curCountry,xAxis,rYAxis,false)
                              }
                              // update tooltips
                            //   circles = updateToolTip(currentX,currentY, circles);
                      });

                      //   handle country change
                      lineChartG.selectAll('.virusLabel')
                      .on('click',function(){
                          var value = d3.select(this).attr("value");
                          if (value !== curVirus) {
                                curVirus = value;
                                curIndex = 'DJI';
                                curCountry = 'Total'
                                curYear = virusSelector(curVirus)[4];
                                  d3.selectAll('.virusLabel').classed("inactive", true);
                                  d3.selectAll('.virusLabel').classed("active", false);
                                  d3.select(this).classed("active", true)
                                  d3.select(this).classed("inactive", false)
                                  update_virus(data_loc,curVirus,'Total',xAxis,rYAxis,true)
                                  draw_stock(data_loc,'DJI',curYear,curLegend,lYAxis)
                                  setupOptions(curVirus);

                              }
                              // update tooltips
                            //   circles = updateToolTip(currentX,currentY, circles);
                      });



                  });


          });

    function update_virus(path,virus,country,xAxis,yAxis,newVirus){
        var virusAttr =virusSelector(virus);
        var file_name = virusAttr[0] ;
        var case_col  = virusAttr[1] ;
        var death_col  = virusAttr[2] ;
        var country_col = virusAttr[3] ;
        var year  = virusAttr[4] ;
        d3.csv(path+file_name, function(error, virusData) {
            if (error) throw error;

                var just_one_country =[];
                virusData.forEach(function(row) {
                  if (row[country_col]==country){
                    row.Date = d3.isoParse(row.Date);
                    row[case_col] = +row[case_col];
                    row[death_col] = +row[death_col];
                    just_one_country.push(row);
                  }
                  
                });
                d3.selectAll('.caseArea').remove()
                var xTimeScale = setScale(just_one_country,'Date','x');
                var yLinearScale = setScale(just_one_country,case_col,'right')
              
                
                var bottomAxis = renderAxes(xTimeScale,xAxis,'x');
                var rightAxis = renderAxes(yLinearScale,yAxis,'right');
                
                              
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
              
                lineChartG.append("path")
                  .attr("d", drawConfirm(just_one_country))
                  .classed("caseArea", true)
                  .attr("opacity", ".5")
                  .attr("fill", "CornflowerBlue")
                  .attr("stroke", "grey")
                  .attr("stroke-width", 3);
                lineChartG.append("path")
                  .attr("d", drawDeath(just_one_country))
                  .classed("caseArea", true)
                  .attr("opacity", ".3")
                  .attr("fill", "Orange")
                  .attr("stroke", "grey")
                  .attr("stroke-width", 3);
                  
              });
    };


}

makeResponsive();
d3.select(window).on('resize', makeResponsive);
