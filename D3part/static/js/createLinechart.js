Array.prototype.multisplice = function(args){
    //requires incoming args to be in order
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        this.splice(index, 1);
    }        
}

function createLinechart(inputData, whichID, whichAreas, whichSvg, yScaling) {
    var data;
    if (whichID === "all" || whichID === "") {
        data = transformDataForStackedAreaChart(inputData);
    }
    else {
        if (typeof whichID === 'string' || whichID instanceof String) whichID = [whichID];
        else whichID.sort();
        data = extractDataForID(inputData, whichID);
    }

    //https://bl.ocks.org/mbostock/3884955
    var svg = d3.select("#"+whichSvg),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%H:%M");

    var x = d3.scaleTime().rangeRound([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);
    
    var line = d3.line()
       // .curve(d3.curveBasis)
        //.x(function(d, i) {return x(i);})
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.numMessages); });

    var areas = d3.keys(data[0]).map(function(id) {
        return {
        id: id,
        values: data.map(function(d) {
            return {time: parseTime(d.time), numMessages: d[id]};
        })
        };
    });

    areas.splice(0, 1);
    areas.multisplice(whichAreas);

    x.domain(d3.extent(data, function(d) { return parseTime(d.time); }));

    y.domain([
        d3.min(areas, function(c) { return d3.min(c.values, function(d) { return d.numMessages; }); }),
        d3.max(areas, function(c) { return Math.max(yScaling, d3.max(c.values, function(d) { return d.numMessages; })); })
    ]);

    z.domain(areas.map(function(c) { return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
         .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("numMessages");

    var area = g.selectAll(".area")
        .data(areas)
        .enter().append("g")
        .attr("class", "area");

    area.append("path")
        .attr("class", "line")
        //.attr("d", line);
        //.attr("data-legend",function(d) { return d.id})
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); })
        .style("fill", "none");

    if (whichSvg === "mainLineChart") {
        //Add beautiful legend
        var legend_keys =  d3.keys(data[0]);
        legend_keys.splice(0,1);
        legend_keys.multisplice(whichAreas);

        var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
            .enter().append("g")
            .attr("class","lineLegend")
            .attr("transform", function (d,i) {
                    return "translate(" + width + "," + (i*20)+")";
                });
        
        lineLegend.append("text").text(function (d) {return d;})
            .attr("transform", "translate(15,9)"); //align texts with boxes
        
        lineLegend.append("rect")
            .attr("fill", function (d, i) {return z(d); })
            .attr("width", 10).attr("height", 10);
    }

  }
