measure = function (data) {
    
    measureNotify (data);


    measureNotify = function (data){
        console.log ("---------------------------------------------");
        console.log ("Measure function has received:");
        console.log (JSON.stringify(data, null, 4));
        console.log ("---------------------------------------------");
    }

}