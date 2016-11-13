
$(document).ready(function(){
    // $('#search').click(function(){
    //     generateAirport(46.6734, -71.7412, function(airport) {
    //         search(airport, function(count) {
    //             something(count);
    //         });
    //     });
    // });
    // function something(c) {
    //     document.write(c);
    // }  
    // var cp = new cityPriority();
});

class cityPriority{
    constructor(){
        this.priority = 0;
    }
    retrievepriority(){
        return this.priority;
    }
    clear(){
        this.priority = 0;
    }
    addflight(num){
        this.priority+=num*0.5;
    }
    addhotel(num){
        this.priority += num*0.2;
    }
    addpoi(num){
        this.priority += num*0.3;
    }
}
var cp = new cityPriority();

//sample call of adding flight priority to the current cp;
generateAirport(46.6734, -71.7412, function(airport) {
    search(airport, function(count) {
        cp.addflight(count);
        // document.write(cp.retrievepriority());
    });
});
//sample call of adding hotel priority to the current cp;
returnHotelNum(46.6734,-71.7412);
//always and only console.log inside function to check the value
//don't forget to call cp.clear() after retrieve the priority
//otherwise please reinitialize another instance
generatepoi(46.6734,-71.7412)


//testing of the cp class

// var cp = new cityPriority();
// document.write(cp.priority);

// cp.addflight(10);
// document.write(cp.priority);

// cp.addhotel(10);
// document.write(cp.priority);

// cp.addpoi(10);
// document.write(cp.priority);

// document.write(""+cp.retrievepriority());
// cp.clear();
// document.write(cp.priority);


//pass in the city to generate popularity
function search(s, callback) {

    document.write("searching starts"+"<br>");
    $.ajax({
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
    type: 'GET',
    dataType: 'json',
    data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv", "origin": s},
    })
    .done(function(result) {
        var count = result.results.length;
        // a = count;
        // document.write(a);
        callback(count);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
}

//TO BE DETERMINED TO see if need more airport
function generateAirport(latitude, longitude, callback){
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv","latitude":latitude,"longitude": longitude},
    })
    .done(function(result) {
        
        var airport = result[0].airport;
        document.write("from generate Airport: "+ airport);
        return callback(airport);

    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });



}

//num is the number of hotel numbers 
 function returnHotelNum(latitude,longitude){   
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
        "check_out" :'2016-12-26'},
    })
    .done(function(result) {       
        var s  = result.results.length;
        // console.log(s);
        // getHotelNum(s);
        cp.addhotel(s);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });;
}  

function generatepoi(latitude, longitude){
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv",
            "latitude": latitude,
            "longitude": longitude,
            "radius":"50"},

    })
    .done(function(result) {
        console.log("success");
        var s = result.points_of_interest.length;
        cp.addhotel(s)
        document.write(cp.priority);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
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

