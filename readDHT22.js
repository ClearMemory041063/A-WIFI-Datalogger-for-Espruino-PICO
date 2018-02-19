var dht = require("DHT22").connect(A7);

var t,h;

function getTemp(){return t;}
function getRH(){return h;}

setInterval(function(){
dht.read(function (a){
 t= a.temp;
 h= a.rh;
  console.log("Temp is ",getTemp());
  console.log("RH is ",getRH());
 //log(); 
}
);
},2000);


