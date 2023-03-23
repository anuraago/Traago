document.addEventListener('DOMContentLoaded', function () {
    var urlList = document.getElementById('url-list');
    chrome.storage.local.get(['urls'], function (result) {
        var urls = result.urls || [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i].url;
            var name = urls[i].name;
            var div = document.createElement('div');
            var a = document.createElement('a');
            a.href = url;
            a.textContent = name || url;
            div.appendChild(a);
            urlList.appendChild(div);
        }
    });
});
