/* Copyright (c) 2018 Aalto University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var click = false;

// If testing is needed, set to "password", for example
// and include an input field named "password" into HTML
var sgx_input = '';

// Is SGXEnabled meta field provided
var sgx_enabled = false;

var protected_mode = false;
var meta_inserted = false;
var disableScripts = false;

var dh_key = '';
var gb_key = '';

/*
chrome.storage.sync.get("disableScripts", function(item){
    if(item.disableScripts === "yes"){
        disableScripts = true;
        console.log("SafeKeeper: disableScripts is 'yes'");
    } else if(item.disableScripts === "no"){
        //$('meta[http-equiv="Content-Security-Policy"]').remove();
        disableScripts = false;
        console.log("SafeKeeper: disableScripts is 'no'");
    }
});
*/

chrome.storage.local.get({userUrls: []}, function(items) {
    for (var i=0; i < items.userUrls.length; i++) {
        if(items.userUrls[i].URL === location.href){ 
            disableScripts = true;
            console.log("SafeKeeper: Content script: YES");
            break;
        }
    }
});

function nodeInserted(event) {
    if(meta_inserted == false && disableScripts){
        meta_inserted = true;
        var element = document.createElement('meta');
        element.setAttribute('http-equiv', 'Content-Security-Policy');
        element.content = "script-src none";
        document.getElementsByTagName('head')[0].appendChild(element);
    }
};

document.addEventListener('DOMNodeInserted', nodeInserted);

window.addEventListener("resize", function() {
  if(protected_mode == true){
    var $clones = $('[name="clone"]');
    var $allPasswordBoxes = $("input[type='" + sgx_input + "']");
    for(i = 0; i < $clones.length; i++){
	  $($clones[i]).tooltip("close");
	  $($clones[i]).css({
		'top': $($allPasswordBoxes[i]).offset().top,
		'left': $($allPasswordBoxes[i]).offset().left, 
		'width': $($allPasswordBoxes[i]).outerWidth(),
		'height': $($allPasswordBoxes[i]).outerHeight()
		});
    // Set collision to none to avoid changing the side of input field on resize
	$($clones[i]).tooltip({ position: {collision: "none", my: "left+10 center", at: "right center", using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }}, content: "This input field will be encrypted before leaving your computer", offset: [-2, 10], opacity: 0.8});
	   $($clones[i]).tooltip("open");
    }
  }
}, false);

function hexstr2ba( hex ) {
    var res = new Uint8Array(64);
    for( var i=0, strlen = hex.length; i < strlen; i++ ) {
        res[i] = parseInt(hex[i], 16);
    }

    return res;
}

function ba2hex( ba ) {
    var res = "";
    for( var i=0, len = ba.length; i < len; i++ ) {
        res += ba[i].toString(16);
    }

    return res;
}

// Derive the key from the shared DH key
function derive_key( dh_key ) {
    var sha256 = new sjcl.hash.sha256();
    var x_hex = dh_key.slice(0, 64);

    for(var i = 0; i < 32; i++) {
      sha256.update( x_hex[62 - 2*i] );
      sha256.update( x_hex[63 - 2*i] );
    }

    var key = sha256.finalize();
    //var key = sjcl.hash.sha256.hash( hexstr2ba(dh_key) );
    console.log("In derive_key dh_key(hex): " + dh_key);
    console.log("In derive_key sha256(dh_key.x_hex_little): " + key);
    var res = new Uint8Array(32);
    for(var i = 0; i < 8; i++) {
        var uk = key[i] >>> 0;
        res[4*i + 0] = uk >> 24;
        res[4*i + 1] = uk >> 16;
        res[4*i + 2] = uk >> 8;
        res[4*i + 3] = uk;
    }
    return res.slice(0,16);
}

// Encrypt the password before submitting
function encrypt_submit() {
    console.log("Submit called");

    try {
        var sk = derive_key( dh_key );
        console.log("Derived key: " + sk);
        var aesCtr = new aesjs.ModeOfOperation.ctr(sk, new aesjs.Counter(1));

        var $allPasswordBoxes = $("input[type='" + sgx_input + "']").not('[name="clone"]');
        for(i = 0; i < $allPasswordBoxes.length; i++){
            var password = $($allPasswordBoxes[i]).val();
            var textBytes = aesjs.utils.utf8.toBytes(password);
            var encrypted = aesCtr.encrypt(textBytes);
            console.log("Encrypted: " + encrypted);
            console.log("Encrypted(hex): " + ba2hex(encrypted));
            console.log("Encrypted(hex): " + aesjs.utils.hex.fromBytes(encrypted));
            $($allPasswordBoxes[i]).val(ba2hex(encrypted) + gb_key);
        }
        // console.log(encrypted);
    } catch( err ) {
        console.log(err);
    }

    return true;
    // return false;
}

// Tried window.onload and DOMContentLoaded.
// They are not triggered fast enough for us.
$(document).ready(function() {
    // Check if sgx is enabled and send a message to background.js

    var counter = 0;
    var metas = document.getElementsByTagName('meta');
    console.log("SafeKeeper: before checking for SGX Enabled meta tag");
    for (var i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("name") == "SGXEnabled") { 
            sgx_input = metas[i].getAttribute("content");
            counter = counter + 1;
        }
    }

    //counter= counter + 1; // Uncomment to test non-SGX websites
    if(counter !== 0){ sgx_enabled = true; chrome.runtime.sendMessage({type: "SGXEnabled"});}
    else{sgx_enabled = false; chrome.runtime.sendMessage({type: "SGXNotEnabled"});}

    //chrome.runtime.sendMessage({type: "loaded"});
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        if(request.inject) {
            if(click == true) {
                chrome.runtime.sendMessage({type: "ProtectedModeOff"});
                protected_mode = false;
                var $allPasswordBoxes = $("input[type='" + sgx_input + "']");
                $("body > *").css("opacity", '1');
                var $clones = $('[name="clone"]');
                //var $tooltips = $(".tooltip");
                for(i = 0; i < $clones.length; i++){
                    //$($allPasswordBoxes[i]).val($($clones[i]).val());
                    $($clones[i]).remove();
                    //$($tooltips[i]).remove();
                }
                for(i = 0; i < $allPasswordBoxes.length; i++){
                    $($allPasswordBoxes[i]).css({ 'border': '' });
                }
                click = false;
            } else {
                chrome.runtime.sendMessage({type: "ProtectedModeOn"});
                protected_mode = true;
                console.log("SafeKeeper: protected mode is on for input of type " + sgx_input);
                var $allPasswordBoxes = $("input[type='" + sgx_input + "']");
                var $arr = $($allPasswordBoxes[0]).parents('div');
                var $parent_form = $($allPasswordBoxes[0]).closest('form');
                $parent_form.submit(encrypt_submit);

                for(i = 0; i < $arr.length; i++) {
                    console.log("SafeKeeper: parent " + i + " " + $arr[i]);
                }

                for(i = 0; i < $allPasswordBoxes.length; i++) {

                    $($allPasswordBoxes[i]).css({ 'opacity': '1' });

                    var $clone = $($allPasswordBoxes[i]).clone();
                    // Attribute "name" is not unique, "id" is,
                    // So we can properly delete other inputs
                    // with the same name (with "id" it only deleted first one)
                    $clone.attr("name","clone");	    
                    /*$($clone).css({
                        // Wrapped in $(), because $allPasswordBoxes[i] is DOM element
                        'width': $($allPasswordBoxes[i]).parent().width(),
                        'height': $($allPasswordBoxes[i]).parent().height(),
                        'position': 'absolute',
                        'top': $($allPasswordBoxes[i]).parent().offset().top,
                        'left': $($allPasswordBoxes[i]).parent().offset().left
                    });*/

                    $($clone).css({
                        // $(window).width() * 100 + '%'
                        // Wrapped in $(), because $allPasswordBoxes[i] is DOM element 
                        'width': $($allPasswordBoxes[i]).outerWidth(),
                        //  $(window).height() * 100 + '%',
                        'height': $($allPasswordBoxes[i]).outerHeight(),
                        'border': 'green solid 2px',
                        'position': 'absolute',
                        // Remove inherited padding and margins
                        // since we copy everything with outer functions
                        'padding': '0px 0px',
                        'margin': '0px 0px',
                        'top': $($allPasswordBoxes[i]).offset().top,
                        'left': $($allPasswordBoxes[i]).offset().left
                    });
                    // Added for tooltipl ui library, for content value
                    $($clone).attr('title', '');

                    $('body').append($($clone));
                    $($clone).tooltip({ position: {collision: "none", my: "left+10 center", at: "right center", using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" ).addClass( feedback.vertical )
                                    .addClass( feedback.horizontal )
                                    .appendTo( this );
                    }}, content: "This input field will be encrypted before leaving your computer", offset: [-2, 10], opacity: 0.8});
                    $($clone).tooltip("open");

                    // KK: I had to put it inside variable in order to make
                    // clone attached to the parent element
	                $('[name="clone"]').keyup(function() {
                        var $pass = $("input[type='" + sgx_input + "']").not('[name="clone"]');
                        var $clones = $('[name="clone"]');

                        for(i = 0; i < $clones.length; i++){
                            if($($clones[i]).attr('id') === $(this).attr('id')){
                                $($pass[i]).val($(this).val());
                            }
                        }
                    });

                    $("body > *").not('[name="clone"]').css("opacity", '0.5');
                    click = true;
                }
            }
        } else if (request.check === "SGXEnabled?") {
            if(sgx_enabled == false) {
                sendResponse({answer: "SGXNotEnabled"});
            } else if(sgx_enabled == true && protected_mode == true) {
                sendResponse({answer: "SGXEnabled&ProtectedMode"});
            } else if(sgx_enabled == true && protected_mode == false) {
                sendResponse({answer: "SGXEnabled&NotProtectedMode"});
            }
        } else if (request.shared_key !== undefined) {
            console.log("SafeKeeper: got the shared key");
            dh_key = request.shared_key;
            gb_key = request.gb;
            console.log("Shared key: " + dh_key);
            console.log("G^b: " + gb_key);
        }
    });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    //location.reload();
});
