d3.queue()
.defer(d3.csv, './static/data/comm-data-Fri.csv')
.defer(d3.csv, './static/data/comm-data-Sat.csv')
.defer(d3.csv, './static/data/comm-data-Sun.csv')
.defer(d3.csv, './static/data/idBehaviorDataFriWithNumDays.csv')
.defer(d3.csv, './static/data/idBehaviorDataSatWithNumDays.csv')
.defer(d3.csv, './static/data/idBehaviorDataSunWithNumDays.csv')
/*
.defer(d3.csv, './static/data/idBehaviorDataFri.csv')
.defer(d3.csv, './static/data/idBehaviorDataSat.csv')
.defer(d3.csv, './static/data/idBehaviorDataSun.csv')
*/
.await(assignVariables);


var linechart, secondLinechart, thirdChart, filteredData;
var dataFri, dataSat, dataSun, clustersBaseFri, clustersBaseSat, clustersBaseSun,
  assignedClustersFri, assignedClustersSat, assignedClustersSun;

function getUncheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesUnchecked = [];
  for (var i=0; i<checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
          checkboxesUnchecked.push(i);
      }
  }
  return checkboxesUnchecked;
}

function assignVariables(error, dFri, dSat, dSun, cFri, cSat, cSun) {
  //Loading original data
  if (error) throw error;
  dataFri = dFri;
  dataSat = dSat;
  dataSun = dSun;
  clustersBaseFri = parseBehaviorDataIntoInt(cFri);
  clustersBaseSat = parseBehaviorDataIntoInt(cSat);
  clustersBaseSun = parseBehaviorDataIntoInt(cSun);
  assignedClustersFri = clusterDataOfDay(clustersBaseFri, 5);
  assignedClustersSat = clusterDataOfDay(clustersBaseSat, 5);
  assignedClustersSun = clusterDataOfDay(clustersBaseSun, 5);
  console.log("Finished loading data");
  draw();
}

function generateIDlistForCluster(whichCluster, whichClusterDay) {
  whichCluster = parseInt(whichCluster);
  whichID = [];
  if (whichClusterDay  === "friday") {
      for (var i = 0; i < assignedClustersFri.length; i++) {
          if (assignedClustersFri[i].cluster === whichCluster) whichID.push(assignedClustersFri[i].id);
      }
  }
  else if (whichClusterDay === "saturday") {
      for (var i = 0; i < assignedClustersSat.length; i++) {
              if (assignedClustersSat[i].cluster === whichCluster) whichID.push(assignedClustersSat[i].id);
          }
  }
  else {
      for (var i = 0; i < assignedClustersSun.length; i++) {
              if (assignedClustersSun[i].cluster === whichCluster) whichID.push(assignedClustersSun[i].id);
          }
  }
  return whichID;
}

function filterByInstruction(filterOn, whichDay) {
    var whichID = [];
    var filterUpTo = document.getElementById('filterByLess').value;
    filterUpTo = parseInt(filterUpTo);
    var filterFrom = document.getElementById('filterByMore').value;
    filterFrom = parseInt(filterFrom);

    var filterFromDay = document.querySelector('input[name="filterFromDay"]:checked').value;
    var clusterBaseForDay;
    if (filterFromDay === "all") {
        //Will result in IDs being in list up to 3 times (O(3n)), fix?
        whichID = fillIDListByInstruction(filterOn, clustersBaseFri, filterFrom, filterUpTo);
        whichID = concatUnique(whichID, fillIDListByInstruction(filterOn, clustersBaseSat, filterFrom, filterUpTo));
        whichID = concatUnique(whichID, fillIDListByInstruction(filterOn, clustersBaseSun, filterFrom, filterUpTo));
    }
    else {
        if (whichDay === "friday") whichID = fillIDListByInstruction(filterOn, clustersBaseFri, filterFrom, filterUpTo);
        else if (whichDay === "saturday") whichID = fillIDListByInstruction(filterOn, clustersBaseSat, filterFrom, filterUpTo);
        else whichID = fillIDListByInstruction(filterOn, clustersBaseSun, filterFrom, filterUpTo);
    }
    return whichID;
}

function fillIDListByInstruction(filterOn, clusterBaseForDay, filterFrom, filterUpTo) {
    var whichID = [];
    if (filterUpTo == 0) filterUpTo = Math.pow(10, 1000);
    for (var i = 0; i < clusterBaseForDay.length; i++) {
        if (clusterBaseForDay[i][filterOn] < filterUpTo && clusterBaseForDay[i][filterOn] > filterFrom ) {
          whichID.push(clusterBaseForDay[i].id);
        }
    }
    return whichID;
}

function concatUnique(list1, list2) {
    for (var i = 0; i < list2.length; i++) {
        if (! list1.includes(list2[i])) list1.push(list2[i]);
    }
    return list1;
}

function draw(){
  d3.selectAll("svg > *").remove();
  var whichDay = document.querySelector('input[name="day"]:checked').value;
  var whichClusterDay = document.querySelector('input[name="clusterFromDay"]:checked').value;
  var whichID = document.getElementById('idOfPerson').value;
  var whichAreas = getUncheckedBoxes("areas");
  var whichCluster = document.getElementById('numCluster').value;
  var filterOn = document.getElementById('filterOn').value;

  if (whichCluster !== "all") {
      whichID = generateIDlistForCluster(whichCluster, whichClusterDay);
      console.log("Showing info for cluster " + whichCluster);
  }

  if (filterOn != "none") {
      whichID = filterByInstruction(filterOn, whichDay);
  }

  console.log("Showing graph for ID:s");
  console.log(whichID);

  exportIDs(whichID);

  var numIDs;
  if (typeof whichID === 'string' || whichID instanceof String) {
      if (whichID === "all") numIDs = "all";
      else numIDs = 1;
  }
  else numIDs = whichID.length;

  document.getElementById("numIDsInfoHolder").innerHTML = "Currently displaying " + numIDs + " IDs."; 

  if (whichDay === "friday") {
      linechart = createLinechart(dataFri, whichID, whichAreas, "mainLineChart");
      secondLinechart = createLinechart(dataSat, whichID, whichAreas, "secondaryLineChart");
      thirdChart = createLinechart(dataSun, whichID, whichAreas, "thirdLineChart");
  }
  else if (whichDay === "saturday") {
      linechart = createLinechart(dataSat, whichID, whichAreas, "mainLineChart");
      secondLinechart = createLinechart(dataFri, whichID, whichAreas, "secondaryLineChart");
      thirdChart = createLinechart(dataSun, whichID, whichAreas, "thirdLineChart");
  }
  else {
      linechart = createLinechart(dataSun, whichID, whichAreas, "mainLineChart");
      secondLinechart = createLinechart(dataFri, whichID, whichAreas, "secondaryLineChart");
      thirdChart = createLinechart(dataSat, whichID, whichAreas, "thirdLineChart");
  }
  setCorrectHeaders(whichDay);
}

function setCorrectHeaders(dayOfMainChart) {
  if (dayOfMainChart === "friday") {
    document.getElementById("mainLineChartTitle").innerHTML = "Friday";
    document.getElementById("secondaryLineChartTitle").innerHTML = "Saturday";
    document.getElementById("thirdLineChartTitle").innerHTML = "Sunday";
  }
  else if (dayOfMainChart === "saturday") {
    document.getElementById("mainLineChartTitle").innerHTML = "Saturday";
    document.getElementById("secondaryLineChartTitle").innerHTML = "Friday";
    document.getElementById("thirdLineChartTitle").innerHTML = "Sunday";
  }
  else {
    document.getElementById("mainLineChartTitle").innerHTML = "Sunday";
    document.getElementById("secondaryLineChartTitle").innerHTML = "Friday";
    document.getElementById("thirdLineChartTitle").innerHTML = "Saturday";
  }
}

function assignClusters() {
  var whichDay = document.querySelector('input[name="clusterDay"]:checked').value;
  var k = parseInt(document.getElementById('numClusters').value);

  var transformedData;
  if (whichDay === "friday") { 
      assignedClustersFri = clusterDataOfDay(clustersBaseFri, k);
      document.getElementById("numClustersFri").innerHTML = k;
  }
  else if (whichDay === "saturday") {
      assignedClustersSat = clusterDataOfDay(clustersBaseSat, k);
      document.getElementById("numClustersSat").innerHTML = k;

  }
  else {
      assignedClustersSun = clusterDataOfDay(clustersBaseSun, k);
      document.getElementById("numClustersSun").innerHTML = k;

  }
}

function parseBehaviorDataIntoInt(data) {
  data.forEach(function(d) {
      d.numSentMsg = +d.numSentMsg;
      d.numUniqueRec = +d.numUniqueRec;
      d.meanMinutesSinceLastMsg = +d.meanMinutesSinceLastMsg;
      d.numActiveInInterval = +d.numActiveInInterval;
      d.numVisitedLocations = +d.numVisitedLocations;
      d.numTraversedBetweenLocations = +d.numTraversedBetweenLocations;
      d.numVisitedDays = +d.numVisitedDays;
  });
  return data;
}

function exportIDs(whichIDs) {
    var lineArray = [];
    for (var index = 0; index < whichIDs.length; index++) {
        var line = whichIDs[index];
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    }
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent);
}

function makeDownloadLink(csvContent, whichDay) {
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filteredIDs.csv");
    link.innerHTML= "Click here to download current ID list";
    document.getElementById("downloadLinkHolder").innerHTML = "";
    document.getElementById("downloadLinkHolder").appendChild(link); 
    //link.click();
}
