chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        if (request["type"] == 'getFaviconSrc') {
            try {
                var faviconTag = document.querySelector('[rel="shortcut icon"]');
                if (faviconTag == null) {
                    faviconTag = document.querySelector('[rel="icon"]');
                }
                imgSrc = faviconTag.attributes['href'].value;
            } catch (error) {
                imgSrc = window.location.origin + "/favicon.ico";
                sendResponse({ src: imgSrc, url: window.location.href });
                return true;
            }
            if (imgSrc.startsWith("data:")) {
                var faviconTag = document.querySelectorAll('[rel="shortcut icon"]');
                if (faviconTag.length == 0) {
                    imgSrc = window.location.origin + "/favicon.ico";
                    sendResponse({ src: imgSrc, url: window.location.href });
                    return true;
                }
                else {
                    imgSrc = faviconTag[1].attributes['href'].value;
                    sendResponse({ src: imgSrc, url: window.location.href });
                    return true;
                }

            }
            else
                if (!imgSrc.startsWith("https") && !imgSrc.startsWith("http")) {
                    if (imgSrc.startsWith("//")) {
                        imgSrc = window.location.protocol + imgSrc
                    }
                    else if (imgSrc.startsWith("/"))
                        imgSrc = window.location.origin + imgSrc
                    else
                        imgSrc = window.location.origin + "/" + imgSrc
                }
            sendResponse({ src: imgSrc, url: window.location.href });// this is how you send message to popup

        }
        return true; // this make sure sendResponse will work asynchronously

    }
);