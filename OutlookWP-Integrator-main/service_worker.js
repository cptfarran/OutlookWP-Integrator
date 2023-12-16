// Regex-pattern to check URLs against. 
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
//let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?stackoverflow\.com/;

// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:');
    console.log(domContent);
}

chrome.action.onClicked.addListener(tab => {
    console.log(tab)
    chrome.tabs.sendMessage(tab.id, {text: 'get_table'}, doStuffWithDom);
});

