function displayRecentUrls() {
    chrome.storage.local.get('urls', function (result) {
        if (result.urls && result.urls.length > 0) {
            var recentUrlsList = document.getElementById('recent-urls-list');
            recentUrlsList.innerHTML = '';
            for (var i = 0; i < result.urls.length; i++) {
                var url = result.urls[i];
                const node = document.createElement("div");
                const link = (url.url.indexOf('://') === -1) ? 'https://' + url.url : url.url;
                var html = `
                <a href="${link}" target="_blank">
                    <img width="20px" height="20px" src="../images/newtab.svg" alt="">
                    <div class="font-medium">${url.name}</div>
                </a>`;
                node.innerHTML = html;
                recentUrlsList.appendChild(node);
            }
        }
    });
}

function displayBookmarks() {
    chrome.bookmarks.getRecent(10, function (result) {
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

function displayNotes() {
    chrome.storage.local.get('notes', function (result) {
        if (result.notes && result.notes.length > 0) {
            var notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            for (var i = 0; i < result.notes.length; i++) {
                var note = result.notes[i];
                const node = document.createElement("div");
                var html = `
                <div>
                    <pre class="font-medium">${note.note}</pre>
                </div>`;
                node.innerHTML = html;
                notesList.appendChild(node);
            }
        }
    });
}

function addTofavorites(id) {
    // console.log(id);
    const stories = JSON.parse(localStorage.stories);
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['favStories'], function (result) {
            if (result.favStories.findIndex(s => s.id == id) == -1) {
                const story = stories.find(s => s.id == id);
                var favStories = result.favStories || [];
                favStories.unshift({ ...story });
                chrome.storage.local.set({ favStories: favStories }, () => resolve());
            } else {
                reject("already added");
            }
        });
    })
}

const storiesDiv = document.querySelector('#stories');

const addStories = (stories) => {
    for (let index in stories) {
        const story = stories[index];
        const node = document.createElement("div");

        const aLink = document.createElement("a");
        aLink.innerHTML = `
        ${story.cover_image != null ? `<img width="20%" src="${story.cover_image}" />` : ""}
        ${story.title}
        `;
        const favBtn = document.createElement("button");
        favBtn.setAttribute("data-id", story.id);
        favBtn.innerHTML = `<span data-id="${story.id}" class="material-symbols-outlined">${story.id} - favorite</span>`;
        favBtn.addEventListener("click", function (e) {
            addTofavorites(e.target.getAttribute('data-id')).then(() => {
                e.target.innerHTML = `<span data-id="${story.id}" class="material-symbols-outlined">${story.id} - unfavorite</span>`;
            }).catch(e => console.log(e))
        });
        node.appendChild(aLink);
        node.appendChild(favBtn);
        node.appendChild(document.createElement('hr'));
        storiesDiv.appendChild(node);
    }
}


var addQLBtn = document.getElementById('addQL');
var urlInput = document.getElementById('urlInput');
var nameInput = document.getElementById('nameInput');
addQLBtn.addEventListener('click', function () {
    var url = urlInput.value;
    var name = nameInput.value;
    chrome.storage.local.get(['urls'], function (result) {
        var urls = result.urls || [];
        urls.unshift({ url: url, name: name, icon: "../images/newtab.svg" });
        chrome.storage.local.set({ urls: urls });
    });
});

var addNoteBtn = document.getElementById('addNote');
var noteInput = document.getElementById('noteInput');
addNoteBtn.addEventListener('click', function () {
    var note = noteInput.value;
    chrome.storage.local.get(['notes'], function (result) {
        var notes = result.notes || [];
        notes.unshift({ note: note, addedTime: Date.now() });
        console.log({ note: note, addedTime: Date.now() });
        chrome.storage.local.set({ notes: notes });
    });
});


if (localStorage.lastFetch && localStorage.stories && (new Date() - localStorage.lastFetch) < (1000 * 60 * 60)) {
    addStories(JSON.parse(localStorage.stories));
} else {
    if (localStorage.stories) {
        addStories(JSON.parse(localStorage.stories));
    }

    fetch('https://dev.to/api/articles', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (!localStorage.stories) {
                addStories(data);
            }

            localStorage.setItem("stories", JSON.stringify(data));
            localStorage.setItem("lastFetch", new Date() - 1);
        });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == 'local' && changes['urls']) displayRecentUrls();
    if (areaName == 'local' && changes['notes']) displayNotes();
})

document.addEventListener('DOMContentLoaded', function () {
    displayRecentUrls();
    displayBookmarks();
    displayNotes();
});