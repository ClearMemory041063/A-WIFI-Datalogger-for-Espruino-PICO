//PICOwifi.js
//14 Feb2018

//Globals
//var verbose;

function clog(a){
 if(verbose===undefined)return;
 console.log(a);
}

function PICOwifi(){
  this.IP=0;
  var wifi;
}//end PicoWiFi

PICOwifi.prototype.connect=function(ssid,pw,usertask){
 Serial2.removeAllListeners();
 digitalWrite(B9,1); // enable on Pico Shim V2
 Serial2.setup(115200, { rx: A3, tx : A2 }); //Pico
 console.log("Start connection process");
 wifi = require("ESP8266WiFi_0v25").connect(Serial2, function(err) {
 if (err){Startagain=1;return;}
 clog("Reset the ESP8266");
 wifi.reset(function(err) {
  if (err){Startagain=1;return;}
  clog("Try Connecting to WiFi ",this.ssid);
  wifi.connect(ssid,key,function(err){console.log(err);
   if (err){Startagain=1;return;
}
    wifi.getIP(function(l,ip){
     if (err){Startagain=1;return;}
      this.IP=ip;
     console.log("IP= ",ip,"\n\r"+l);
     clog("Wi-Fi Connected");
     usertask(wifi);
    });//end getIP
  clog("end getIP");
 });//end connect
 clog("end connect");
});//end reset
 clog("end reset");
});//end require
  clog("end require");
};

//exports.start = function() {
//    return new PICOwifi();
//};

module.exports=PICOwifi;