    $.ajax({
      url : "https://api.sandbox.amadeus.com/v1.2/hotels/search-circle",
      type : 'GET',
      dataType: 'json',
      data: {apikey: 'j1QJS395Gyixso59Esaj4apISXiLqAMj', 
             latitude: '43.6',
             longitude: '7.2',
             radius  :'10',
             check_in :'2016-12-25',
             check_out :'2016-12-26'
            },

    })
    .done(function(result){
      console.log("success");
      console.log(result);

     var size = result.results.length;
     document.write(size);
     var addressforhotel =[];
     var hotellist =[];
    //var jsonData = JSON.parse(result);
    
    for (var i = 0; i < size; i++) {
        //var jsonData = JSON.parse(result[i]);
        var counter = result.results[i];
        var buffer = counter['address'];
        var name = counter['property_name'];
        document.write(name+"<br>");
        document.write(buffer['line1']+"<br>");

        addressforhotel.push(buffer['line1']);
        hotellist.push(name);
        //obj = JSON.parse(counter);
        //document.write(obj.address);
    }

    })