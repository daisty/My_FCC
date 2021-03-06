$().ready(function() {
    let dataGDP = [];
    let dataTime = [];
    
    let chartMargin = {
        top: 15,
        right: 10,
        bottom: 30,
        left: 75
    };
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let width = $(".chart").width() - chartMargin.left - chartMargin.right;
    let height = $(".chart").height() - chartMargin.bottom - chartMargin.top;
    $.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(result) {
        $.each(result.data, function(i, content) {
            dataGDP.push(content[1]);
            dataTime.push(content[0]);
        })

        let xScale = d3.time.scale()
                        .domain([new Date(dataTime[0]), new Date(dataTime[dataTime.length - 1])])
                        .range([0, width]);
        let xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(d3.time.years, 5);
                        
        let yScale = d3.scale.linear()
                        .domain([0, d3.max(dataGDP)])
                        .range([height, 0]);
        let yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(10, "");
        
        let svg = d3.select("body")
                    .select(".chart");
            
        svg.append("g")
            .attr("class", "axis")
            .attr("transform","translate(" + chartMargin.left + "," + (chartMargin.top + height) + ")")
            .call(xAxis)
            
        svg.append("g")
            .attr("class", "axis")
            .attr("transform","translate(" + chartMargin.left + "," + chartMargin.top + ")")
            .call(yAxis)
            
        let reminderCard = d3.select(".card")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);    
            
        let rects = svg.selectAll(".MyRect")
            .data(result.data)
            .enter()
            .append("rect").attr("class","MyRect")
            .attr("transform","translate(" + chartMargin.left + "," + chartMargin.top + ")")
            .attr("x", function(d, i){
                return xScale(new Date(d[0]));
            } )
            .attr("y",function(d){
                return yScale(d[1]);
            })
            .attr("width", Math.ceil(width / result.data.length))
            .attr("height", function(d){
                return height - yScale(d[1]);
            })
            .attr("fill","steelblue")
            .on("mouseover", function(d) {
                let rect = d3.select(this);
                rect.attr("fill", "lightsteelblue");
                let currentDateTime = new Date(d[0]);
                let year = currentDateTime.getFullYear();
                let month = months[currentDateTime.getMonth()];
                let dollars = d[1];
                reminderCard.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                reminderCard.html("<span class='amount'>" + dollars + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + month + "</span>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
            })
            .on("mouseout", function() {
                let rect = d3.select(this);
                rect.attr("fill", "steelblue");
                reminderCard.transition()
                  .duration(500)
                  .style("opacity", 0);
            });
    })
    
});