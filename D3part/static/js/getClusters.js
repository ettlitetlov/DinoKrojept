var k;
function loadDataForClustering(whichDay, inK) {
    k = inK;
    var inputFile;
    if (whichDay === "friday")
        inputFile = './static/data/idBehaviorDataFri.csv';
    else if (whichDay === "saturday")
        inputFile = './static/data/idBehaviorDataSat.csv';
    else 
        inputFile = './static/data/idBehaviorDataSun.csv';
    d3.queue()
        .defer(d3.csv, inputFile)
        .await(assignVariables);
}

function assignVariables(error, data) {
    if (error) throw error;
    var transformedData = parseBehaviorDataIntoInt(data);
    console.log("Finished loading data for clustering");
    var clusterAssignments = clusterDataOfDay(transformedData, k);
    return clusterAssignments;
}

function parseBehaviorDataIntoInt(data) {
    data.forEach(function(d) {
        d.numSentMsg = +d.numSentMsg;
        d.numUniqueRec = +d.numUniqueRec;
        d.meanMinutesSinceLastMsg = +d.meanMinutesSinceLastMsg;
        d.numActiveInInterval = +d.numActiveInInterval;
        d.numVisitedLocations = +d.numVisitedLocations;
        d.numTraversedBetweenLocations = +d.numTraversedBetweenLocations;
    });
    return data;
}