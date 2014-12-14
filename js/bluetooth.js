var adapter = tizen.bluetooth.getDefaultAdapter();
var serviceUUID = "00001101-0000-1000-8000-00805F9B34FB";
var count = 0;
var Daddr = new Array();
var Dname = new Array();
var DUUID = new Array();

var deviceAddr;
var deviceName;
var deviceUUID;

var chatServiceHandelr = null;

var discoverDevicesSuccessCallback = 
{
   /* When a device is found */
		
   ondevicefound: function(device)
   {      
      $('#found_daddr'+ count).text(device.address);
      $('#found_dname'+ count).text(device.name);
      Daddr[count]=device.address;
      Dname[count]=device.name;
      
      count++;
   }
};

function AskBTparing(index) {
	deviceAddr = Daddr[index];
	deviceName = Dname[index];
	deviceUUID = DUUID[index];
	
	console.log(Daddr[index]);
	console.log(Dname[index]);
	console.log(DUUID[index]);
	
	adapter.stopDiscovery(function() {console.log("Stop discovery success.");},
						  function (e) { console.log("Error while stopDiscovery:" + e.message); });
	adapter.createBonding(deviceAddr,onBondingSuccessCallback,onErrorCallback);
	
	adapter.getDevice(deviceAddr, function(device) {
	    if (device.deviceClass.hasService(tizen.bluetooth.deviceService.POSITIONING)) {
	         console.log("Device supports Positioning service");
	    }
	 }, function(e) {
	    console.log("Couldn't get device for given address: " + e.message);
	 });
}

/*
function onSocketConnected(socket) {
	
}

function onSocketError(e) {
	console.log ("Error connecting to service. Reason: " + e.message);
}

function onDeviceReady(device) {
    // Validates device and service uuid
    if (device.uuids.indexOf(serviceUUID) != -1) {
       // Opens socket
       device.connectToServiceByUUID(serviceUUID, onSocketConnected, onSocketError );
    }
 }


function onSocketConnected(socket) {
    clientSocket = socket;
    console.log("Opening a socket successfully!!!");
    socket.onmessage = function () {
        var data = socket.readData();
        var recvmsg = "";
        for (var i = 0; i < data.length; i++)
        {
           recvmsg += String.fromCharCode(data[i]);
        }
        console.log("server msg >> " + recvmsg);
    };

    socket.onclose = function() {
        console.log("socket disconnected.");
    };
 }

function onDeviceReady(device) {
    // Validates device and service uuid
    if (device.uuids.indexOf(serviceUUID) != -1) {
       // Opens socket
       device.connectToServiceByUUID(serviceUUID, onSocketConnected, function(e) {
           console.log ("Error connecting to service. Reason: " + e.message);
        });
    }
    else {
        console.log ("Chat service is not supported by this device");
    }
 }

function onSetPowered() {
    // Gets the BluetoothDevice object
    adapter.getDevice(device.address, onDeviceReady, function(e) { console.log("Error: " + e.message); });
 }
*/



function connectBTserver() {
	console.log("connectBTserver");
	console.log("serviceUUID: " + serviceUUID);
	adapter.getDevice(deviceAddr, function(device) {
	    var uuids = device.uuids;
	    var services = "";
	    for (var i = 0; i < uuids.length; i++) {
	        services += uuids[i] + "\n";
	        
	    }
	    
	    console.log ("Services names: " );
	    console.log ("Services found: " + services);	
	    
	    if (uuids.indexOf(serviceUUID) != -1) {
	        // Connects to service
	        device.connectToServiceByUUID(serviceUUID, function(socket) {
	        	console.log("I'm Connected!!");
	        	var textmsg = "This is a message from Tizen device";
	        	var sendMSG = new Array();
	        	
	        	for(var i=0; i<textmsg.length; i++) {
	        		sendMSG[i] = textmsg.charCodeAt(i);
	        	}
	        	socket.writeData(sendMSG);
	            //
	            // Connected to service, handle socket
	            //
	        }, function (e) {
	            console.log("Could not connect to chat service !!!. Error: " + e.message);
	        });
	    }
	 });
}

function onBondingSuccessCallback(device)
{
   console.log("A bonding is created - name: " + device.name);
}

function onErrorCallback(e) 
{
   console.log("Cannot create a bonding, reason: " + e.message);
}

function onGotDevices(devices) {
   console.log("The number of known devices: " + devices.length);
}

function onError(e) {
	console.log("Error: " + e.message);
}

/* Retrieve known devices */
adapter.getKnownDevices(onGotDevices, onError);

/* Discover devices */
adapter.discoverDevices(discoverDevicesSuccessCallback, null);



