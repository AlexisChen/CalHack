$(document).ready(function(){
    $('#search').click(function(){
        search();
    });
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    // generateAirport(46.6734,-71.7412);
    // createSpecificDate(year, month, day)
    // search("NYC");
});
//pass in the city to generate popularity
function search(s) {
    $.ajax({
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
    type: 'GET',
    dataType: 'json',
    data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv", "origin": s},
    })
    .done(function(result) {
        var count = result.results.length;
        console.log("success");
        return count;
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
}
function generatePopularity(latitude, longitude){
    var Airport = generateAirport(latitude, longitude);
    var flightcount = search(Airport);
    

}
//see if need more airport
function generateAirport(latitude, longitude){
    $.ajax({
        url: 'https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant',
        type: 'GET',
        dataType: 'json',
        data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv","latitude":latitude,"longitude": longitude},
    })
    .done(function(result) {
        
        var airport = document.write(result[0].airport);
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    

}
function createSpecificDate(year, month, day){
            
    var date = year + '-' +
    (month<10 ? '0' : '') + month + '-' +
    (day<10 ? '0' : '') + day;
    document.write(date+"<br>");
    return date;
}
function createPeriod(year1, month1, day1, year2, month2, day2) {
            
    var date1 = year1 + '-' +
    (month1<10 ? '0' : '') + month1 + '-' +
    (day1<10 ? '0' : '') + day1;
    document.write(date1+"<br>");

    var date2 = year2 + '-' +
    (month2<10 ? '0' : '') + month2 + '-' +
    (day2<10 ? '0' : '') + day2;

    var date = date1+"--"date2;
    document.write(date+"<br>");

    return output;
}
