chrome.runtime.onInstalled.addListener(function () {
    console.log('Installed');
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === 'getTabUrl') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var url = tabs[0].url;
            sendResponse(url);
        });
        return true;
    }
});
