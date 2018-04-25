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

var disableScripts;
var SGXQuote;
var rng = new SecureRandom();

// There is b64toBA from jsbn that does the same
function b64quote2ba( quote ) {
    var res = new Uint8Array(1116);
    bin_quote = atob(quote);
    for( var i=0, strLen = bin_quote.length; i < strLen; i++ ) res[i] = bin_quote.charCodeAt(i);

    return res;
}

function gen_keypair() {
    var curve = getSECCurveByName( "secp256r1" );

    var n = curve.getN();
    var n1 = n.subtract(BigInteger.ONE);

    // Generate a random number in F(n-1) (private key)
    var r = new BigInteger(n.bitLength(), rng);
    r = r.mod(n1).add(BigInteger.ONE);
    // console.log("Private key b");
    // console.log(r.toString(16));

    // Compute g^r - public key
    var G = curve.getG();
    var P = G.multiply(r);

    // P is a point on the curve. Can do P.getX().toBigInteger().toString()
    return {"ecprv": r, "ecpub": P};
}

function compute_shared_key( ecpub, ecprv ) {
    var curve = getSECCurveByName( "secp256r1" );

    return ecpub.multiply(ecprv);
}

function get_ga_from_quote( quote ) {
    var curve = getSECCurveByName( "secp256r1" ).curve;

    var quote_ba = b64quote2ba( quote );
    var dh_ga = quote_ba.slice(48, 432).slice(320, 384)
    var dh_ga_x = dh_ga.slice(0, 32);
    var dh_ga_y = dh_ga.slice(32, 64);

    // Now dh_ga_x and dh_ga_y are coordinates of the point on the curve
    // Create that point
    var ga_p = new ECPointFp(curve,
            curve.fromBigInteger(parseBigInt(BAtohex(dh_ga_x),16)),
            curve.fromBigInteger(parseBigInt(BAtohex(dh_ga_y),16)));

    return ga_p;
}

var onIASResponse = function( xhrState, xhrStatus, xhrResponse ) {
    if( xhrState == XMLHttpRequest.DONE && xhrStatus == 200 ) {
        console.log( "SafeKeeper: the IAS response is 200 OK" );
        // console.log( xhrResponse );
        // make sure xhrResponse is isvQuoteOK

        var ga_bn = get_ga_from_quote( SGXQuote );
        // console.log( "The G^a from the quote is: " );
        // console.log(ga_bn.getX().x.toString(16));
        // console.log(ga_bn.getY().x.toString(16));

        var key_pair = gen_keypair();
        var dh_key = compute_shared_key( ga_bn, key_pair.ecprv );

        var dh_key_str = dh_key.getX().x.toString(16) + dh_key.getY().x.toString(16);
        var gb_str = key_pair.ecpub.getX().x.toString(16) + key_pair.ecpub.getY().x.toString(16);

        chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, function (tabs) {
            if(tabs[0] !== undefined){
                console.log(dh_key_str);
                chrome.tabs.sendMessage(tabs[0].id,
                        {shared_key: dh_key_str, gb: gb_str}, function (response) {});
            }
        });
        return dh_key;
    }
}

var onIncomingHeaders = function( details ) {
    // console.log( "SafeKeeper: onHeaders" );
    if( details.responseHeaders === undefined ) {
        console.warn( "SafeKeeper: no headers in the response" );
        console.log(details);
        return;
    }

    // console.log( "SafeKeeper: headers are.", details.responseHeaders );
    details.responseHeaders.forEach( function(v,i,a) {
      if( v.name == "X-SafeKeeper-SGX-Quote" ) {
        SGXQuote = v.value;
        console.log( "SafeKeeper: verifying quote with IAS" );
        req_body = {"isvQuote": v.value};
        var url = "http://ias.proxy";
        var xhr = new XMLHttpRequest();
        xhr.open( "POST", url, true );
        xhr.onreadystatechange = function() {
            onIASResponse( xhr.readyState, xhr.status, xhr.responseText );
        }
        xhr.send();
      }
    });
}

chrome.webRequest.onHeadersReceived.addListener(
    onIncomingHeaders,
    {urls: ["<all_urls>"]},
    ["responseHeaders", "blocking"]
);

// When we switch from one active tab to another,
// the content script is not injected again.
// So addListner to "activated" event.
chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, function (tabs) {
        if(tabs[0] !== undefined){
            chrome.tabs.sendMessage(tabs[0].id, {check: "SGXEnabled?"}, function (response) {
                if( response === undefined || response.answer === undefined ) {
                    return
                }
                if(response.answer === "SGXEnabled&ProtectedMode") {
                    chrome.browserAction.setIcon({path: 'images/lock_small.png', tabId: tabs[0].id});
                    chrome.browserAction.setPopup({ popup: 'html/supported.html'});
                }
                else if(response.answer === "SGXNotEnabled") { 
                    chrome.browserAction.setIcon({path: 'images/cross_small.png', tabId: tabs[0].id});
                    chrome.browserAction.setPopup({ popup: 'html/not_supported.html'});
                }
                else if(response.answer === "SGXEnabled&NotProtectedMode"){ 
                    chrome.browserAction.setIcon({path: 'images/grey_lock_tiny.png', tabId: tabs[0].id});
                    chrome.browserAction.setPopup({ popup: 'html/supported.html'});
                }
            });
        }
    });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //one side communication, the content script just sends a message about sgx in the beginning
    console.log("SafeKeeper: background.onMessage: type " + request.type +
                ", clicked " + request.clicked);

    if(request.type === "SGXEnabled"){
        console.log("SafeKeeper: sender tab id " + sender.tab.id);
        chrome.browserAction.setIcon({path: 'images/grey_lock_tiny.png', tabId: sender.tab.id});
        chrome.browserAction.setPopup({ popup: 'html/supported.html'});
        //this message is here to dynamically change the state of the tab
    } else if (request.type === "SGXNotEnabled"){
        chrome.browserAction.setIcon({path: 'images/cross_small.png', tabId: sender.tab.id});
        chrome.browserAction.setPopup({ popup: 'html/not_supported.html'});
    }
    else if (request.type === "ProtectedModeOn"){
        console.log("SafeKeeper: turning ProtectedMode on");
        chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, function (tabs) {
            chrome.browserAction.setIcon({path: 'images/lock_small.png', tabId: tabs[0].id});
        });
    }
    else if (request.type === "ProtectedModeOff"){
        chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, function (tabs) {
            chrome.browserAction.setIcon({path: 'images/grey_lock_tiny.png', tabId: tabs[0].id});
        });
    }
    else if (request.clicked){
        chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {inject: true}, function (response) {});
        });
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        disableScripts = storageChange.newValue;
        console.log('SafeKeeper: storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key, namespace,
                    storageChange.oldValue, storageChange.newValue);
    }
});
