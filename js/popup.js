let download = document.getElementById('download');
let selective_bookmarks = document.getElementById('selective_bookmarks');


function downloadFile(data) {
    var filename = "bookmarks.xls";
    var blob = new Blob([data], {type: 'text/plain'});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else{
        var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
}

let bookmarks_url = ''

function getCheckedUrls(bookmarks, listChecked) {
    for (var i =0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url && listChecked.includes(bookmark.id)) {
            //console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
            bookmarks_url += bookmark.url + '\n';
        }

        if (bookmark.children) {
            getCheckedUrls(bookmark.children, listChecked);
        }
    }
}

function getListChecked(){
    let listChecked = [];
    let allCheckboxes =  selective_bookmarks.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of allCheckboxes)
        if (checkbox.checked)
            listChecked.push(checkbox.id);
    return listChecked;
}



function display_bookmarks(bookmarks, bookmarks_element, marginLeft){
    for (var i=0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url){
            let bookmark_child = document.createElement('div');
            bookmark_child.style.marginLeft = '5px'
            let bookmark_checkbox = document.createElement('input');
            bookmark_checkbox.id = bookmark.id;
            bookmark_checkbox.type = 'checkbox';
            let bookmark_title = document.createElement('label');
            bookmark_title.textContent = bookmark.title;
            bookmark_title.setAttribute('for',bookmark_checkbox.id)

            bookmark_child.appendChild(bookmark_checkbox);
            bookmark_child.appendChild(bookmark_title);

            bookmarks_element.appendChild(bookmark_child);
            console.log('marginLeft ',marginLeft);
        }

        if (bookmark.children){
            console.log('children', bookmark)
            let bookmarks_child_element = document.createElement('div');
            bookmarks_element.appendChild(bookmarks_child_element);

            let bookmark_checkbox = document.createElement('input');
            bookmark_checkbox.type = 'checkbox';
            bookmark_checkbox.id = bookmark.id;


            let bookmark_title = document.createElement('label');
            bookmark_title.textContent = bookmark.title;
            bookmark_title.setAttribute('for',bookmark_checkbox.id);

            let bookmarks_child = document.createElement('div');
            bookmarks_child.style.display = 'inline-block'

            bookmarks_child_element.appendChild(bookmark_checkbox);
            bookmarks_child_element.appendChild(bookmark_title);
            bookmarks_child_element.appendChild(bookmarks_child);
            bookmarks_child_element.style.marginLeft = marginLeft+'px';
            display_bookmarks(bookmark.children, bookmarks_child_element, marginLeft+5);

            bookmark_checkbox.addEventListener('input', function(){
                if (bookmark_checkbox.checked){
                    let checkboxes = bookmarks_child_element.querySelectorAll('input[type="checkbox"]');
                    for (let checkbox of checkboxes)
                        checkbox.checked = true;
                }
                else{
                    let checkboxes = bookmarks_child_element.querySelectorAll('input[type="checkbox"]');
                    for (let checkbox of checkboxes)
                        checkbox.checked = false;
                }
            })
        }
    }
}


chrome.runtime.sendMessage({greeting:"get_bookmarks"}, function(bookmarks){
    bookmarks = JSON.parse(bookmarks);
    console.log(bookmarks);
    display_bookmarks(bookmarks, selective_bookmarks, 0);

    download.onclick = function(){
        let listCheckedBoxes = getListChecked();
        console.log(listCheckedBoxes);
        getCheckedUrls(bookmarks, listCheckedBoxes)
        console.log(bookmarks_url);
        downloadFile(bookmarks_url);
    }
});

