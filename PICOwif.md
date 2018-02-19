#### Using the PICOwifi.js Module

#### Require and create an instance of PICOwif

```
var X=require('PICOwifi');
var Y=new X();

```
#### Setup some variables

```
// things to configure
var ssid="your network name";
var key="your network password";

// used by PICOwifi module
var Startagain=0;
var myinterval;
var verbose; //module is quiet
//var verbose=1; // module console.logs
```
#### Create a task or a series of tasks

For example:

```
var page1 = "<!DOCTYPE html>\r\n<html>\r\n<body>\r\n\r\n<h1>My First Web Page</h1>\r\n<p>My first paragraph.\r\n</body>\</html>";

function mytask(){
 console.log("Mytask");
//// Various user code can go here a simple hello page server
//// is given as an example
var http=require('http').createServer(function (req, res) {
res.writeHead(200);
 console.log("hello");
 res.write(page1);
 res.end();
 res.on('close', function() {});//console.log("t2close");  });
 req.on('data',function(data){});//,data);});
 req.on('error',function(){});//console.log("reqerr");});
 req.on('close',function(){});//console.log("reqcls");});
}).listen(8080); //end server
//// end user code  
}//end my task

```

#### Setup function to start the wifi and check it periodically



```
function test(){
    Y.connect(ssid,key,mytask);
}//end test

myinterval=setInterval(function () {
//  console.log("Test for error");
  if(Startagain){
   Startagain=0;
   test();
  }//end of Startagain
}, 2000);

test();
```

The Startagain variable can be used in the task code to cause the WIFI to restart. A tasknumber could be used in Mytask to take the tasks through a series of tasks


