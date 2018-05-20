function filterdata(inDataFri, inDataSat, inDataSun) {
    //var data = transformDataForStackedAreaChart(inData);
    //var data2 = extractInterestingData(inData);
    //var data2 = extractEventData(inData);
    //exportInterestingData(data2);
    //var data = extractDataForID(inData, "839736");
    var behaviorDataFri = extractIDBehavior(inDataFri);
    console.log("done with basic behavior for fri");

    var behaviorDataSat = extractIDBehavior(inDataSat);
    console.log("done with basic behavior for sat");

    var behaviorDataSun = extractIDBehavior(inDataSun);
    console.log("done with basic behavior for all days");

    addNumDaysVisitedToBehaviorDataAndExport(behaviorDataFri, behaviorDataSat, behaviorDataSun);
    //exportStackedAreaData(data);
    return data;
}

function clusterDataOfDay(data, k) {
    var dataForKMeans = generateKMeansData(data);
    var kResult = kmeans(dataForKMeans, k);
    var idsAndClusters = [];
    var clusterValues = generateClusterValuesBase(k);
    for (var i = 0; i < data.length; i++) {
        var assignedCluster = kResult.assignments[i];
        idsAndClusters.push({id: data[i].id, cluster: assignedCluster});
        clusterValues[assignedCluster].meanNumSentMsg += data[i].numSentMsg;
        clusterValues[assignedCluster].meanNumUniqueRec += data[i].numUniqueRec;
        clusterValues[assignedCluster].meanMeanMinutesSinceLastMsg += data[i].meanMinutesSinceLastMsg;
        clusterValues[assignedCluster].meanNumActiveInInterval += data[i].numActiveInInterval;
        clusterValues[assignedCluster].meanNumVisitedLocations += data[i].numVisitedLocations;
        clusterValues[assignedCluster].meanNumTraversedBetweenLocations += data[i].numTraversedBetweenLocations;
        clusterValues[assignedCluster].clusterSize += 1;
    }
    clusterValues = calculateMeansInClusterValues(clusterValues);
    console.log("Clusters look like this:");
    console.log(clusterValues);
    return idsAndClusters;
    //exportClusterData(idsAndClusters);
} 

function generateKMeansData(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
            var numSentMsg = data[i].numSentMsg;
            var numUniqueRec = data[i].numUniqueRec;
            var meanMinutesSinceLastMsg = data[i].meanMinutesSinceLastMsg;
            var numActiveInInterval = data[i].numActiveInInterval;
            var numVisitedLocations = data[i].numVisitedLocations;
            var numTraversedBetweenLocations = data[i].numTraversedBetweenLocations;
            result.push({numSentMsg, numUniqueRec, meanMinutesSinceLastMsg, numActiveInInterval, numVisitedLocations, numTraversedBetweenLocations});
    }
    return result;
}

function generateClusterValuesBase(k) {
    var clusterValues = [];
    for (var i = 0; i < k; i++) clusterValues.push(
        {cluster: i,
        meanNumSentMsg: 0,
        meanNumUniqueRec: 0,
        meanMeanMinutesSinceLastMsg: 0,
        meanNumActiveInInterval: 0,
        meanNumVisitedLocations: 0,
        meanNumTraversedBetweenLocations: 0,
        clusterSize: 0 });
    return clusterValues;
}

function calculateMeansInClusterValues(clusterValues) {
    var k = clusterValues.length;
    for (var i = 0; i < k; i++) {
        clusterValues[i].meanNumSentMsg /= clusterValues[i].clusterSize;
        clusterValues[i].meanNumUniqueRec /= clusterValues[i].clusterSize;
        clusterValues[i].meanMeanMinutesSinceLastMsg /= clusterValues[i].clusterSize;
        clusterValues[i].meanNumActiveInInterval /= clusterValues[i].clusterSize;
        clusterValues[i].meanNumVisitedLocations /= clusterValues[i].clusterSize;
        clusterValues[i].meanNumTraversedBetweenLocations /= clusterValues[i].clusterSize;
    }
    return clusterValues;
}

function exportClusterData(data) {
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = data.id + "," + data.cluster;
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent);
}

function transformDataOfDayForCluster(data) {
    var dayData = {numVisitors: 0, meanMsgSent: 0, stdMsgSent: 0, meanUniqueRecipients: 0};
    var idBehaviors = [];
    var idBehaviors = extractIDBehavior(data);
    dayData.numVisitors = idBehaviors.length;
    exportIDBehaviorData(idBehaviors);
    return idBehaviors;
}

function generateTransformedDataBase() {
    var transformedData = [];
    for (var timeSinceStart = 0; timeSinceStart < 940; timeSinceStart += 5) {
        var hour = 8 + Math.floor(timeSinceStart/60);
        var minute = timeSinceStart % 60;
        transformedData.push(
            {
                "time": (hour < 10 ? "0":"") + hour + ":" 
                    + (minute < 10 ? "0":"") + minute,
                "Kiddie Land": 0,
                "Tundra Land": 0,
                "Entry Corridor": 0,
                "Wet Land": 0,
                "Coaster Alley": 0
            }
        )
    }
    return transformedData;
}

function convertStringToHourMinute(timeStamp) {
    var thisTime = timeStamp.split(" ")[1];
    thisTime = thisTime.split(":");
    var hour = parseInt(thisTime[0]);
    var minute = parseInt(thisTime[1]);
    return [hour, minute];
}

function calculatePlaceInListByStamp(timeStamp) {
    var time = convertStringToHourMinute(timeStamp);
    var hour = time[0]; var minute = time[1];
    return calculatePlaceInList(hour, minute);
   
}

function calculatePlaceInList(hour, minute) {
    var placeInList = (hour - 8) * 12 + Math.floor(minute/5);
    return placeInList;

}

function transformDataForStackedAreaChart(data) {
    /* Transform data into how many messages were sent from location, per 5-min interval */
    var transformedData = generateTransformedDataBase();
    for (var i = 0; i < data.length; i++) {
        var placeInList = calculatePlaceInListByStamp(data[i].Timestamp);
        transformedData[placeInList][data[i].location] += 1;
    }
    return transformedData;
}

function exportStackedAreaData(data) {
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = data.time + "," + data["Kiddie Land"] + "," + data["Tundra Land"] + "," + data["Entry Corridor"] 
        + "," + data["Wet Land"] + "," + data["Coaster Alley"];
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent);
}

function extractDataForID(data, ID) {
    var transformedData = generateTransformedDataBase();
    for (var i = 0; i < data.length; i++) {
        //if (ID.includes(data[i].from)) {
        if (checkIfInSortedList(ID, data[i].from)) {
        //if (data[i].from === ID) {
            var placeInList = calculatePlaceInListByStamp(data[i].Timestamp);
            transformedData[placeInList][data[i].location] += 1;
        }
    }
    return transformedData;
}

function extractInterestingData(data) {
    //For each ID, calculate #sentMsg and #uniqueRecipients (entire day)
    var transformedData = [];
    for (var i = 0; i < data.length; i++) {
        var thisTime = convertStringToHourMinute(data[i].Timestamp);
        var hour = thisTime[0]; var minute = thisTime[1];
        if (hour == 16 && minute < 5 && data[i].location == "Coaster Alley") {
            if (transformedData.some(function(d) {return d.ID === data[i].from})) {
                var thisID = transformedData.find(x => x.ID === data[i].from);
                thisID.sentMes += 1;
                if (! thisID.to.some(function(d) {return d === data[i].to})) {thisID.uniqueTo += 1;}
                thisID.to.push(data[i].to);
            }
            else {
                transformedData.push( {ID: data[i].from, sentMes: 1, to: [data[i].to], uniqueTo: 1} );
            }
        }
    }
    return transformedData;
}

function calculateMinutesSince(timeArrLater, timeArrEarlier) {
    var hourDiff = timeArrLater[0] - timeArrEarlier[0];
    var minuteDiff = timeArrLater[1] - timeArrEarlier[1];
    if (minuteDiff < 0) {
        hourDiff -= 1;
        minuteDiff = 60 + minuteDiff;
    }
    return (hourDiff * 60) + minuteDiff;
}

function getIDBehaviorBaseObject(inputObject, thisTime) {
    return {
        ID: inputObject.from, 
        sentMes: 1, 
        to: [inputObject.to], 
        uniqueTo: 1,
        locationsVisited: [inputObject.location],
        timesActive: [thisTime],
        minutesSinceLastMsg: [],
        meanMinutesSinceLstMsg: 0,
        numActiveInInterval: 1,
        numVisitedLocations: 1,
        numTraversedBetweenLocations: 0,
        numVisitedDays: 1
    };
}

function extractIDBehavior(data) {
        var transformedData = [];
        for (var i = 0; i < data.length; i++) {
            var thisTime = convertStringToHourMinute(data[i].Timestamp);
            var hour = thisTime[0]; var minute = thisTime[1];

            //if ID exists in list
            if (transformedData.some(function(d) {return d.ID === data[i].from})) {
                var thisIDsData = transformedData.find(x => x.ID === data[i].from);
                thisIDsData.sentMes += 1;
                if (! thisIDsData.to.some(function(d) {return d === data[i].to})) 
                    thisIDsData.uniqueTo += 1;
                thisIDsData.to.push(data[i].to);
                if (! thisIDsData.locationsVisited.some(function(d) {return d === data[i].location}) ) 
                    thisIDsData.numVisitedLocations += 1;
                if (thisIDsData.locationsVisited[thisIDsData.locationsVisited.length - 1] !== data[i].location) 
                    thisIDsData.numTraversedBetweenLocations += 1;
                thisIDsData.locationsVisited.push(data[i].location);
                var lastActive = thisIDsData.timesActive[thisIDsData.timesActive.length - 1];
                var thisMinutesSinceLastMsg = calculateMinutesSince(thisTime, lastActive);
                thisIDsData.minutesSinceLastMsg.push(thisMinutesSinceLastMsg);
                if (thisIDsData.minutesSinceLastMsg.length > 1)
                    thisIDsData.meanMinutesSinceLstMsg = (thisIDsData.meanMinutesSinceLstMsg + thisMinutesSinceLastMsg) * .5;
                else thisIDsData.meanMinutesSinceLstMsg = thisMinutesSinceLastMsg;
                thisIDsData.timesActive.push(thisTime);
                if (calculatePlaceInList(lastActive[0], lastActive[1]) != calculatePlaceInList(hour, minute))
                    thisIDsData.numActiveInInterval += 1; 
            }
            else {
                transformedData.push( getIDBehaviorBaseObject(data[i], thisTime) );
            }
        }
        return transformedData;
}

function addNumDaysVisitedToBehaviorDataAndExport(dataFri, dataSat, dataSun) {
    dataFri.forEach(function(d) {d.numVisitedDays = 1;});
    dataSat.forEach(function(d) {d.numVisitedDays = 1;});
    dataSun.forEach(function(d) {d.numVisitedDays = 1;});

    for (var i = 0; i < dataFri.length; i++) {
        var d = dataFri[i];
        if (dataSat.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
        if (dataSun.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
    }
    dataSat.forEach(function (d) {
        if (dataFri.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
        if (dataSun.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
    }) ;
    dataSun.forEach(function (d) {
        if (dataSat.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
        if (dataFri.some(function(k) {return k.id === d.id})) d.numVisitedDays += 1;
    });
    exportIDBehaviorDataWithVisitedDays(dataFri, "friday");
    exportIDBehaviorDataWithVisitedDays(dataSat, "saturday");
    exportIDBehaviorDataWithVisitedDays(dataSun, "sunday");
}

function exportIDBehaviorDataWithVisitedDays(data, whichDay) {
    console.log("input received for " + whichDay);
    console.log(data);
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = 
            data.id + "," + 
            data.numSentMsg + "," + 
            data.numUniqueRec + "," + 
            data.meanMinutesSinceLastMsg + "," + 
            data.numActiveInInterval + "," + 
            data.numVisitedLocations + "," + 
            data.numTraversedBetweenLocations + "," + 
            data.numVisitedDays;
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent, whichDay);
}

function exportIDBehaviorData(data, whichDay) {
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = 
            data.ID + "," + 
            data.sentMes + "," + 
            data.uniqueTo + "," + 
            data.meanMinutesSinceLstMsg + "," + 
            data.numActiveInInterval + "," + 
            data.numVisitedLocations + "," + 
            data.numTraversedBetweenLocations;
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent, whichDay);
}

function makeDownloadLink(csvContent, whichDay) {
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", whichDay + ".csv");
    link.innerHTML= "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click();
}

function exportInterestingData(data) {
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = data.ID + "," + data.sentMes + "," + data.uniqueTo;
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    makeDownloadLink(csvContent);
}

function extractEventData(data) {
    var transformedData = [];
    for (var i = 0; i < data.length; i++) {
        var thisTime = convertStringToHourMinute(data[i].Timestamp);
        var hour = thisTime[0]; var minute = thisTime[1];
        //between 11:20 and 12:30
        if (checkIfInIntervalAndLocationOfEvent(hour, minute, data[i].location)) {
            if (transformedData.some(function(d) {return d.ID === data[i].from})) {
                var thisID = transformedData.find(x => x.ID === data[i].from);
                thisID.sentMes += 1;
                if (! thisID.to.some(function(d) {return d === data[i].to})) {thisID.uniqueTo += 1;}
                thisID.to.push(data[i].to);
            }
            else {
                transformedData.push( {ID: data[i].from, sentMes: 1, to: [data[i].to], uniqueTo: 1} );
            }
        }
    }
    return transformedData;
}

function checkIfInIntervalAndLocationOfEvent(hour, minute, location) {
    if (location === "Wet Land" || location === "Entry Corridor") {
    //if (location === "Wet Land") {
        if (hour == 11 && minute > 20) {
            return true;
        }
        else if (hour == 12 && minute < 30) {
            return true;
        }
    }
    return false;
}

function checkIfInSortedList(array, value) {
    return binarySearch(array, value) != -1;
}

var binarySearch = function(array, value) {
    //Source: https://gist.github.com/cbdavide/97100ac68e1f3699274b38a3d6bde7ba
    var guess,
        min = 0,
        max = array.length - 1;	

    while(min <= max){
        guess = Math.floor((min + max) /2);
	if(array[guess] === value)
	    return guess;
	else if(array[guess] < value)
	    min = guess + 1;
	else
	    max = guess - 1;	
     }
	
     return -1;
}