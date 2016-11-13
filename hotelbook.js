
function gethotelnameList(arr){

}

// arr is the arry of hotel name list 


function returnHotelName(latitude,longitude,checkin,checkout){

    $.ajax({
      url : 'https://api.sandbox.amadeus.com/v1.2/hotels/search-circle',
      type : 'GET',
      dataType: 'json',
      data: {"apikey": "j1QJS395Gyixso59Esaj4apISXiLqAMj", 
             "latitude": latitude,
             "longitude": longitude,
             "radius"  :"10",
             "check_in" :checkin,
             "check_out" :checkout
            },


    })
    .done(function(result){
      console.log("success");
      console.log(result);
      console.log(checkin);
      console.log(checkout);
     var size = result.results.length;
     console.log(size);
     var hotellist =[];
     //document.write(size);
     for (var i=0; i< size;i++){
          var counter = result.results[i];
          var name = counter['property_name'];
          hotellist.push(name);

      }
      gethotelnameList(hotellist);

    });
}

//returnHotelName(43.6,7.2,"2016-12-25","2016-12-26");  



 

  function getHotelNum(num){
        console.log(num);  

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
             "check_out" :'2016-12-26'
            },
      success: function(result) {
        var s  = result.results.length;

        console.log(s);
        getHotelNum(s);
      }


       });

 
   
  
}  

returnHotelNum(43.7,7.2);    
 

