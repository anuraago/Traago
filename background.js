chrome.runtime.onInstalled.addListener(function () {
    console.log('Installed');
});
chrome.omnibox.onInputChanged.addListener(
    function (text, suggest) {
        text = text.replace(" ", "");

        // Add suggestions to an array
        var suggestions = [];
        suggestions.push({ content: "http://reddit.com/r/" + text, description: "reddit.com/r/" + text });
        suggestions.push({ content: "http://imgur.com/r/" + text, description: "imgur.com/r/" + text });

        // Set first suggestion as the default suggestion
        chrome.omnibox.setDefaultSuggestion({ description: suggestions[0].description });

        // Remove the first suggestion from the array since we just suggested it
        suggestions.shift();

        // Suggest the remaining suggestions
        suggest(suggestions);
    }
);

chrome.omnibox.onInputEntered.addListener((text) => {
    // Encode user input for special characters , / ? : @ & = + $ #
    console.log(text);
    const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
    chrome.tabs.create({ url: newURL });
});