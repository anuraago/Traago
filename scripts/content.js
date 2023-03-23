chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request["type"] == 'getFaviconSrc') {
            var faviconTag = document.querySelector('[rel="shortcut icon"]');
            if (faviconTag == null) {
                faviconTag = document.querySelector('[rel="icon"]');
            }
            imgSrc = faviconTag.attributes['href'].value;
            console.log(imgSrc);
            if (!imgSrc.startsWith("https"))
                imgSrc = window.location.origin + imgSrc
            sendResponse(imgSrc);// this is how you send message to popup

        }
        return true; // this make sure sendResponse will work asynchronously

    }
);