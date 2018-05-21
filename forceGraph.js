function forceGraph(data) {

    this.data = data;
    var listToSend = [];
    let allComms = [];
    let allToComms = [];
    let locations = [];

    var svg = d3.select("svg"),
    margin = {right: 50, left: 50}, 
    width = +svg.attr("width"),
    height = +svg.attr("height");

    svg = d3.select("svg")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")

    data.forEach(function(d) {
        allComms.push(parseInt(d.from));
        allToComms.push(parseInt(d.to));
        locations.push(d.location)
    })

    update(0, -1);

    function update(startVal, filteredID)
    {
        const minVal = Math.min(data.length-1,startVal+Math.floor((data.length / 200))); 
        document.getElementById("output").value = data[Math.max(Math.floor(((data.length / 200) * (document.getElementById("slider").value))) -1,0)].Timestamp + " -> " + data[minVal].Timestamp;
        svg.selectAll("*").remove();

        let filteredIds = filteredID;

        let links = {};
        let unique = [];
        let listOfLinks = [];
        let start = Math.floor(startVal);
        let num;

        if(filteredID < 0)
            num = data.length/200;
        else
            num = data.length;
    
    
        // Just taking a limited number of the dataset, to improve perfomance and interactability
        if(filteredID < 0) {
            for(var i = start; i < Math.min(data.length,(start +num)); i++){
                if(unique.indexOf(allComms[i]) === -1){
                    unique.push(allComms[i]);
                }
                if(unique.indexOf(allToComms[i]) === -1) {
                    unique.push(allToComms[i]);
                }
            }
        }
        else {
            for(var i = 0; i < num; i++){
                if(filteredIds.indexOf(allComms[i]) != -1 && unique.indexOf(allToComms[i]) === -1){
                    unique.push(allToComms[i]);
                }
                if(filteredIds.indexOf(allToComms[i]) != -1 && unique.indexOf(allComms[i]) === -1) {
                    unique.push(allComms[i]);
                }
            }
            for(var i = 0; i < filteredIds.length; i++){
                if(unique.indexOf(filteredIds[i]) === -1)
                    unique.push(filteredIds[i]);
            }
            console.log(unique);
        } 

        // Initializing a JSON-formatted object with an array of all communcation sources to target.
        if(filteredID < 0){
            for(var k = start; k < Math.min(data.length,(start +num)); k++){
                let tinyObj2 = {};
                tinyObj2.source = allComms[k];
                tinyObj2.target = allToComms[k];
                tinyObj2.value = 1;
                tinyObj2.location = locations[k];
                listOfLinks.push(tinyObj2);
            }
        }
        else{
            for(var k = 0; k < num; k++){
                if(filteredIds.indexOf(allComms[k]) != -1){
                    let tinyObj2 = {};
                    tinyObj2.source = allComms[k];
                    tinyObj2.target = allToComms[k];
                    tinyObj2.value = 1;
                    tinyObj2.location = locations[k];
                    listOfLinks.push(tinyObj2);
                }

                if(filteredIds.indexOf(allToComms[k]) != -1){
                    let tinyObj2 = {};
                    tinyObj2.source = allComms[k];
                    tinyObj2.target = allToComms[k];
                    tinyObj2.value = 1;
                    tinyObj2.location = locations[k];
                    listOfLinks.push(tinyObj2);
                }
            }
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
        console.log(listOfGroups);
        uniqObj = listOfGroups;
        
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(listOfLinks)
            .enter().append("line")
            .attr("stroke-width", function(d) { return d.value;});
    

        var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(uniqObj)
        .enter().append("circle")
            .attr("r", 5)
            .style("stroke", "gray")
            .style("stroke-width", "0.5px")
            .attr("fill", function(d) { if(listToSend.indexOf(d.id) != -1){return "blue";}else return colors[getColorIndex(d.id, listOfLinks)];})
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .on("click", arrayBuilder)

        
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

        function arrayBuilder(id){

            if(listToSend.indexOf(id.id) == -1){
                listToSend.push(id.id);
                d3.select(this).style("fill", "blue");
            }
            else{
                listToSend.splice(listToSend.indexOf(id.id),1);
                d3.select(this).style("fill", function(d) {return colors[getColorIndex(id, listOfLinks)]});
            }
            console.log(listToSend);
        }

    }
    
    this.updateForceGraph = function() {
        var someVal = Math.floor(((data.length / 200) * document.getElementById("slider").value));
        update(someVal, -1);
    }
    this.filterForceData = function() {
        console.log("Starting filtering.")
        console.log(parseInt(document.getElementById("typeValue").value));
        if(document.getElementById("typeValue").value)
            listToSend.push(parseInt(document.getElementById("typeValue").value));
        update(0, listToSend);
        document.getElementById("output").value = "Displaying commdata from: " + listToSend;
    }




}