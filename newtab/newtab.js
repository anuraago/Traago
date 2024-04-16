function url_domain(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var hostname = matches && matches[1];
    // const { hostname } = new URL(url);
    // https://www.google.com/s2/favicons?domain=dev.to&sz=128
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
}
function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "64");
    return url.toString();
}
//function to get first letter of the hostname from a url string
function url_domain_first_letter(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var hostname = matches && matches[1];
    // const { hostname } = new URL(url);
    return hostname.charAt(0).toUpperCase();
}

// get domain name from url
function url_domain_name(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var hostname = matches && matches[1];
    // const { hostname } = new URL(url);
    return hostname ? hostname : url;
}

function formatUnixTimestamp(timestamp, withTime = false) {
    const date = new Date(timestamp);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    if (!withTime) {
        // return the format as Month Day, Dayoftheweek
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = date.getDay();
        const dayName = dayNames[dayIndex];
        const formattedDateString = `${monthName} ${day}, ${dayName}`;
        return formattedDateString;
    }
    const formattedDateString = `${monthName} ${day}, ${year} | ${hours}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
    return formattedDateString;
}

// toggle sidebar on #overlay click
document.getElementById('overlay').addEventListener('click', function () {
    document.getElementById('story-sidebar').classList.remove('active');
    document.getElementById('settings-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.toggle('active');
});

// function to create and open settings sidebar
document.getElementById('settings').addEventListener('click', openSettings);
function openSettings() {
    const settingsSidebar = document.getElementById('settings-sidebar');
    settingsSidebar.classList.add('active');
    document.getElementById('overlay').classList.toggle('active');
}

// function to close settings sidebar
document.getElementById('settings-sidebar-close-btn').addEventListener('click', closeSettings);
function closeSettings() {
    const settingsSidebar = document.getElementById('settings-sidebar');
    settingsSidebar.classList.remove('active');
    document.getElementById('overlay').classList.toggle('active');
}


// function to that updates every second and displays the current time in the format hh:mm:ss in time element
function updateTime() {
    const timeElement = document.getElementById('time');
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // const seconds = date.getSeconds();
    // use 12 hour format
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12;
    // const amOrPm = hours >= 12 ? 'pm' : 'am';
    // timeElement.innerText = `${hours12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amOrPm}`;
    timeElement.innerText = `${hours12}:${minutes.toString().padStart(2, '0')}`;
    // update time every minute
    setTimeout(updateTime, 60000);
}

// function that displays current date in this format "27th March, Monday"
function updateDate() {
    // use formatUnixTimestamp function
    const dateElement = document.getElementById('date');
    dateElement.innerHTML = formatUnixTimestamp(Date.now(), false);
}

// array of 10 unique light pastel background colors
const pastelBgColors = ['#F0DFFC80', '#E0FFFF80', '#E8F8E880', '#FFF3CD80', '#F6E7F680', '#FFF6E580', '#FCE8E880', '#E8F8FF80', '#FFE9F080', '#F5F5DC'];
const pastelTextColors = ['#c0b2ca', '#b3cccc', '#bac6ba', '#ccc2a4', '#c5b9c5', '#ccc5b7', '#cababa', '#bac6cc', '#ccbac0', '#c4c4b0'];

const pastelBgClasses = [
    'bg-VERY-PALE-PINK',
    'bg-LANGUID-LAVENDER',
    'bg-VANILLA-ICE',
    'bg-VERY-PALE-ORANGE',
    'bg-MINT-CREAM',
    'bg-BLIZZARD-BLUE',
    'bg-LEMON-CHIFFON',
    'bg-BEIGE',
    'bg-LAVENDER-MIST',
    'bg-BABY-BLUE-EYES',
    'bg-LIGHT-CYAN'
];

// Old function to display recent urls/quick Links
function displayRecentUrls() {
    chrome.storage.local.get('urls', function (result) {
        if (result.urls && result.urls.length > 0) {
            var recentUrlsList = document.getElementById('recent-urls-list');
            recentUrlsList.innerHTML = '';
            for (var i = 0; i < result.urls.length; i++) {
                var url = result.urls[i];
                const node = document.createElement("a");
                const link = (url.url.indexOf('://') === -1) ? 'https://' + url.url : url.url;
                node.href = link;
                node.target = "_blank";
                node.className = "quickLink";
                var html = `
                    <div class="quickLink__title">${url.name}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>`;
                node.innerHTML = html;
                recentUrlsList.appendChild(node);
            }
        }
    });
}


function displayQuickLinks() {
    chrome.storage.local.get('urls', function (result) {
        var quickLinks = result.urls;
        if (quickLinks && quickLinks.length > 0) {
            var quickLinksList = document.getElementById('quickLinks-list');
            quickLinksList.innerHTML = '';
            for (var i = 0; i < quickLinks.length; i++) {
                var link = quickLinks[i];
                const node = document.createElement("a");
                const linkUrl = (link.url.indexOf('://') === -1) ? 'https://' + link.url : link.url;
                node.href = linkUrl;
                node.id = link.id;
                node.target = "_blank";
                node.className = `quickLink ${link.icon ? "folder" : ""} `;
                var html = ``;
                if (link.icon != "") {
                    html += `<div class="quickLink_icon"><img src="${link.icon}" alt=""></div>`;
                }
                else if (link.icon == "") {
                    html += `<div class="quickLink_icon"><img draggable="false" src="https://icon.horse/icon/${url_domain_name(link.url)}" alt=""></div>`;
                }
                else {
                    html += `<div class="quickLink_icon"><img draggable="false" src="../images/globe.png" alt=""></div>`;
                }
                html += `<div class="quickLink_title">${link.name}</div>`;
                // add delete button with event listener
                var deleteBtn = document.createElement('button');
                deleteBtn.className = 'quickLink_delete';
                deleteBtn.id = link.id;
                deleteBtn.setAttribute('data-delete-id', link.id);
                //  add hover listener to change the color of the delete button
                deleteBtn.addEventListener('click', (e) => deleteQuickLink(e));
                deleteBtn.innerHTML = `
                <svg data-delete-id="${link.id}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path data-delete-id="${link.id}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>`;
                node.setAttribute('data-delete-id', link.id);
                node.innerHTML = html;
                node.appendChild(deleteBtn);
                quickLinksList.appendChild(node);
            }
        }
    });
}
// delete quick link function
function deleteQuickLink(e) {
    // stop propagation to prevent opening the link
    e.stopPropagation();
    e.preventDefault();
    chrome.storage.local.get('urls', function (result) {
        var quickLinks = result.urls;
        var id = e.target.getAttribute('data-delete-id');
        var quickLinkIdx = quickLinks.findIndex((link) => link.id === id);
        if (quickLinkIdx > -1) {
            quickLinks.splice(quickLinkIdx, 1);
            chrome.storage.local.set({ urls: quickLinks });
        }
    });
}

// function to clear all quick links
const clearQuickLinks = () => chrome.storage.local.set({ urls: [] });

// toggle quick form on button click
document.getElementById('show_quickLink_btn').addEventListener('click', function () {
    if (document.getElementById('quick_Link_form').style.height == '110px') {
        document.getElementById('quick_Link_form').style.height = '0';
        document.getElementById('show_quickLink_btn').classList.remove('active');
        return;
    }
    document.getElementById('show_quickLink_btn').classList.add('active');
    document.getElementById('quick_Link_form').style.height = `110px`;
});


var addQLBtn = document.getElementById('addQL');
var urlInput = document.getElementById('urlInput');
var nameInput = document.getElementById('nameInput');
var form = document.getElementById('quick_Link_form');
addQLBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    var url = urlInput.value;
    var name = nameInput.value;
    if (!url || !name) {
        return;
    }
    chrome.storage.local.get(['urls'], function (result) {
        var urls = result.urls || [];
        var id = "QL" + Date.now();
        urls.unshift({ id: id, url: url, name: name, icon: "" });
        chrome.storage.local.set({ urls: urls });
        form.reset();
    });
});

// add event listener to the clear quick links button
document.getElementById('clear_quickLink_btn').addEventListener('click', clearQuickLinks);


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

// OLD QUICK NOTES CODE

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
                deleteBtn.innerHTML = `<img src="../images/trash.svg" alt="">Delete`;
                deleteBtn.setAttribute("data-delete", note.id);
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

function getMostVisitedWebsites() {
    chrome.topSites.get(function (mostVisited) {
        var topsites = document.getElementById('topsites-list');
        topsites.innerHTML = '';
        if (mostVisited.length > 10) {
            mostVisited = mostVisited.slice(0, 10);
        }
        mostVisited = mostVisited.slice(0, 5);
        mostVisited.forEach(function (site, index) {
            const node = document.createElement("a");
            node.classList = ['topsite_a'];
            node.href = site.url;
            node.title = site.title;
            node.target = "_blank";
            const icon = document.createElement("div");
            icon.classList = ['topsite_icon'];
            const site_img = document.createElement("img");
            site_img.src = faviconURL(site.url)
            site_img.classList = ['topsite_img'];
            site_img.alt = site.title;
            site_img.onerror = function () {
                this.src = `chrome://favicon/size/64@1x/${url_domain(site.url)}}`;
            };
            icon.appendChild(site_img);
            node.appendChild(icon);

            const site_title = document.createElement("div");
            site_title.classList = ['topsite_title'];
            const site_span = document.createElement("span");
            site_span.innerHTML = site.title;
            site_title.appendChild(site_span);
            node.appendChild(site_title);

            topsites.appendChild(node);
        });
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



// var clearnote = document.getElementById('clearnote');
// clearnote.addEventListener('click', function () {
//     chrome.storage.local.set({ notes: [] });
// });
// var addNoteBtn = document.getElementById('addNote');
// var noteInput = document.getElementById('noteInput');
// addNoteBtn.addEventListener('click', function () {
//     var note = noteInput.value;
//     if (note != '')
//         chrome.storage.local.get(['notes'], function (result) {
//             var notes = result.notes || [];
//             notes.unshift({ id: Date.now(), note: note, addedTime: Date.now() });
//             noteInput.value = "";
//             noteInput.style.height = "100px";
//             chrome.storage.local.set({ notes: notes });
//         });
// });




chrome.storage.onChanged.addListener((changes, areaName) => {
    // if (areaName == 'local' && changes['urls']) displayRecentUrls();
    if (areaName == 'local' && changes['urls']) displayQuickLinks();
    if (areaName == 'local' && changes['notes']) displayNotes();
})




// on input change find all quick notes and filter them using input value and display them and hide others using id and display property
document.getElementById('search_quick_notes').addEventListener('input', function () {
    var notes = document.getElementsByClassName('quick_note_content');
    var search = this.value;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].innerText.toLowerCase().includes(search.toLowerCase())) {
            notes[i].style.display = 'block';
        } else {
            notes[i].style.display = 'none';
        }
    }
});

// get controls html 
function getControlElements(note) {
    // add quick_note_controls div to quick_note_content div
    const controls = document.createElement("div");
    controls.className = "quick_note_controls";

    // add delete button to quick_note_controls div
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "note_delete hoverShadow";
    deleteBtn.innerHTML = `<img src="../images/trash.svg" alt="">Delete`;
    deleteBtn.setAttribute('data-delete-id', note.id);
    deleteBtn.addEventListener('click', deleteQuickNote);
    controls.appendChild(deleteBtn);

    // add copy button to quick_note_controls div
    var copyBtn = document.createElement("button");
    copyBtn.className = "note_copy hoverShadow";
    copyBtn.innerHTML = `<img src="../images/copy.svg" alt="">Copy`;
    copyBtn.setAttribute('data-copy-id', note.id);
    copyBtn.addEventListener('click', copyQuickNote);
    controls.appendChild(copyBtn);

    // add edit button to quick_note_controls div
    var editBtn = document.createElement("button");
    editBtn.className = "note_edit hoverShadow";
    editBtn.innerHTML = `Edit`;
    editBtn.setAttribute('data-edit-id', note.id);
    editBtn.addEventListener('click', editQuickNote);
    controls.appendChild(editBtn);

    return controls;
}


// on add button click get contents of quill editor using getContents() method and log it console
document.getElementById('addNoteEditor').addEventListener('click', addQuickNote);

// function to add quick note from quick form
function addQuickNote() {
    // check if note is empty or not
    if (quill.getText().trim() == '') return;

    var note = quill.getContents();
    var quickNoteList = document.getElementById('editorList');
    var id = Date.now();
    var node = document.createElement("div");
    node.className = "quick_note_content";
    node.id = id;
    var q1 = new Quill(node, { readOnly: true });
    q1.enable(false);
    q1.setContents(note);
    // add contents to quickNotes array in local storage and display it
    chrome.storage.local.get(['quickNotes'], function (result) {
        var notes = result.quickNotes || [];
        var obj = { id: id, note: note, text: JSON.stringify(q1.getText()), addedTime: Date.now() };
        notes.unshift(obj);

        var noteTime = document.createElement("div");
        noteTime.className = "quick_note_time";
        noteTime.innerHTML = formatUnixTimestamp(obj.addedTime, true);
        node.appendChild(noteTime)

        node.appendChild(getControlElements(obj));

        chrome.storage.local.set({ quickNotes: notes }).then(() => {
            quickNoteList.insertBefore(node, quickNoteList.firstChild);
            // set quill editor contents to empty
            quill.setContents([]);
        });
    });
}

// display quick notes function to display quick notes from local storage
function displayQuickNotes() {
    chrome.storage.local.get(['quickNotes'], function (result) {
        var notes = result.quickNotes || [];
        notes.forEach(note => {
            var node = document.createElement("div");
            node.id = note.id;
            node.setAttribute('data-note-id', note.addedTime);
            node.className = "quick_note_content";


            var q1 = new Quill(node, { readOnly: true });
            q1.enable(false);
            q1.setContents(note.note);

            var noteTime = document.createElement("div");
            noteTime.className = "quick_note_time";
            noteTime.innerHTML = formatUnixTimestamp(note.addedTime, true);
            node.appendChild(noteTime)

            var controls = getControlElements(note);
            node.appendChild(controls);

            document.getElementById('editorList').appendChild(node);
        });
    });
}

//edit function to set contents of quill editor to contents of quick note using data-edit-id attribute and remove note from quickNotes array
function editQuickNote(e) {
    var id = e.target.getAttribute('data-edit-id');
    chrome.storage.local.get(['quickNotes'], function (result) {
        var notes = result.quickNotes || [];
        var note = notes.find(note => note.id == id);
        quill.setContents(note.note);
        // document.getElementById('addNoteEditor').innerText = 'Update';
        // document.getElementById('addNoteEditor').setAttribute('data-update-id', id);
        notes = notes.filter(note => note.id != id);
        chrome.storage.local.set({ quickNotes: notes }).then(() => {
            document.getElementById(id).remove();
        });
    });
}

// copy function to copy content of quill editor to clipboard using data-copy-id attribute 
function copyQuickNote(e) {
    var id = e.target.getAttribute('data-copy-id');
    chrome.storage.local.get(['quickNotes'], function (result) {
        var notes = result.quickNotes || [];
        var note = notes.find(note => note.id == id);
        var q1 = new Quill(document.createElement("div"), { readOnly: true });
        q1.enable(false);
        q1.setContents(note.note);
        var text = q1.getText();
        navigator.clipboard.writeText(text).then(() => {
            setTimeout(() => {
                e.target.innerHTML = `<img src="../images/copy.svg" alt="">Copy`;
            }, 2000);
            e.target.innerHTML = `Copied`;
        });
    });
}

// delete quick note by getting id of note from data-delete-id attribute function to delete quick note from local storage and from dom
function deleteQuickNote(e) {
    var id = e.target.getAttribute('data-delete-id');
    chrome.storage.local.get(['quickNotes'], function (result) {
        var notes = result.quickNotes || [];
        var newNotes = notes.filter(note => note.id != id);
        chrome.storage.local.set({ quickNotes: newNotes }).then(() => {
            document.getElementById(id).remove();
        });
    });
}


// show search on click of search icon and replace search by close icon
document.getElementById('searchIcon').addEventListener('click', function () {
    document.getElementById('searchIcon').style.display = 'none';
    document.getElementById('closeIcon').style.display = 'block';
    document.getElementById('search_quick_notes').classList.add('active');
    document.getElementById('search_quick_notes').focus();
});

// hide search on click of close icon and replace close by search icon
document.getElementById('closeIcon').addEventListener('click', function () {
    document.getElementById('searchIcon').style.display = 'block';
    document.getElementById('closeIcon').style.display = 'none';
    document.getElementById('search_quick_notes').classList.remove('active');
    document.getElementById('search_quick_notes').value = '';
    document.getElementById('search_quick_notes').blur();
});


// sort quick notes by date added on sortUp click
document.getElementById('sortUp').addEventListener('click', function () {
    chrome.storage.local.get('quickNotes', function (result) {
        var notes = result.quickNotes || [];
        notes.sort((a, b) => a.addedTime - b.addedTime);
        chrome.storage.local.set({ quickNotes: notes }).then(() => {
            document.getElementById('editorList').innerHTML = '';
            document.getElementById('sortUp').style.display = 'none';
            document.getElementById('sortDown').style.display = 'block';
            displayQuickNotes();
        });
    });
});
document.getElementById('sortDown').addEventListener('click', function () {
    chrome.storage.local.get('quickNotes', function (result) {
        var notes = result.quickNotes || [];
        notes.sort((a, b) => b.addedTime - a.addedTime);
        chrome.storage.local.set({ quickNotes: notes }).then(() => {
            document.getElementById('editorList').innerHTML = '';
            document.getElementById('sortUp').style.display = 'block';
            document.getElementById('sortDown').style.display = 'none';
            displayQuickNotes();
        });
    });
});

var toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block", 'link'],
    [{ list: "ordered" }, { list: "bullet" }, { list: 'check' }, { indent: "-1" }, { indent: "+1" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }]
];

var Keyboard = Quill.import('modules/keyboard');
var bindings = {
    custom: {
        key: Keyboard.keys.ENTER,
        shortKey: true,
        handler: addQuickNote
    }
};


var quill = new Quill("#editor", {
    modules: {
        // toolbar: "#toolbar"
        toolbar: toolbarOptions,
        keyboard: {
            bindings: bindings
        },
    },
    placeholder: 'Have something on your mind?\nQuickly note it down...\nNote: You can also add links, images, etc.',
    theme: "snow",
    autolink: true
});
quill.on('text-change', function (delta, oldDelta, source) {
    var regex = /https?:\/\/[^\s]+$/;
    if (delta.ops.length === 2 && delta.ops[0].retain) {
        var endRetain = delta.ops[0].retain;
        var text = quill.getText().substr(0, endRetain);
        var match = text.match(regex);

        if (match !== null) {
            var url = match[0];

            var ops = [];
            if (endRetain > url.length) {
                ops.push({ retain: endRetain - url.length });
            }

            ops = ops.concat([
                { delete: url.length },
                { insert: url, attributes: { link: url } }
            ]);

            quill.updateContents({
                ops: ops
            });
        }
    }
});
quill.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
    var regex = /https?:\/\/[^\s]+/g;
    if (typeof (node.data) !== 'string') return;
    var matches = node.data.match(regex);

    if (matches && matches.length > 0) {
        var ops = [];
        var str = node.data;
        matches.forEach(function (match) {
            var split = str.split(match);
            var beforeLink = split.shift();
            ops.push({ insert: beforeLink });
            ops.push({ insert: match, attributes: { link: match } });
            str = split.join(match);
        });
        ops.push({ insert: str });
        delta.ops = ops;
    }

    return delta;
});
document.addEventListener('DOMContentLoaded', function () {
    // displayRecentUrls();
    // displayBookmarks();
    displayQuickNotes();
    displayQuickLinks();
    updateTime();
    updateDate();
    document.getElementsByClassName("ql-editor")[0].focus();
    // displayNotes();
    getMostVisitedWebsites();
});