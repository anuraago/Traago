document.addEventListener('DOMContentLoaded', function () {

    // add eventlistener to favicon_image tag to set on error function

    var favicon_image = document.getElementById('favicon_image');
    favicon_image.onerror = function (e) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "getFaviconSrc" }, function (imgSrc) {
                faviconName = imgSrc.src.split('/').pop();
                if (e.target.src == imgSrc.src) {
                    console.log("Error loading favicon");
                    document.getElementById('tab-icon').value = imgSrc.url + faviconName;
                    e.target.src = imgSrc.url + faviconName;
                }
                else if (e.target.src == imgSrc.url + faviconName) {
                    console.log("Error loading favicon twice");
                    e.target.src = imgSrc.url + "favicon.ico";
                }
                else {
                    console.log("Error loading favicon");
                    e.target.src = "../images/globe.png";
                }
            });
        });
    }

    document.querySelector('#go-to-options').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    var urlInput = document.getElementById('url-input');
    var nameInput = document.getElementById('name-input');
    var tabIconInput = document.getElementById('tab-icon');
    // var favicon_image = document.getElementById('favicon_image');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getFaviconSrc" }, function (imgSrc) {
            console.log(imgSrc);
            favicon_image.src = imgSrc.src;
            tabIconInput.value = imgSrc.src;
        });
        urlInput.value = tabs[0].url;
        nameInput.value = tabs[0].title;
    });

    var recentUrlsList = document.getElementById('recent-urls-list');
    chrome.storage.local.get(['urls'], function (result) {
        var urls = result.urls || [];
        for (var i = 0; i < Math.min(urls.length, 5); i++) {
            var url = urls[i];
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = url.url;
            link.target = '_blank';
            link.textContent = url.name || url.url;
            listItem.appendChild(link);
            recentUrlsList.appendChild(listItem);
        }
    });

    var saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', function () {
        var url = urlInput.value;
        var name = nameInput.value;
        var icon = tabIconInput.value;
        chrome.storage.local.get(['urls'], function (result) {
            var urls = result.urls || [];
            // create and id for the url with QL prefix
            var id = "QL" + Date.now();
            urls.unshift({ id: id, url: url, name: name, icon: icon });
            chrome.storage.local.set({ urls: urls }, function () {
                var listItem = document.createElement('li');
                var link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = name;
                listItem.appendChild(link);
                recentUrlsList.insertBefore(listItem, recentUrlsList.firstChild);
                // chrome.tabs.sendMessage(tabs[0].id, { type: "updateUrlList" });
            });
        });
    });
});


// function to convert image url to base64 using filereader
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
