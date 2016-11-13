var enabled = true;
$(document).ready(function(){
    $('#sm-btn').click(function(){
        if (!enabled) return;
        enabled = false;
        for (var i = 0; i<locationsArray.length; i++){
            var lat = locationsArray[i].geometry.location.lat();
            var lng = locationsArray[i].geometry.location.lng();
            getPriority(lat, lng, i);
        }
        setTimeout(processLocationArray, 1000*locationsArray.length);
    });
});
var highest = [];
var averaged = [];
var detailed = [];
function processLocationArray(){
    var days = 15;
    var total= 0;
    var highesttotal = 0;
    var averagedtotal = 0;
    var detailedtotal = 0;
    for (var i = 0; i<locationsArray.length; i++){
        total+=locationsArray[i].priority;
    }
    var average = total/locationsArray.length;
    for (var i = 0; i<locationsArray.length; i++){
        if (locationsArray[i].priority >= average *1.5){
            highest.push(locationsArray[i]);
            highesttotal+=locationsArray[i].priority;
        }
        if (locationsArray[i].priority >= average ){
            averaged.push(locationsArray[i]);
            averagedtotal+=locationsArray[i].priority;
        }
        if (locationsArray[i].priority >= average *0.5){
            detailed.push(locationsArray[i]);
            detailedtotal+=locationsArray[i].priority;
        }
    }
    var s = "<p class='title'>Basic Trip</p>";
    for (var i = 0; i<highest.length; i++){
        s+='<ul class="aplace"><li class="city">';
        s+=highest[i].name;
        s+='</li><li class="day">'
        s+=Math.floor(highest[i].priority/highesttotal * days)+ " Days</li>";
        s+="</ul><ul class='aplace hotels'>";
        for (var j = 0 ; j < 5; j++){
            s+='<li class="hotel">';
            s+=highest[i].hotels[j].property_name;
            s+='</li>'
        }
        s+='</ul>';
    }
    console.log(s);
    $('.place').append(s);

}

class cityPriority{
    constructor(i){
        this.priority = 0;
        this.i = i;
    }
    retrievepriority(){
        return this.priority;
    }
    clear(){
        this.priority = 0;
    }
    addflight(num){
        this.priority+=num*0.05;
        locationsArray[this.i].priority += num*0.05;
        console.log("flight", num, locationsArray[this.i].name)
    }
    addhotel(num){
        this.priority += num*0.2;
        locationsArray[this.i].priority += num*0.2;
        console.log("hotel", num, locationsArray[this.i].name)
    }
    addpoi(num){
        this.priority += num*0.3;
        locationsArray[this.i].priority += num*0.3;
        console.log("interest", num, locationsArray[this.i].name)
    }
}

//sample call of adding flight priority to the current cp;


function getPriority(lat, lng, i){
    var cp = new cityPriority(i);
    locationsArray[i].priority = 0;
    // generateAirport(lat, lng, cp, function(cp, airport) {
    //     flight(airport, function(count) {
    //         cp.addflight(count);
    //     });
    // });
    generatepoi(lat, lng, cp);
    returnHotelNum(lat,lng, cp);
}

function search(s, callback) {
    console.log("search", s);
    $.ajax({
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
    type: 'GET',
    dataType: 'json',
    data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv", "origin": s},
    })
    .done(function(result) {
        var count = result.results.length;
        callback(count);
    })
    .fail(function(){
      
    })
    .always(function() {
        
    });
    
}

function flight(s, callback) {
    //generate the date
    //returns date of a specific day 
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth()-2;
var date = year + '-' +
    (month<10 ? '0' : '') + month;
    
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/travel-intelligence/top-destinations',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv", "period":date,"origin":s},

    })
    .done(function(result) {
        var count  = result.results.length;
        callback(result);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
}

//TO BE DETERMINED TO see if need more airport
function generateAirport(latitude, longitude,cp, callback){
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv","latitude":latitude,"longitude": longitude},
    })
    .done(function(result) {
        
        var airport = result[0].airport;
        console.log(airport);
        callback(cp, airport);
    })
    .fail(function() {
        // console.log("error");
    })
    .always(function() {
        // console.log("complete");
    });
}


function generatepoi(latitude, longitude, cp){
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv",
            "latitude": latitude,
            "longitude": longitude,
            "radius":"20",
            "number_of_results":"100"},
    })
    .done(function(result) {
        console.log(result);
        var s = result.points_of_interest.length;
        cp.addpoi(s);
    })
    .fail(function() {
        // console.log("error");
    })
    .always(function() {
        // console.log("complete");
    });
    
}


var value;

//num is the number of hotel numbers 
 function returnHotelNum(latitude,longitude, cp){   
    //var s=0;
    $.ajax({
    url : "https://api.sandbox.amadeus.com/v1.2/hotels/search-circle",
    type : 'GET', 
    dataType: 'json',
    data: {"apikey": "j1QJS395Gyixso59Esaj4apISXiLqAMj", 
        "latitude": latitude,
        "longitude": longitude,
        "radius"  :"20",
        "check_in" :"2016-12-25", 
        "check_out" :'2016-12-26',
        "number_of_results": "200"},
    })
    .done(function(result) {       
        var s  = result.results.length;
        locationsArray[cp.i].hotels = result.results;
        cp.addhotel(s);
    })
    .fail(function() {
    })
    .always(function() {
    });;
}  

function foo(cp){
    // console.log("foo: ", cp.priority);
    // locationsArray[cp.i].priority = cp.priority;
}
function printCities(){
    for (var i = 0; i<locationsArray.length; i++) 
        console.log(locationsArray[i].name,locationsArray[i].priority)
}
//returns date of a specific day 
// var d = new Date();
// var year = d.getFullYear();
// var month = d.getMonth()+1;
// var day = d.getDate();

function createSpecificDate(year, month, day){
    var date = year + '-' +
    (month<10 ? '0' : '') + month + '-' +
    (day<10 ? '0' : '') + day;
    document.write(date+"<br>");
    return date;
}
//get a string of time period
function createPeriod(year1, month1, day1, year2, month2, day2) {
            
    var date1 = year1 + '-' +
    (month1<10 ? '0' : '') + month1 + '-' +
    (day1<10 ? '0' : '') + day1;
    document.write(date1+"<br>");

    var date2 = year2 + '-' +
    (month2<10 ? '0' : '') + month2 + '-' +
    (day2<10 ? '0' : '') + day2;

    var date = date1+"--"+date2;
    document.write(date+"<br>");

    return output;
}

