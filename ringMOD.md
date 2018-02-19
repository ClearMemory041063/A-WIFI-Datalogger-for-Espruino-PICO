#### Using the ringMod.js Module 

#### Assuming that the ringMod.js module is located in the modules folder of the WEBide sandbox.

#### Require the module in your code and for convience use a variable to specify the length of the  ring buffers.

```
var R=require('ringMod');
var dsize=432;
```
#### Declare an array of pointers to instances of ringMOD and then create the instances

For example:

```
var data=[];
data.push(new R("Date",dsize,Array,1,1,0,gettime,null,datestring,0));
data.push(new R("Temp F",dsize,Int16Array,100,9/5,32,E.getTemperature,null,tofixed,2));
data.push(new R("Temp C",dsize,Int16Array,100,1,0,E.getTemperature,null));
data.push(new R("Flow l/s",dsize,Int16Array,4096,1,0,analogRead,pinB1,tofixed,2));
data.push(new R("Pump",dsize,Int8Array,1,1,0,digitalRead,pinB3,tofixed,0));
data.push(new R("dhtTemp C",dsize,Int16Array,100,1,0,getTemp,null));
data.push(new R("dhtRH %",dsize,Int16Array,100,1,0,getRH,null));
```
#### The fields used when creating instances of ringMOD

```
ring(hname,size,type,mult,slope,intercept,logfunc,lfargs,format,fargs){
```
1.  hname - a string that is used for the column title in the final spreadsheet
2.  size - the length of the ring buffer
3. type - the data type used to store the data. Examples Int16Array, Int8Array etv
4. mult - multiplies the raw data before storage, divides the stored value before using
5. slope - the linear regression slope used to scale raw values into engineering units (non-zero) If in doubt use 1.0
6. intercept - the linear regression intercept used to scale raw values into engineering units (try 0.0)
7. logfunc - name the function or helper function used to obtain the raw data. Examples:

```
function gettime(a){
  return clk.getDate();
}
```
8. lfargs - any argument needed to complte the logfunc. Example logfunc= "analogRead" and lgargs= B7, if not needed use null
9. format - name of helper function used to format the data Examples:

```
function datestring(a){
//  console.log(a);
  return Date(a).toString();
}

function tofixed(a,b){
  return(a.toFixed(b));
}
```

10. fargs - argument used with the format function: For example format =tofixed and fargs=2

#### Inserting the data 

Note the logflag used to suspend logging until the clock etc are ready to log.

```
function log() {
 var i;
 if(logflag>0){
  for(i=0;i<data.length;i++)data[i].insert();
   digitalWrite(LED1,l=!l);
 }
}
```
#### Logging the data

The DHT22 returns data in a callback so call it first and in the callback save the DHT data and do the log()

```
// Do the logging at loginterval in ms
setInterval(function(){
dht.read(function (a){
 DHTt= a.temp;
 DHTrh= a.rh;
//  console.log("Temp is ",getTemp());
//  console.log("RH is ",getRH());
 log();
});
},loginterval);
```

The DHT temporary storage variables and the logfunct helper functions
```
var DHTt,DHTrh;
function getTemp(){return DHTt;}
function getRH(){return DHTrh;}
```

#### Creating the CSV data from the data array

The process.memoy() commands fix a bug that the cutting edge version of Espruino has fixed.

Send 10 lines at a time in the drain function to keep from using too much memory at a time.
```
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
console.log("dl");
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
    console.log("rend1");
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
      console.log("rend2");
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
```



