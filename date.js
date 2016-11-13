

parseString("2016-07-24",5);

// 使用范例： 日期和你要增加的天数



function parseString(date,days){
    
    var res = date.split("-");
    var max_days =30;  
    if (res[1]=="1" || "3" || "5" ||"7" || "8" || "10" ||"12"){
        max_days =31; 
    }

    if (res[1]=="2"){
      max_days =28;
    }
    res[2] = +res[2] +  +days;

    
    if (res[2] > max_days){
    	res[2] = res[2] -max_days;
    	if (res[2]<10){
        res[2] ="0" +res[2];
        }
        res[1]=  +res[1] + +1 ;

    }
    if (res[1] > 12){
    	res[1] -= 12;
        if (res[1]==1){
            res[1] ="0" +res[1];
        }
    	res[0] = +res[0] + +1; 
    }

    res[0] =res[0].toString();

 
    var output = res[0].concat("-",res[1],"-",res[2]);
    console.log(output);
  


}



