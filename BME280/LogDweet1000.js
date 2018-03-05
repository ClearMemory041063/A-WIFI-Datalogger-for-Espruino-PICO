// LogDweet1000.js
// 3 Mar 2018
//PICOwifi-Dweet-Log-Mod3.js
// 18 Feb2018
// PICO with ESP8266-01 on a shim
//use PICOwifi module

// things to configure
var ssid="router name";
var key="password";
//set DweetID to a unique value
var DweetID="A Dweet Name";
// https://dweet.io/get/latest/dweet/for/lovelyDay1000
var verbose; //module is quiet
//var verbose=1; // module console.logs
var timezone=-6;
var dsize=432;//144;
var loginterval=1000*60*10;
///
var pinB1=B1; //analogRead
pinMode(pinB1,'analog');
var pinB3=B3; //digitalRead
pinMode(B3, 'input_pullup');
var pinDHT=A7;
/////////////////////
// used by PICOwifi module
var Startagain=0;
var myinterval;
E.setTimeZone(timezone);
// Some globals
var tasknumber=0;
var Clock = require("clock").Clock;
var clk=new Clock("Jun 23, 2014 12:18:02");
var data=[];
var l=0;
var logflag=0;
var Bmevar;
function getTemp(){return Bmevar.temp;}
function getRH(){return Bmevar.humidity;}
function getPress(){return Bmevar.pressure;}

////
var X=require('PICOwifi');//.start();
var Y=new X();
var R=require('ringMod');
var dht = require("DHT22").connect(pinDHT);
var bme;

function datestring(a){
//  console.log(a);
  return Date(a).toString();
}

function tofixed(a,b){
  return(a.toFixed(b));
}

function gettime(a){
  return clk.getDate();
}

data.push(new R("Date",dsize,Array,1,1,0,gettime,null,datestring,0));
data.push(new R("Sun",dsize,Int16Array,4096,1,0,analogRead,pinB1,tofixed,2));
data.push(new R("Temp C",dsize,Int16Array,100,1,0,getTemp,null));
data.push(new R("RH %",dsize,Int16Array,100,1,0,getRH,null));
data.push(new R("Press mBar",dsize,Int32Array,100,1,0,getPress,null));

// a fake out to pretend the buffer has filled for testing
//for(var i=0;i<data.length;i++)data[i].cnt=dsize;

function log() {
 var i;
 if(logflag>0){
  for(i=0;i<data.length;i++)data[i].insert();
 }
}
/////////////////////////

function putDweet(dweet_name, a, callback) {
  var data = "";
  for (var n in a) {
    if (data.length) data+="&";
    data += encodeURIComponent(n)+"="+encodeURIComponent(a[n]); 
  }
  var options = {
    host: 'dweet.io',
    port: '80',
    path:'/dweet/for/'+dweet_name+"?"+data,
    method:'POST'
  };
  require("http").request(options, function(res)  {
    var d = "";
    res.on('data', function(data) { d+=data; });
    res.on('close', function(data) {
      if (callback) callback(d);
    });
 }).end();
}

///////////////////////////////////////////////////////////

function mytask1(){
// console.log("Mytask 1");
 putDweet(DweetID, {IP:this.IP}, function(d) {
   var L = JSON.parse(d);
//   console.log(L);
   var x1= L.with.created;
//  console.log("x1=",x1);
  clk.setClock(Date.parse(x1)+3600000*timezone);
//  console.log(clk.getDate().toString());
  Startagain=1;tasknumber=1;
  logflag=1;
 });//end putDweet
//// end user code  

}//end my task1
//////////////////////////////////////////////////////


var page1=
"<!DOCTYPE html>\r\n<html>\r\n<body style=\"text-align:center;\"  >\r\n<p>To Download data from ";
var page2=" </p>\r\n<p> Name the .CSV file name where you want to save the data </p>\r\n<input id=\"ert\" type=\"text\" name=\"filename\" value=\"xxx.csv\">\r\n<button onclick=\"myFunction()\">Click to download</button>\r\n<p id=\"demo\" ></p>\r\n<script>\r\nfunction myFunction() {\r\n    document.getElementById(\"demo\").innerHTML = ert.value;\r\n    location.href=ert.value;\r\n}\r\n</script>\r\n</body>\r\n</html>\r\n\r\n "
;

function onPageRequest(req, res) { 
    var i=0;
    var ii=0;
    var j=0;
    var sss="";
  var a = url.parse(req.url, true);
if (a.pathname.substr(-1)=="/") { // a slash at the end
    res.writeHead(200, {'Content-Type': 'text/html'});
// substitute your own html here
// maybe a button to clear or reset the data log on the Pico
    res.write(page1+DweetID+page2);
process.memory(); 
    res.end();                                
}else{ //filename.csv after the URL slash to do csv files
process.memory(); 
//console.log("dl");
    res.writeHead(200, {'Content-Type': 'text/csv'});
//write csv file header
     res.write("Station Name,"+DweetID+"\r");
     res.write("Download Time,"+clk.getDate().toString()+"\r");
     res.write("\r");
//write the column headers for the csv file
  for(j=0;j<data.length;j++)sss+=data[j].hname+",";
  sss=sss.slice(0,sss.length-1)+'\r';
//  console.log("N,",sss);
  res.write("N,"+sss);
  i=0;j=0;
// send the data
  res.on('drain',function(){
process.memory(); /////////////////////////////////////////
    if(j>=data[0].cnt){ //logdata.length){ 
//    console.log("rend1");
    res.end();
   }else{
  for(i=j;i<j+10;i++){
    if(i<data[0].cnt){ 
  sss="";
     for(ii=0;ii<data.length;ii++)
      sss=sss+data[ii].getDatum(i)+",";
     sss=sss.slice(0,sss.length-1)+'\r';
     res.write(i.toString()+","+sss);
     }else{
process.memory(); /////////////////////////////////////////
//      console.log("rend2");
      if(j){
        res.end();
        j=0;
      }//end if j  
     }
    }//next i
    j+=10;
   }//end else
  });//end on drain
}//end else
 res.on('close', function() {});//console.log("t2close");  });
 req.on('data',function(data){});//,data);});
 req.on('error',function(){});//console.log("reqerr");});
 req.on('close',function(){});//console.log("reqcls");});
}//end onPagerequest

function mytask2(){
// console.log("Mytask 2");
 require("http").createServer(onPageRequest).listen(8080);
}//end my task2

//////////////////////////////////////////////////////
function mytask(){
 switch (tasknumber){
  case 0:
   mytask1();
  break;
  case 1:
   mytask2();
  break;
  default:
   tasknumber=0;
  }//end switch
}//end mytask
//////////////////////////////////////////////////////

E.on('init',function(){
 tasknumber=0;
 logflag=0;
 Startagain=1;
 I2C3.setup({scl:A8,sda:B4});
 bme = require("BME280").connect(I2C3);
// Do the logging at loginterval in ms
setInterval(function(){
 Bmevar=bme.getData();
 log();
},loginterval);
  myinterval=setInterval(function () {
  digitalWrite(LED1,l=!l);
  setTimeout(function(){
   digitalWrite(LED1,l=!l);
  },100);
  if(Startagain){
   Startagain=0;
   Y.connect(ssid,key,mytask);//test();
  }//end of Startagain
}, 2000);
});     

