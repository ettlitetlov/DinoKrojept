function stackedAreaChart(inData) {
    //http://bl.ocks.org/mdml/8305340
    //var data = transformDataForStackedAreaChart(inData);
    console.log("finished preparing, indata length: " + inData.length);
    //var data2 = extractInterestingData(inData);
    //var data2 = extractEventData(inData);
    //exportInterestingData(data2);
    var data = extractDataForID(inData, "839736");
    exportStackedAreaData(data);
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

function calculatePlaceInList(timeStamp) {
    var time = convertStringToHourMinute(timeStamp);
    var hour = time[0]; var minute = time[1];
    var placeInList = (hour - 8) * 12 + Math.floor(minute/5);
    return placeInList;
}

function transformDataForStackedAreaChart(data) {
    /* Transform data into how many messages were sent from location, per 5-min interval */
    var transformedData = generateTransformedDataBase();
    for (var i = 0; i < data.length; i++) {
        var placeInList = calculatePlaceInList(data[i].Timestamp);
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
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    link.innerHTML= "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click();
}

function extractDataForID(data, ID) {
    var transformedData = generateTransformedDataBase();
    for (var i = 0; i < data.length; i++) {
        if (data[i].from === ID) {
            console.log(data[i].Timestamp);
            var placeInList = calculatePlaceInList(data[i].Timestamp);
            transformedData[placeInList][data[i].location] += 1;
        }
    }
    return transformedData;
}

function extractInterestingData(data) {
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

function exportInterestingData(data) {
    var lineArray = [];
    data.forEach(function (data, index) {
        var line = data.ID + "," + data.sentMes + "," + data.uniqueTo;
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    link.innerHTML= "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click();
}

function extractEventData(data) {
    var transformedData = [];
    for (var i = 0; i < data.length; i++) {
        var thisTime = convertStringToHourMinute(data[i].Timestamp);
        var hour = thisTime[0]; var minute = thisTime[1];
        //between 11:20 and 12:30
        if (checkIfInIntervalAndLocation(hour, minute, data[i].location)) {
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

function checkIfInIntervalAndLocation(hour, minute, location) {
    if (location === "Wet Land" || location === "Entry Corridor") {
        if (hour == 11 && minute > 20) {
            return true;
        }
        else if (hour == 12 && minute < 30) {
            return true;
        }
    }
    return false;
}