chrome.windows.getAll().then((windows) => {
    console.log(windows);
});
chrome.tabs.query({ currentWindow: true }).then((tabs) => {
    console.log(tabs);
});

