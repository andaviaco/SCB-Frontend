'use strict';
const DEBUG = true;
var showDefaultExplanation = true;
var hoverToOpen = true;
var LinkTimeout;

function prepare() {
    chrome.storage.local.get('showDefaultExplanation', (items) => {
        if (items.hasOwnProperty('showDefaultExplanation'))
            showDefaultExplanation = items.showDefaultExplanation;
    });

    chrome.storage.local.get('hoverToOpen', (items) => {
        if (items.hasOwnProperty('hoverToOpen'))
            hoverToOpen = items.hoverToOpen;
    });
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `.__clickbait_text {
display: inline-block;
margin-left: 1em;
}

._42nr > span::before {
content: "" !important;
}

._4x9_, ._a7s ._524d a, ._a7s ._50u4, ._1ysv {
padding: 0px !important;
}

.__clickbait_btn {
margin-right: 5px;
}

._zw3 {
    padding: 8px 4px 4px 0 !important;
}

._3m9g {
    padding-left: 0 !important;
}


.st0 {
        fill: #4B4F56;
        }

.SCBcards {
    width: 500px;
    height: 420px;
    position: absolute;
    z-index: 7;
    background-color: white;
    overflow: hidden;
    }

    svg {
        transform: translate(0, 2px);
    }

    .__clickbait_reveal_line {
        padding: 4px;
        padding-left: 8px;
    margin-top: 11px;
    margin-bottom: 11px;
    margin-left: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15) inset, 0 1px 4px rgba(0, 0, 0, .1);
    }

`;
    document.head.appendChild(css);

    // Set the default color if it has not yet been set.
    chrome.storage.local.get('selectedColor', function (items) {
        if (items.hasOwnProperty('selectedColor')) return;
        // If there is no setting for selectedColor - i.e. the first time popup.html is opened:
        chrome.storage.local.set({ 'selectedColor': "#3b5999" }, function () {
            console.log("#3b5999" + " saved to default.");
        });
    });
}

// counter that increments to generate a new ID
var uniqueIds = 1;

function loop() {
    var allLinks = document.querySelectorAll('a._52c6');
    for (var i = 0; i < allLinks.length; i++) {
        var node = allLinks.item(i);
        if (!node.classList.contains("__clickbait_link")) {
            node.classList.add("__clickbait_link");

            var realUrl = decodeURIComponent(node.href);
            if (realUrl.indexOf('l.php?u=') != -1) {
                realUrl = realUrl.substring(realUrl.indexOf('l.php?u=') + 'l.php?u='.length);
                realUrl = realUrl.substring(0, realUrl.indexOf('&h='));
            }

            var spanContainer2 = node;
            while (!spanContainer2.classList.contains('fbUserContent')) {
                spanContainer2 = spanContainer2.parentNode;
            }

            var RevealLine;
            if (spanContainer2.childNodes[0].childNodes[1].classList.length == 0) {
                (spanContainer2.childNodes[0].childNodes[1].childNodes[3]) ? RevealLine = spanContainer2.childNodes[0].childNodes[1].childNodes[3] : RevealLine = spanContainer2.childNodes[0].childNodes[1].appendChild(document.createElement('div'));
            } else {
                (spanContainer2.childNodes[0].childNodes[2].childNodes[3] && spanContainer2.childNodes[0].childNodes[2].childNodes[3].innerHTML == "") ? RevealLine = spanContainer2.childNodes[0].childNodes[2].childNodes[4] : RevealLine = spanContainer2.childNodes[0].childNodes[2].appendChild(document.createElement('div'));
            }
            var cardForm = spanContainer2.childNodes[1].childNodes[0];
            var actionBar = cardForm.childNodes[3];
            var hasBoostPostBar = false;
            if (actionBar.childElementCount > 1)
                hasBoostPostBar = true;
            for (var j = 0; j < actionBar.childNodes.length; j++) {
                if (actionBar.childNodes[j].classList.contains('_37uu')) {
                    actionBar = actionBar.childNodes[j];
                }
            }

            actionBar = actionBar.childNodes[0].childNodes[0];
            var hasLikeCountBar = false;
            if (actionBar.childElementCount > 1)
                hasLikeCountBar = true;
            for (var j = 0; j < actionBar.childNodes.length; j++) {
                if (actionBar.childNodes[j].classList.contains('clearfix')) {
                    actionBar = actionBar.childNodes[j];
                }
            }
            for (j = 0; j < actionBar.childNodes.length; j++) {
                if (actionBar.childNodes[j].classList.contains('_524d')) {
                    actionBar = actionBar.childNodes[j];
                }
            }
            if (showDefaultExplanation)
                revealLine(RevealLine, realUrl, uniqueIds);

            actionBar = actionBar.childNodes[0];
            var CBButtonSpan = document.createElement('span');
            CBButtonSpan.appendChild(document.createElement('a'));
            CBButtonSpan.classList.add('SCBButtonSpan');

            var CBButtonLink = CBButtonSpan.childNodes[0];
            CBButtonLink.classList.add('__clickbait_btn');
            CBButtonLink.href = '#';
            CBButtonLink.setAttribute('data-url', realUrl);
            CBButtonLink.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="5px" width="16px" height="16px" viewBox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve"><g id="loading"><g><path class="st0" d="M20.5,4c-1.1,0.1-1.9,1-1.8,2.1l0.5,7.6c0.1,1.1,1,1.9,2.1,1.8c1.1-0.1,1.9-1,1.8-2.1l-0.5-7.6C22.5,4.7,21.6,3.9,20.5,4z"/><path class="st0" d="M11.6,8.9c-0.7-0.8-2-1-2.8-0.2s-0.9,2-0.2,2.8l4.9,5.8c0.4,0.5,1.1,0.7,1.7,0.7c0.4,0,0.8-0.2,1.1-0.5c0.8-0.7,1-2,0.2-2.8L11.6,8.9z"/><path class="st0" d="M3.6,21.7l7.4,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.8-0.1,1.6-0.6,1.8-1.5c0.3-1.1-0.4-2.1-1.4-2.4l-7.4-1.8c-1.1-0.3-2.1,0.4-2.4,1.5C1.9,20.4,2.6,21.5,3.6,21.7z"/><path class="st0" d="M13.8,27.5c-0.4-1-1.6-1.5-2.6-1.1l-7.1,2.9c-1,0.4-1.5,1.6-1.1,2.6c0.3,0.8,1.2,1.3,2,1.2c0.2,0,0.4-0.1,0.6-0.1l7.1-2.9C13.7,29.7,14.2,28.5,13.8,27.5z"/><path class="st0" d="M26.5,16.8c0.4,0.2,0.8,0.3,1.2,0.3c0.6,0,1.2-0.4,1.6-0.9l4-6.5c0.6-0.9,0.3-2.2-0.6-2.8c-0.9-0.6-2.2-0.3-2.8,0.6l-4,6.5C25.3,15,25.6,16.3,26.5,16.8z"/></g></g><g id="arrow_cursor"><g id="_x35_0-arrrow-cursor.png"><g><path class="st0" d="M50.3,40.5L65,31.6c0,0,0.3-0.2,0.4-0.3c0.9-0.9,0.9-2.3,0-3.1c-0.3-0.3-0.7-0.5-1.1-0.6l0,0c-4.2-1-43.7-8.2-43.7-8.2l0,0c-0.7-0.2-1.5,0.1-2,0.6c-0.6,0.6-0.8,1.3-0.6,2l0,0L24.6,53l3.1,12.1c0.1,0.4,0.3,0.9,0.6,1.2c0.9,0.9,2.3,0.9,3.1,0c0.1-0.2,0.4-0.5,0.4-0.5c0,0,9.2-15.9,9.2-15.9L60.1,69l9.4-9.4L50.3,40.5z"/></g></g></g></svg><span style="margin-left: 6px;">#SCB</span>';
            CBButtonLink.id = `__clickbait_btn_${(uniqueIds)}`;
            CBButtonLink.addEventListener('click', (e) => {
                if (!CBButtonLink.classList.contains('clicked')) {
                    CBButtonLink.classList.add('clicked');
                } else {
                    CBButtonLink.classList.remove('clicked');
                    document.getElementById("SCBinterface").parentNode.removeChild(document.getElementById("SCBinterface"));
                    return;
                }
                if (CBButtonLink.classList.contains('hovered')) {
                    CBButtonLink.classList.remove('hovered');
                    return;
                }
                displaySCBContainer(e, false);
            });
            if (hoverToOpen) {
                CBButtonLink.addEventListener('mouseenter', (e) => {
                    if (!CBButtonLink.classList.contains('clicked')) {
                        CBButtonLink.classList.add('hovered');
                        displaySCBContainer(e, true);
                    }
                });
                CBButtonLink.addEventListener('mouseleave', () => {
                    LinkTimeout = setTimeout(() => {
                        if (CBButtonLink.classList.contains('hovered'))
                            document.getElementById("SCBinterface").parentNode.removeChild(document.getElementById("SCBinterface"));
                        CBButtonLink.classList.remove('hovered');
                    }, 500);
                });
            }
            actionBar.appendChild(CBButtonSpan);
            uniqueIds++;

            // add MoveTopComment handler

            actionBar.childNodes[0].addEventListener('click', (e) => {
                moveTopComment(e);
            });

            actionBar.childNodes[1].addEventListener('click', (e) => {
                moveTopComment(e);
            });

            actionBar.childNodes[2].addEventListener('click', (e) => {
                moveTopComment(e);
            });

            // END add MoveTopComment handler

            var FBPageLink;
            if (spanContainer2.childNodes[0].childNodes[1].classList.length == 0) {
                FBPageLink = spanContainer2.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].href;
            } else {
                FBPageLink = spanContainer2.childNodes[0].childNodes[2].childNodes[0].childNodes[0].childNodes[0].href;
            }
        }
    }
}

function init() {
    prepare();
    document.onscroll = loop;
    loop();
}

function moveTopComment(e) {
    var targ;
    if (!e) e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
    var TopComment = targ.parentNode.parentNode.parentNode.parentNode.parentNode;
    console.log(TopComment);
    window.setTimeout(function () {
        if (TopComment.childNodes[0].classList.contains('_3m9g')) {
            TopComment = TopComment.childNodes[0];
            var temp = TopComment.parentNode;
            temp.removeChild(TopComment);
            temp.appendChild(TopComment);
        }
    }, 200);
}

function displaySCBContainer(e, hover) {
    var targ;
    if (!e) e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
    if (targ.classList.contains('SCBButtonSpan')) {
        targ = targ.childNodes[0];
    }
    while (!targ.classList.contains('__clickbait_btn')) {
        targ = targ.parentNode;
    }
    var cardForm = targ;
    while (!cardForm.classList.contains('fbUserContent')) {
        cardForm = cardForm.parentNode;
    }
    cardForm = cardForm.childNodes[1].childNodes[0];
    var postWidth = cardForm.offsetWidth;

    if (document.getElementById("SCBinterface")) {
        for (var i = 0; i < cardForm.childNodes.length; i++) {
            if (cardForm.childNodes[i].id == "SCBinterface") {
                cardForm.removeChild(cardForm.childNodes[i]);
                targ.classList.remove('clicked');
                return;
            }
        }
        document.getElementById("SCBinterface").parentNode.removeChild(document.getElementById("SCBinterface"));
    }

    var cardDiv = document.createElement('div');
    cardDiv.classList.add('SCBcards');
    cardDiv.style.left = "0px";
    cardDiv.style.width = postWidth + "px";
    cardDiv.id = "SCBinterface";
    cardDiv.style.backgroundColor = "#99ccff";

    var card = document.createElement('iframe');
    card.style.width = postWidth + "px";
    card.style.top = "0px";
    card.frameBorder = "0";
    card.classList.add("SCBcards");
    card.style.left = "0px";
    card.id = "SCBinterfaceIFRAME"
    card.setAttribute('scrolling', 'no');
    card.src = chrome.runtime.getURL('scb-container/SCB-Container.html') + '?url=' + encodeURIComponent(targ.getAttribute('data-url'));

    cardForm.insertBefore(cardDiv, cardForm.childNodes[4]);
    cardDiv.appendChild(card);

    card.addEventListener('mouseenter', (e) => {
        if (LinkTimeout) {
            var SCBButtonLink = document.getElementById('SCBinterface').parentNode.childNodes[0];
            SCBButtonLink.classList.remove('hovered');
            SCBButtonLink.classList.add('clicked');
            clearTimeout(LinkTimeout);
            LinkTimeout = null;
        }
    });
}

function getURLParameter(name) {
    var value = decodeURIComponent((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, ""])[1]);
    return (value !== 'null') ? value : false;
}

function revealLine(element, realURL, id) {
    //var userID = chrome.storage.local.get("userID");
    realURL = realURL.substring(0, realURL.indexOf('?'));
    element.classList.add('_5pbx');
    element.classList.add('__clickbait_reveal_line');
    element.id = '__clickbait_reveal_line_' + id;
    if (!DEBUG) {
        var xhr = new XMLHttpRequest();
        var content = "";
        xhr.open('POST', 'https://server.stopclickbait.com/getTopComment.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                content = xhr.responseText;
                element.innerText = content;
            }
        }
        xhr.send("url=" + encodeURIComponent(realURL) + "&userid=" + userID);
    } else {
        element.innerText = "This is a StopClickBait test.";
    }
}

init();
