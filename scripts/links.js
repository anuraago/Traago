
chrome.bookmarks.getRecent(6).then((data) => appendData(data));

function url_domain(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var hostname = matches && matches[1];
    // const { hostname } = new URL(url);
    // https://www.google.com/s2/favicons?domain=dev.to&sz=128
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
}


function appendData(data) {
    for (var bookmark of data) {
        if (bookmark.title) {
            const node = document.createElement("div");
            html = `
            <div class="relative">
                <a href="${bookmark.url}" target="_blank">
                    <img class="absolute w-8 h-8 bg-zinc-700 -top-0.5 left-0 border border-zinc-600 p-0.5 rounded-full"
                        src="${url_domain(bookmark.url)}" alt="">
                    <div class="truncate text-ellipsis bg-zinc-700 text-zinc-200 rounded-lg p-2 pl-4 ml-5">${bookmark.title}</div>
                </a>
            </div>
            `;
            node.innerHTML = html;
            document.getElementById("bookmarks").appendChild(node);
        }
    }
}


function appendshorts() {
    const randomList =
        ['cum', 'sint', 'laudantium', 'necessit', 'atibus', 'error', 'optio dolores', ' commodi impedit ', 'voluptatum magnam']

    randomList.forEach(item => {
        const node = document.createElement("div");
        html = `
        <div class="flex group justify-between items-center rounded-lg bg-zinc-700 text-zinc-100 p-2">
            <a href="${item}" class="pl-2 overflow-hidden text-ellipsis">${item}</a>
            <div class="block shrink-0 invisible group-hover:visible pl-2">
                <button><span class="text-base material-symbols-outlined">edit</span></button>
                <button><span class="text-base material-symbols-outlined">clear</span></button>
            </div>
        </div>
                `;
        node.innerHTML = html;
        document.getElementById("shorts").appendChild(node);

    });
}
appendshorts();



function appendNotes() {
    const noteList =
        ['cum', 'sint', 'laudantium', 'necessit', 'atibus', 'error', 'optio dolores', ' commodi impedit ', 'voluptatum magnam']

    noteList.forEach(item => {
        const node = document.createElement("div");
        html = `
        <div class="flex group justify-between items-center rounded-lg bg-zinc-700 text-zinc-100 p-2">
            <a href="${item}" class="pl-2 overflow-hidden text-ellipsis">${item}</a>
            <div class="block shrink-0 invisible group-hover:visible pl-2">
                <button><span class="text-base material-symbols-outlined">edit</span></button>
                <button><span class="text-base material-symbols-outlined">clear</span></button>
            </div>
        </div>
                `;
        node.innerHTML = html;
        document.getElementById("notes").appendChild(node);

    });
}
appendNotes();