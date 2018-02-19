### A WIFI Datalogger for Espruino PICO

#### What it does:
1. Connects to a Wifi router

2. Sends a Dweet containing the local IP address

[Dweet](https://www.espruino.com/IoT+Services)

4. Sets the PICO RTC to the time returned by the Dweet Service

5. DIsconnects and reconnects to the Wifi router

6. Serves a Web page that allows the client to enter the filename to assign to downloaded data.

7. Send the collected data in comma separated format CSV with a MIME header that opens an Excel spreadsheet.

8. Collects the data at specified intervals and stores it in ring buffers in RAM.

#### The Hardware

1.  Espruino PICO board running Espruino 1v95 or later software, and an ESP8266 mounted on a shim.

[PICO wifi shim](https://www.espruino.com/ESP8266)


2. A pushbutton switch wired from pin B3 to ground. (Digital Read)


3.  A 10k potentiometer or series of 10k resistors wired to vary the Voltage on pin B1 in a range of 0.0 to 3.0 Volts. (Analog Read)


4. (for one program) A DHT22 Relative Humidity and Temperature sensor with the power leads appropriately connected to ground and the 3.3 Volt busses and the output pin with a pullup resistor connected to PICO pin A7.

[DHT22](https://www.espruino.com/DHT22)


#### Items to edit in order to run the examples:


1. Local Modules

In the upper right of the WebIDE is a 'gear' looking icon, hover the cursor over the icon and the word settings will appear. Click on the settings icon and then select Project. Use the "Select Directory for the Sandbox " to select or even create a sanbox directory. For example I create a sandbox named EspruinoModules. It has a number of sub-directories. We are interested in the one called \modules.

"C:\Users\jj\Documents\EspruinoModules\modules"

Copy the attached modules files to the folder:

"C:\Users\jj\Documents\EspruinoModules\modules\PICOwifi.js"

and

"C:\Users\jj\Documents\EspruinoModules\modules\ringMod.js"


2. Editing the Programs to run the Demos


"C:\Users\jj\Documents\PICOwifi\logger\Ring\Post19Feb2018\PICOwifi-Dweet-Log-Test.js"

"C:\Users\jj\Documents\PICOwifi\logger\Ring\Post19Feb2018\PICOwifi-Dweet-Log-DHT22.js"


a. ssid - wifi name

b. key - wifi password

c. DweetID make up a name unique to you

d. timezone (-6 is for CST)


```
// things to configure
var ssid="myssid";
var key="mykey";
//set DweetID to a unique value
var DweetID="mydweetname";
// https://dweet.io/get/latest/dweet/for/mydweetname
var verbose; //module is quiet
//var verbose=1; // module console.logs
var timezone=-6;
var dsize=432;//144;
var loginterval=1000;
```
The verbose refers to console output in the PICOwif module.
dsize it the length of the rung buffer used to store data.

loginterval is the number of milliseconds between data samples.


#### The WebIDE output:

```
 1v95 Copyright 2017 G.Williams
>Start connection process
=undefined
null
IP=  192.168.1.11
null
Mytask 1
Sun Feb 18 2018 20:22:25 GMT-0600
Start connection process
null
IP=  192.168.1.11
null
Mytask 2
dl
rend1
dl
rend1
dl
rend2
rend2
rend2
rend2
rend2
rend2
rend2
rend1
```

#### The Dweet Page

From a browser enter the IP address
(substitute mysweet name)

https://dweet.io/get/latest/dweet/for/mydweetname

The output displayed on the web page will be

```
{"this":"succeeded","by":"getting","the":"dweets","with":[{"thing":"lovelyDay823","created":"2018-02-19T02:22:25.410Z","content":{"IP":"192.168.1.11"}}]}
```

#### The Download Page

Using a browser enter the IP address of the PICO

For example:

http://192.168.1.11:8080/


```
To Download data from lovelyDay871 
Name the .CSV file name where you want to save the data 
 Click to download 
```
For now  just click. Later try changing the filename before clicking download. Try xxy.csv, xxx , and xx.txt.

For xxx.csv my Windows10 system displays a message at the bottom of the page that says:


```
What do you want to do with xxx.csv?
From 192.168.1.11
Open, Save Cancel
```

The file is opened with Excel.


Example xxx.csv downloaded (see attached file):

'''
Station Name	lovelyDay871	 					
Download Time	Sun Feb 18 2018 16:59:12 GMT-0600	 	 	 			
							
N	Date	Temp F	Temp C	Flow l/s	Pump	dhtTemp C	dhtRH %
0	Sun Feb 18 2018 16:55:18 GMT-0600	79.07	25.7	0.67	1	21.6	40.1
1	Sun Feb 18 2018 16:55:19 GMT-0600	79.65	26.35	0.66	1	21.6	40.4
2	Sun Feb 18 2018 16:55:20 GMT-0600	80.02	26.15	0.67	1	21.6	40.2
3	Sun Feb 18 2018 16:55:21 GMT-0600	80.24	27.01	0.67	1	21.6	40.2
```



