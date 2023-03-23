document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#go-to-options').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    var urlInput = document.getElementById('url-input');
    var tabIconInput = document.getElementById('tab-icon');
    var favicon_image = document.getElementById('favicon_image');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getFaviconSrc" }, function (imgSrc) {
            favicon_image.src = imgSrc;
            tabIconInput.value = imgSrc;
        });
        urlInput.value = tabs[0].url;
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
        var nameInput = document.getElementById('name-input');
        var url = urlInput.value;
        var name = nameInput.value;
        var icon = tabIconInput.value;
        chrome.storage.local.get(['urls'], function (result) {
            var urls = result.urls || [];
            urls.unshift({ url: url, name: name, icon: icon });
            chrome.storage.local.set({ urls: urls }, function () {
                var listItem = document.createElement('li');
                var link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = name;
                listItem.appendChild(link);
                recentUrlsList.insertBefore(listItem, recentUrlsList.firstChild);
                chrome.tabs.sendMessage(tabs[0].id, { type: "updateUrlList" });
            });
        });
    });
});
