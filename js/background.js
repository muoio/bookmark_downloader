
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if (message.greeting == "get_bookmarks"){
        chrome.bookmarks.getTree(function download_bookmarks(bookmarks){
            callback(JSON.stringify(bookmarks)); 
        });
    }
    return true;
});