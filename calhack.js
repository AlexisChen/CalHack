$(document).ready(function(){
    $('#search').click(function(){
        search();
    });
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    createSpecificDate(year, month, day)
});
function search() {
    var departure = $('#city').val();
    document.write(departure);
    $.ajax({
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
    type: 'GET',
    dataType: 'json',
    data: {"apikey": "Uo0ACCqJG3OCzfFRtOb5ycdylaffGkQv", "origin": "NYC"},
    })
    .done(function(result) {
        var name = result.results.length;

        document.write(name);
        document.write("success");
        var obj = JSON.parse(result);
        document.write(obj.origin);
                // alert( obj.name === "John" );
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

    var date = date1+date2;
    document.write(date+"<br>");

    return output;
}
