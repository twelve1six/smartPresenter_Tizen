var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}
function showError(err) {
	console.log('Error: ' + err.message);
	}
function motionDetected(event) {
	var acc = event.accelerationIncludingGravity;
	var sDeviceX = (acc.x) ? acc.x.toFixed(2) : '?';
	var sDeviceY = (acc.y) ? acc.y.toFixed(2) : '?';
	var sDeviceZ = (acc.z) ? acc.z.toFixed(2) : '?';
	$('#labelX').text(sDeviceX);
	$('#labelY').text(sDeviceY);
	$('#labelZ').text(sDeviceZ);
	}
function deviceMotion() {
	try {
	   if (!window.DeviceMotionEvent) {
	     throw new Error('device motion not supported.');
	   }
	   window.addEventListener('devicemotion', motionDetected, 
	      false);
	} catch (err) {
	   showError(err);
	}
	}


	
		


//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
 
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
};

/* Check motion */
deviceMotion();


$(document).bind( 'pageinit', init );
$(document).unload( unregister );