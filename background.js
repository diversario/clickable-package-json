function call_linkify(tabId) {
  chrome.tabs.sendMessage(tabId, {}, function() {});
}

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  if (props.status == "complete") {
    call_linkify(tabId)
  }
});

chrome.webNavigation.onCompleted.addListener(function (details) {
  call_linkify(details.tabId)
})