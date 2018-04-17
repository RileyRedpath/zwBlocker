browser.runtime.onMessage.addListener(onMessage);

browser.notifications.onClicked.addListener(function(notificationId){
  if(notificationId==="zwBlockerWarningNotification"){
    //show with emojis
    browser.tabs.create({ url: 'tabUI.html' },function(tabs){
    }); 
  }/*else if(button==1){
    //show safe version
    browser.runtime.sendMessage({message: "showSelectionSafe"}, function(response) {
    });
  }*/
});

//Firefox can't handle creating too many notifications in a short period of time,
//so I've delayed the creation of the notification and cancel it if there is another selection change
//within a period of time (not sure exactly how short I could make that period)
var queuedNotification;

function onMessage(request, sender, sendResponse) {
  console.log("request recieved: " + request.message);
  if(request.message === "updateBadgeNumber"){
    //this isn't setting the text for each tab id...
    if(request.value<100){
      browser.browserAction.setBadgeText({"text": request.value.toString(), "tabId":sender.tab.id});
    }else{
      browser.browserAction.setBadgeText({"text": "99+", "tabId":sender.tab.id});
    }
  }
  else if(request.message === "warnUserOfZeroWidthChars"){
    if(queuedNotification){
      clearTimeout(queuedNotification);
    }
    queuedNotification = setTimeout(createNotification, 50);
  }
}

function createNotification(){
  console.log("creating notification");
  browser.notifications.create("zwBlockerWarningNotification", {
    type:"basic",
    iconUrl:browser.extension.getURL("logo.png"),
    title:"zwBlocker Warning!",
    message:"A zero-width character has been detected. Show safe version?",
    priority:2,
  });
  console.log("created notification");
}
