//i2c1 b7 sda, b6 scl
//i2c3 b4 sda, a8 scl
//i2c1 b9 sda, b8 scl

I2C3.setup({scl:A8,sda:B4});
var bme = require("BME280").connect(I2C3);
console.log(bme.getData());
// prints { "temp": 23.70573815741, "pressure": 1017.27733597036, "humidity": 42.0771484375 }

var a=bme.getData();
console.log("a",a);

setInterval(function(){
 a=bme.getData();
 console.log(a.pressure);
},500);