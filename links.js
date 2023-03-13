
// chrome.bookmarks.getRecent(6).then((data) => appendData(data));

// function url_domain(url) {
//     var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
//     var hostname = matches && matches[1];
//     // const { hostname } = new URL(url);
//     // https://www.google.com/s2/favicons?domain=dev.to&sz=128
//     return `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
// }

// function appendData(data) {
//     console.log(data);
//     for (var bookmark of data) {
//         const node = document.createElement("div");
//         html = `
//         <div class="flex space-x-2 items-center px-2 py-1 rounded-full text-base bg-zinc-600 text-zinc-200">
//             <img class="w-7 h-7 rounded-full" src="${url_domain(bookmark.url)}" alt="">
//             <div class="truncate text-ellipsis">${bookmark.title}</div>
//         </div>
//         `;
//         node.innerHTML = html;
//         document.getElementById("bookmarks").appendChild(node);
//     }
// }