// Main measure function
measure = function (data) {

    measureNotify (data);
    measureGoogle (data);
}

// Notification to console
measureNotify = function (data){
    console.log ("---------------------------------------------");
    console.log ("Measure function has received:");
    console.log (JSON.stringify(data, null, 4));
    console.log ("---------------------------------------------");
}

// Measurement data transfer for Google
measureGoogle = function (data){
    dataLayer.push (data)
}