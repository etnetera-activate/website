// Main measure function
measure = function (data) {

    measureNotify (data);
}

// Notification to console
measureNotify = function (data){
    console.log ("---------------------------------------------");
    console.log ("Measure function has received:");
    console.log (JSON.stringify(data, null, 4));
    console.log ("---------------------------------------------");
}