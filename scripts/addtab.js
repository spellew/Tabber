var url = "",
  windowdata = {},
  tabId = null,
  windowId = null,
  url = null,
  time = 0.25,
  dial = true;

function onActivation(activeInfo) {
  if ((tabId !== null) && (dial)) {
    // tabId is initially set to run, so after the first switch to a new tab, no new alarm is created.
    chrome.alarms.create(tabId + "+++" + url, {
      delayInMinutes: time,
      periodInMinutes: null
    });
    // This alarm is called whenever a tab is switched to and made active.
  }
  tabId = activeInfo.tabId;
  windowId = activeInfo.windowId;
  chrome.tabs.get(tabId, function(tab) {
    url = tab.url;
  });
  // The values that were initially set to be null are updated with the information from the tab that was just switched to.
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  dial = true;
  // Dial controls whether or not the onActivation function creates an alarm. It is set to true here,
  // so when an alarm is made it is always initially true.
  windowdata = {
    url: alarm.name.split("+++")[0],
    // The first part of the alarm's name is either the url we'll use to create a new tab, or the tab ID number.
    active: true
    // Setting active to true, means the tab we're going to create will be open when we call the create function.
  }
  var other = alarm.name.split("+++")[1]; // This is the other half of the alarm's name.
  dial = false;
  // Dial is set tp false because we're about to create a new tab,
  // and we don't want any new alarms to be created when we activate a new tab.
  chrome.tabs.query({
    currentWindow: true, active: true
    // We're querying all the open chrome tabs, the tab we're looking for is active and in the current Chrome window we have open.
  }, function(tabs) {
    // The callback function is passed an array of tabs that fit our query.
    if (tabs[0].id + "+++" + tabs[0].url !== alarm.name) {
      // There is only one active tab on our current window so we grab the first item of the array.
      // We're checking if the tab we have open is the same tab we created an alarm to open.
      // If so, there's no point going further, the user has already taken note of the tab we created an alarm for.
      if (windowdata.url.match(/[A-z]/g)) {
        // If there is an alphabetic character in the first half of the alarm name, create a tab with the message the user set.
        chrome.tabs.create(windowdata, function() {
          dial = true;
        });
        alert("Message: " + other);
        // We alert the user of the message that they left us and create a new tab.
      } else {
        // Alarms for tabs that have been left alone for a certain amount of time,
        // have only numeric characters in the first part of alarm name, as its the tabID.
        var updateProperties = {
          active: true
        };
        chrome.tabs.update(Number(windowdata.url), updateProperties, function() {
          // We're changing the tab that is active to the one we've gotten from the alarm.
          // We ask the user if they want to close this tab and add it to the queue, to limit the amount of tabs open at once.
          if (confirm("Would you like to close this tab, and add it to the queue?")) {
            chrome.tabs.remove(Number(windowdata.url));
            var msg2 = prompt("Enter a message (optional): ");
            // If true we remove the tab, and ask the user to give us a message.
            chrome.alarms.create(other + "+++" + msg2, {
              delayInMinutes: time,
              periodInMinutes: null
            });
            // We create an alarm, in this case other is the URL of the tab we closed and the message the user left.
            // We know that the if statement is going to notice the first part only has alphabetic characters.
          } else {
            chrome.alarms.create(alarm.name, {
              delayInMinutes: time,
              periodInMinutes: null
            });
            // If the user doesn't want to close the tab now, we set an alarm to remind them to close it later.
          }
        });
      }
    } else {
      dial = true;
      // If the tab we're currently on is the same one the alarm is supposed to move us to,
      // nothing happens and dial is set to true, so the next time a tab is activated there won't be a problem.
    }
  });
});

chrome.tabs.onActivated.addListener(onActivation);
// When a tab is activated, meaning it's been switched to, this function will run.
