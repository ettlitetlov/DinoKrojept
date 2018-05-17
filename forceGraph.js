function forceGraph(data) {

    this.data = data;

    function update(startVal)
    {
        let allComms = [];
        let allToComms = [];
        let links = {};
        let unique = [];
        let listOfLinks = [];
        let locations = [];
        let start = startVal;
    
        let num = 2000;
    
        // Fetching necessary data and storing it in local variables
        data.forEach(function(d) {
        allComms.push(parseInt(d.from));
        allToComms.push(parseInt(d.to));
        locations.push(d.location)
        })
    
        document.getElementById("slider").min = data[0].Timestamp;
    
        // Just taking a limited number of the dataset, to improve perfomance and interactability
        for(var i = start; i < num; i++){
        if(unique.indexOf(allComms[i]) === -1){
            unique.push(allComms[i]);
        }
        if(unique.indexOf(allToComms[i]) === -1) {
            unique.push(allToComms[i]);
        }
        }
    
        // Initializing a JSON-formatted object with an array of all communcation sources to target.
        for(var k = 0; k < num; k++){
        let tinyObj2 = {};
        tinyObj2.source = allComms[k];
        tinyObj2.target = allToComms[k];
        tinyObj2.value = 1;
        tinyObj2.location = locations[k];
        listOfLinks.push(tinyObj2);
        }
        
        let listOfGroups = [];
        let j = 0;
        unique.forEach( function(element) {
        let tinyObj = {};
        tinyObj.id = element;
        tinyObj.group = j;
        j++;
        listOfGroups.push(tinyObj);
        })
        listOfGroups.push({"id": "0", "group": 2950});
        uniqObj = listOfGroups;
        
        var link = svg.append("g")
            .attr("class", "links")
        .selectAll("line")
        .data(listOfLinks)
        .enter().append("line")
            .attr("stroke-width", function(d) { return d.value;});
    
        console.log("Done with the links!");
        var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(uniqObj)
        .enter().append("circle")
            .attr("r", 5)
            .style("stroke", "gray")
            .style("stroke-width", "0.5px")
            .attr("fill", function(d) { return colors[getColorIndex(d.id, listOfLinks)];})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)); 
    
        console.log("Done with the nodes!");
        node.append("title")
            .text(function(d) { return d.id; });
    
        simulation
            .nodes(uniqObj)
            .on("tick", ticked);
    
        simulation.force("link")
            .links(listOfLinks);
    
        function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }
    }
    

    this.updateForceGraph = function() {
        var someVal = Math.floor(((data.length / document.getElementById("slider").value) - 1000) );
        console.log("Updating data with start value of: " + someVal);
        update(someVal);
    }

    update(0);
}