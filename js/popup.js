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

document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({clicked : true});
    chrome.tabs.query({'active': true}, function (tabs) {
        console.log("SafeKeeper: tab query url " + tabs[0].url);

        chrome.storage.local.get({userUrls: []}, function(item) {
            console.log("SafeKeeper: storage get tab query url " + tabs[0].url);

            for (var i=0; i < item.userUrls.length; i++) {
                if(item.userUrls[i].URL === tabs[0].url){
                    console.log('SafeKeeper: DOMContentLoaded: URL match found');
                    var toggle = $("input[type='checkbox']")[0];
                    $(toggle).prop('checked', true);
                } else {
                    console.log('SafeKeeper: DOMContentLoaded: URL match not found');
                }
            }
        });
    });

    $("input[type='checkbox']")[0].addEventListener('click', function() {
        if($(this).is(':checked')) {
            var url;
            chrome.tabs.query({'active': true}, function (tabs) {
                url = tabs[0].url;
            });
            chrome.storage.local.get({userUrls: []}, function (result) {
                var userUrls = result.userUrls;
                userUrls.push({URL: url, disableScripts: true});
                chrome.storage.local.set({userUrls: userUrls}, function () {
                    chrome.storage.local.get('userUrls', function (result) {
                        console.log("SafeKeeper: user URLs " + result.userUrls)
                    });
                });
            });

        } else {
            chrome.tabs.query({'active': true}, function (tabs) {
                chrome.storage.local.get({userUrls: []}, function(items) {
                    for (var i=0; i < items.userUrls.length; i++) {
                        if(items.userUrls[i].URL === tabs[0].url){
                            items.userUrls.splice(i, 1);
                            chrome.storage.local.set(items, function() {});
                        }
                    }
                });
            });
        }
    });
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    console.log("SafeKeeper: in popup onMessageListener");
    if(request.type === "ProtectedModeOn"){
        document.getElementById("lock-icon").src = "/images/lock_huge.png";
        // console.log($("input[type='checkbox']").length);
    } else if(request.type === "ProtectedModeOff"){
        document.getElementById("lock-icon").src = "/images/grey_lock_huge.png";
        document.getElementById("content-text").textContent = "You can click the icon again to display the highlighted input fields";
    }
});
