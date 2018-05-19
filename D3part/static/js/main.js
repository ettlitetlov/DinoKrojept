d3.queue()
.defer(d3.csv, './static/data/comm-data-Fri.csv')
.defer(d3.csv, './static/data/comm-data-Sat.csv')
.defer(d3.csv, './static/data/comm-data-Sun.csv')
.defer(d3.csv, './static/data/idBehaviorDataFri.csv')
.defer(d3.csv, './static/data/idBehaviorDataSat.csv')
.defer(d3.csv, './static/data/idBehaviorDataSun.csv')
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
  draw("friday", "all");
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

function draw(){
  d3.selectAll("svg > *").remove();
  var whichDay = document.querySelector('input[name="day"]:checked').value;
  var whichClusterDay = document.querySelector('input[name="clusterFromDay"]:checked').value;
  var whichID = document.getElementById('idOfPerson').value;
  var whichAreas = getUncheckedBoxes("areas");
  var whichCluster = document.getElementById('numCluster').value;
  console.log("Showing info for cluster " + whichCluster);

  if (whichCluster !== "all") {
      whichID = generateIDlistForCluster(whichCluster, whichClusterDay);
  }
  console.log("Showing graph for ID:s");
  console.log(whichID);
  //filterdata(dataSun);

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
  });
  return data;
}
