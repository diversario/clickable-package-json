function call_linkify(tabId) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url

    chrome.tabs.sendMessage(tabId, {url: url}, function() {});
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  if (props.status == "complete") {
    call_linkify(tabId)
  }
});

chrome.webNavigation.onCompleted.addListener(function (details) {
  call_linkify(details.tabId)
})