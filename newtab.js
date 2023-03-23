function displayRecentUrls() {
    chrome.storage.local.get('urls', function (result) {
        if (result.urls && result.urls.length > 0) {
            var recentUrlsList = document.getElementById('recent-urls-list');
            recentUrlsList.innerHTML = '';
            for (var i = 0; i < result.urls.length && i < 5; i++) {
                var url = result.urls[i];
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = url.url;
                a.innerHTML = url.name;
                a.target = '_blank';
                li.appendChild(a);
                recentUrlsList.appendChild(li);
            }
        }
    });
}

function displayBookmarks() {
    chrome.bookmarks.getRecent(10, function (result) {
        console.log(result);
        result = result.slice(0, 6);
        var bookmarksList = document.getElementById('bookmarks-list');
        bookmarksList.innerHTML = '';
        var bookmarks = result.slice(0, 6);
        for (var i = 0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i];
            if (bookmark.children) {
                var folderLi = document.createElement('li');
                folderLi.textContent = bookmark.title;
                bookmarksList.appendChild(folderLi);
                var folderUl = document.createElement('ul');
                folderLi.appendChild(folderUl);
                for (var j = 0; j < bookmark.children.length; j++) {
                    var childBookmark = bookmark.children[j];
                    var childLi = document.createElement('li');
                    var childA = document.createElement('a');
                    childA.href = childBookmark.url;
                    childA.textContent = childBookmark.title;
                    childA.target = '_blank';
                    childLi.appendChild(childA);
                    folderUl.appendChild(childLi);
                }
            } else {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = bookmark.url;
                a.textContent = bookmark.title;
                a.target = '_blank';
                li.appendChild(a);
                bookmarksList.appendChild(li);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    displayRecentUrls();
    displayBookmarks();
});