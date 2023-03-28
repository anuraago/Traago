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
        var notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        if (result.notes && result.notes.length > 0) {
            for (var i = 0; i < result.notes.length; i++) {
                var note = result.notes[i];
                const node = document.createElement("div");

                const content = document.createElement("div");
                content.className = "note_content";
                content.innerHTML = note.note;

                const actions = document.createElement("div");
                actions.className = "note_actions";
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "note_delete hoverShadow";
                deleteBtn.setAttribute("data-delete", note.id);
                deleteBtn.innerHTML = `<img src="../images/trash.svg" alt="">Delete`;
                deleteBtn.ariaLabel = "Save Button";
                deleteBtn.addEventListener("click", (e) => deleteNote(e));

                const copyBtn = document.createElement("button");
                copyBtn.className = "note_copy hoverShadow";
                copyBtn.innerHTML = `<img src="../images/copy.svg" alt="">Copy`;
                copyBtn.setAttribute("data-copy", note.id);
                copyBtn.ariaLabel = "Save Button";
                copyBtn.addEventListener("click", (e) => copyToClipboard(e));

                actions.appendChild(copyBtn);
                actions.appendChild(deleteBtn);

                node.className = "note";
                node.appendChild(content);
                node.appendChild(actions);
                notesList.appendChild(node);
            }
        }
    });
}

function copyToClipboard(e) {
    chrome.storage.local.get(['notes'], function (result) {
        const id = e.target.getAttribute("data-copy");
        const note = result.notes.find(s => s.id == id);
        if (note) {
            navigator.clipboard.writeText(note.note);
        }
    });
}
function deleteNote(e) {
    chrome.storage.local.get(['notes'], function (result) {
        const id = e.target.getAttribute("data-delete");
        const noteidx = result.notes.findIndex(s => s.id == id);
        if (noteidx != -1) {
            var notes = result.notes || [];
            notes.splice(noteidx, 1);
            chrome.storage.local.set({ notes: notes });
        }
    });
}

function addTofavorites(id) {
    const stories = JSON.parse(localStorage.stories);
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['favStories'], function (result) {
            if (result.favStories.findIndex(s => s.id == id) == -1) {
                const story = stories.find(s => s.id == id);
                var favStories = result.favStories || [];
                favStories.unshift({ ...story });
                document.querySelector(`svg[data-id="${id}"]`).setAttribute("fill", "#e96c79")
                chrome.storage.local.set({ favStories: favStories }, () => resolve());

            } else {
                reject("already added");
            }
        });
    })
}

const storiesDiv = document.querySelector('#stories');

const addStories = async (stories) => {
    const { favStories } = await chrome.storage.local.get(['favStories']);
    for (let index in stories) {
        const isSaved = favStories.findIndex(i => i.id == stories[index].id);
        const story = stories[index];
        const storyItem = document.createElement("div");
        storyItem.className = "story";
        if (story.cover_image != null) {
            const aImg = document.createElement("a");
            aImg.href = story.url;
            aImg.target = "_blank";
            aImg.classList.add("story__image_a");
            aImg.ariaLabel = story.title;
            aImg.innerHTML = `<img alt="${story.title}" class="story__image"src="${story.cover_image}" />`;
            storyItem.appendChild(aImg);
        }
        const aTitle = document.createElement("a");
        aTitle.href = story.url;
        aTitle.target = "_blank";
        aTitle.ariaLabel = story.title;
        aTitle.classList.add("story__title");
        aTitle.innerHTML = `<h1>${story.title}</h1>`;

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("story__controlInfo");
        const favBtn = document.createElement("button");
        favBtn.classList.add("story__like");
        favBtn.ariaLabel = "Save Button";
        favBtn.setAttribute("data-id", story.id);
        favBtn.innerHTML = ` 
            <span title="Save/remove from saved" data-id="${story.id}" class="overLap"></span>
            <svg 
                data-id="${story.id}" 
                xmlns = "http://www.w3.org/2000/svg" 
                fill = ${isSaved != -1 ? "#e96c79" : "none"} 
                viewBox = "0 0 24 24" 
                stroke-width="1.5" 
                stroke = "currentColor">
            <path 
                stroke-linecap="round" 
                stroke-linejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            `;

        favBtn.addEventListener("click", function (e) {
            addTofavorites(e.target.getAttribute('data-id')).catch(e => console.log(e))
        });
        const sourceDiv = document.createElement("div");
        sourceDiv.innerHTML = `<div class="story_source">dev.to</div>`;

        infoDiv.appendChild(favBtn);
        infoDiv.appendChild(sourceDiv);

        storyItem.appendChild(aTitle);
        storyItem.appendChild(infoDiv);
        storiesDiv.appendChild(storyItem);
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

var clearnote = document.getElementById('clearnote');
clearnote.addEventListener('click', function () {
    chrome.storage.local.set({ notes: [] });
});
var addNoteBtn = document.getElementById('addNote');
var noteInput = document.getElementById('noteInput');
addNoteBtn.addEventListener('click', function () {
    var note = noteInput.value;
    if (note != '')
        chrome.storage.local.get(['notes'], function (result) {
            var notes = result.notes || [];
            notes.unshift({ id: Date.now(), note: note, addedTime: Date.now() });
            noteInput.value = "";
            noteInput.style.height = "100px";
            chrome.storage.local.set({ notes: notes });
        });
});

document.getElementById('layout_1').addEventListener('click', function () {
    storiesDiv.style.columnCount = 1;
    storiesDiv.classList.add("no_image");
    storiesDiv.classList.remove("image");
});

document.getElementById('layout_2').addEventListener('click', function () {
    storiesDiv.style.columnCount = 2;
    storiesDiv.classList.remove("no_image");
    storiesDiv.classList.add("image");
});

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
    tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
    if (this.scrollHeight > 100) {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    }
}

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