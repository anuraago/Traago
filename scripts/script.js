const storiesDiv = document.querySelector('#stories');

const storyNode = (story) => {
    var template = document.createElement('template');
    template.innerHTML = story;
    return template.content.childNodes[0];
}

const addStories = (stories) => {
    for (let index in stories) {
        const story = stories[index];
        const html = `<div class="story bg-zinc-800 text-zinc-300 border border-[#56478770] shadow-lg flex flex-col flex-col-reverse">
                            <div class="w-full flex flex-col justify-between p-3 ">
                                <a target="_" href="${story.url}" class="text-base">
                                    ${story.title}
                                </a>
                                <div class="mt-3 flex items-center justify-between">
                                    <div class="flex">
                                        <button class="text-zinc-400 hover:text-rose-500 mr-2">
                                            <span class="material-symbols-outlined">favorite</span>
                                        </button>
                                        <button class="text-zinc-400 hover:text-rose-500 mr-2 delete" data-delete="zoom">
                                            <span class="material-symbols-outlined">add_box</span>
                                        </button>
                                    </div>
                                    <div>dev.to</div>
                                </div>
                            </div>
                            <a target="_" href="${story.url}" class="w-full">
                                ${story.cover_image != null ? `<img class="h-full object-cover rounded" src="${story.cover_image}" />` : ""}
                            </a>
                    </div>`;
        storiesDiv.appendChild(storyNode(html));
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

document.getElementById('gridView').addEventListener('click', function () {
    document.getElementById('stories').classList = ["columns-2 gap-2 pr-3"];
});
document.getElementById('listView').addEventListener('click', function () {
    document.getElementById('stories').classList = ["no-image columns-1 gap-2 pr-3"];
});

document.querySelectorAll('.delete').forEach(function (item) {
    item.addEventListener('click', function (e) {
        let newClass = this.getAttribute('data-delete');
        let getParent = parent(this, '.story', 1);
        getParent.classList.add(newClass);
        iqwerty.toast.toast('Blog added to Saved items',
            {
                style: {
                    main: {
                        'background': '#f2fdff',
                        'box-shadow': '0 0 10px rgba(0, 0, 0, .2)',
                        'border-radius': '13px',
                        'z-index': '99999',
                        'color': '#564787',
                        'font-family': 'Kumbh Sans',
                        'padding': '10px 35px',
                        'max-width': '60%',
                        'width': 'fit-content',
                        'height': 'fit-content',
                        'word-break': 'keep-all',
                        'margin': '0 auto',
                        'text-align': 'center',
                        'position': 'fixed',
                        'right': '100',
                        'top': '50',
                        'transform': 'translateY(0) translateZ(0)',
                        '-webkit-filter': 'blur(0)',
                        'opacity': '0'
                    },
                },

                settings: {
                    duration: 2000,
                },
            });
        // getParent.addEventListener("animationend", function () {
        //     getParent;
        //     getParent.remove();
        // });
    });
});

const parent = function (el, match, last) {
    var result = [];
    for (var p = el && el.parentElement; p; p = p.parentElement) {
        result.push(p);
        if (p.matches(match)) {
            break;
        }
    }
    if (last == 1) {
        return result[result.length - 1];
    } else {
        return result;
    }
}; 