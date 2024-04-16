// Author: Anurag Deore


const storiesDiv = document.querySelector('#stories');


// shuffle array function
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle
    while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue
    }
    return array;
}


// fetch favorite stories from chrome.storage.local and display inside #story-sidebar div
function displayFavoriteStories() {
    chrome.storage.local.get('favStories', function (result) {
        var favoriteStories = result.favStories;
        var storySidebar = document.getElementById('story-sidebar-content');
        storySidebar.innerHTML = '';
        for (var i = 0; i < favoriteStories.length; i++) {
            var story = favoriteStories[i];
            var savedStoryDiv = document.createElement('a');
            savedStoryDiv.classList.add('saved-story');
            savedStoryDiv.setAttribute('href', story.url);
            savedStoryDiv.setAttribute('data-story-id', story.id);
            savedStoryDiv.setAttribute('target', '_blank');

            // create saved-story-info div
            var savedStoryInfoDiv = document.createElement('div');
            savedStoryInfoDiv.classList.add('saved-story-info');

            //create title h1 
            var savedStoryTitle = document.createElement('h1');
            savedStoryTitle.innerHTML = story.title;

            // create source small
            var savedStorySource = document.createElement('small');
            savedStorySource.innerHTML = story.source;

            // create saved-story-controls div
            var savedStoryControlsDiv = document.createElement('div');
            savedStoryControlsDiv.classList.add('saved-story-controls');

            // create saved-story-remove-btn button
            var savedStoryRemoveBtn = document.createElement('button');
            savedStoryRemoveBtn.classList.add('saved-story-remove-btn');
            savedStoryRemoveBtn.setAttribute('data-story-id', story.id);
            savedStoryRemoveBtn.innerHTML = `
            <svg data-story-id="${story.id}" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                </path>
            </svg>`;
            savedStoryRemoveBtn.addEventListener('click', e => removeSavedStory(e));


            //create saved story thumbnail div
            var savedStoryThumbnailDiv = document.createElement('div');
            savedStoryThumbnailDiv.classList.add('saved-story-thumbnail');
            if (story.cover_image != null) {
                var savedStoryThumbnailImg = document.createElement('img');
                savedStoryThumbnailImg.setAttribute('src', story.cover_image);
                savedStoryThumbnailImg.setAttribute('alt', story.title);
                savedStoryThumbnailDiv.appendChild(savedStoryThumbnailImg);
            }

            // append savedStoryTitle to savedStoryInfoDiv
            savedStoryInfoDiv.appendChild(savedStoryTitle);
            savedStoryControlsDiv.appendChild(savedStoryRemoveBtn);
            savedStoryControlsDiv.appendChild(savedStorySource);
            savedStoryInfoDiv.appendChild(savedStoryControlsDiv);

            savedStoryDiv.appendChild(savedStoryInfoDiv);
            savedStoryDiv.appendChild(savedStoryThumbnailDiv);


            storySidebar.appendChild(savedStoryDiv);
        }
    });
}

// remove saved story function takes event as parameter
function removeSavedStory(e) {
    e.stopPropagation();
    e.preventDefault();
    var storyId = e.target.getAttribute('data-story-id');
    // remove story from chrome.storage.local
    chrome.storage.local.get('favStories', function (result) {
        var favoriteStories = result.favStories ?? [];
        var newFavoriteStories = favoriteStories.filter(function (story) {
            return story.id != storyId;
        });
        chrome.storage.local.set({ favStories: newFavoriteStories }, function () {
            displayFavoriteStories();
        });
    });
}

// add story to favorites
function addTofavorites(id) {
    const stories = JSON.parse(localStorage.stories);
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['favStories'], function (result) {
            var favStories = result.favStories || [];
            if (favStories) {
                if (favStories.findIndex(s => s.id == id) == -1) {
                    const story = stories.find(s => s.id == id);
                    favStories.unshift({ ...story });
                    document.querySelector(`svg[data-id="${id}"]`).setAttribute("fill", "currentColor")
                    chrome.storage.local.set({ favStories: favStories }, () => resolve());

                } else {
                    //  remove from favorites
                    const newFavStories = favStories.filter(s => s.id != id);
                    document.querySelector(`svg[data-id="${id}"]`).setAttribute("fill", "none")
                    chrome.storage.local.set({ favStories: newFavStories }, () => resolve());
                    reject("already added");
                }
            }
        });
    })
}


//display stories in stories container
const displayAllStories = async (stories) => {
    storiesDiv.innerHTML = "";
    const { favStories = [] } = await chrome.storage.local.get(['favStories']);
    for (let index in stories) {
        const isSaved = favStories && favStories.findIndex(i => i.id == stories[index].id);
        const story = stories[index];
        const storyItem = document.createElement("div");
        storyItem.className = "story";
        if (story.cover_image != null) {
            const aImg = document.createElement("a");
            aImg.href = story.url;
            aImg.target = "_blank";
            aImg.classList.add("story__image_a");
            aImg.ariaLabel = story.title;
            aImg.innerHTML = `<img alt="${story.title}" class="story__image" src="${story.cover_image}" />`;
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
                fill = ${(isSaved && isSaved == -1) ? "none" : "currentColor"} 
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
        sourceDiv.innerHTML = `<div class="story_source">${story.source}</div>`;

        infoDiv.appendChild(favBtn);
        infoDiv.appendChild(sourceDiv);

        storyItem.appendChild(aTitle);
        storyItem.appendChild(infoDiv);
        storiesDiv.appendChild(storyItem);
    }
}




// toggle sidebar on #savedStories click
document.getElementById('savedStories').addEventListener('click', function () {
    document.getElementById('story-sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    displayFavoriteStories();
});


//  hide sidebar on #story-sidebar-close click
document.getElementById('story-sidebar-close-btn').addEventListener('click', function () {
    document.getElementById('story-sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    // set story-sidebar innerHTML to empty string
    document.getElementById('story-sidebar-content').innerHTML = '';
});



// https://api.hackernoon.com/featured-stories

// https://hacker-news.firebaseio.com/v0/item/35649935.json
// https://hacker-news.firebaseio.com/v0/topstories.json


async function getData() {
    if (localStorage.lastFetch && localStorage.stories && (new Date() - localStorage.lastFetch) < (1000 * 60 * 60)) {
        displayAllStories(JSON.parse(localStorage.stories));
    } else {
        if (localStorage.stories) {
            displayAllStories(JSON.parse(localStorage.stories));
        } else {


            const storiesDiv = document.querySelector('#stories');
            storiesDiv.style.columnCount = 1;
            storiesDiv.classList.add("no_image");
            storiesDiv.classList.remove("image");
            storiesDiv.innerHTML = `<div class="story-loader">
            <img src="../images/catloader-unscreen.gif" width="200px" alt="">
            <p>Fetching articlessssssss</p>
            </div>`;
        }

        var articles = [];

        const devTo_url = 'https://dev.to/api/articles';
        const FCC_url = 'https://www.freecodecamp.org/news/rss';
        const hackerNoon_url = 'https://api.hackernoon.com/featured-stories';
        // const hackerNews_url = 'https://hacker-news.firebaseio.com/v0/topstories.json';

        // check localstorage for sources array and fetch only the sources that are present in the array
        const { sources = [] } = await chrome.storage.local.get(['sources']);
        var sources_array = [];
        if (sources.length > 0) {
            if (sources.includes('dev.to')) {
                sources_array.push(fetch(devTo_url));
            }
            if (sources.includes('freecodecamp.org')) {
                sources_array.push(fetch(FCC_url));
            }
            if (sources.includes('hackernoon.com')) {
                sources_array.push(fetch(hackerNoon_url));
            }
            // sources_array = sources;
        } else {
            sources_array = [fetch(devTo_url), fetch(FCC_url), fetch(hackerNoon_url)];
        }

        // fetch all urls using promise.all
        const responses = await Promise.all(sources_array);

        const devTo_data = await responses[0].json().catch(e => []);
        devTo_data.forEach(item => {
            articles.push({
                id: item.id,
                title: item.title,
                url: item.url,
                cover_image: item.cover_image,
                source: 'dev.to',
                addedTime: new Date(item.published_timestamp),
            });
        });

        //set hackerNoon_data to [] if response is not ok
        const hackerNoon_data = await responses[2].json().catch(e => []);

        hackerNoon_data.forEach(item => {
            articles.push({
                id: item.id,
                title: item.title,
                url: "https://hackernoon.com/" + item.slug,
                cover_image: item.mainImage,
                source: 'hackernoon.com',
                addedTime: new Date(item.publishedAt),
            });
        });

        const FCC_data = await responses[1].text().catch(e => []);
        const parser = new DOMParser();
        const FCC_xml = parser.parseFromString(FCC_data, "text/xml");
        const FCC_items = FCC_xml.querySelectorAll("item");
        FCC_items.forEach(item => {
            articles.push({
                id: "FCC" + new Date(item.querySelector('pubDate').textContent).getTime(),
                title: item.querySelector("title").textContent,
                url: item.querySelector("link").textContent,
                cover_image: item.getElementsByTagName("media:content")[0].getAttribute("url"),
                source: 'freecodecamp.org',
                addedTime: new Date(item.querySelector("pubDate").innerHTML),
            });
        });
        articles = shuffleArray(articles);
        if (!localStorage.stories) {
            displayAllStories(articles);
        }
        localStorage.setItem("stories", JSON.stringify(articles));
        localStorage.setItem("lastFetch", new Date() - 1);
    }

    // set layout based on localstorage value
    const { layout = 'grid' } = await chrome.storage.local.get('layout');
    if (layout === 'grid') {
        storiesDiv.style.columnCount = 2;
        storiesDiv.classList.remove("no_image");
        storiesDiv.classList.add("image");
    } else {
        storiesDiv.style.columnCount = 1;
        storiesDiv.classList.add("no_image");
        storiesDiv.classList.remove("image");
    }
}

document.getElementById('layout_1').addEventListener('click', function () {
    storiesDiv.style.columnCount = 1;
    storiesDiv.classList.add("no_image");
    storiesDiv.classList.remove("image");
    //set in local storage
    chrome.storage.local.set({ layout: 'list' });
});

document.getElementById('layout_2').addEventListener('click', function () {
    storiesDiv.style.columnCount = 2;
    storiesDiv.classList.remove("no_image");
    storiesDiv.classList.add("image");
    chrome.storage.local.set({ layout: 'grid' });
});


getData()


// if (localStorage.lastFetch && localStorage.stories && (new Date() - localStorage.lastFetch) < (1000 * 60 * 60)) {
//     displayAllStories(JSON.parse(localStorage.stories));
// } else {
//     if (localStorage.stories) {
//         displayAllStories(JSON.parse(localStorage.stories));
//     }



//     fetch('https://dev.to/api/articles', {
//         method: 'GET',
//         mode: 'cors',
//         credentials: 'include'
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (!localStorage.stories) {
//                 displayAllStories(data);
//             }

//             localStorage.setItem("stories", JSON.stringify(data));
//             localStorage.setItem("lastFetch", new Date() - 1);
//         });
// }