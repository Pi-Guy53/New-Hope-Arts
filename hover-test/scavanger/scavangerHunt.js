// console.log("hello world");
const LOCAL_STORAGE_ITEM_SAVE_KEY = "new-hope-scavanger-hunt.save";

let itemId = document.querySelector("#item");

let galleryLength = 4;

if (itemId != null) {
    addItem(itemId.innerHTML);
}
else {
    console.log("no item");
    displayItems();
}

function addItem(name) {
    console.log(name);

    let arr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM_SAVE_KEY)) || [];

    if (arr.length == 0) {
        arr.push(name);
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == name) {
                return;
            }
        }

        arr.push(name);
    }

    arr = arr.sort();

    localStorage.setItem(LOCAL_STORAGE_ITEM_SAVE_KEY, JSON.stringify(arr));
}

function displayItems() {
    let arr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM_SAVE_KEY)) || [];

    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);

        for (let f = 0; f < galleryLength; f++) {
            let temp = document.querySelector("#item" + f);
            if (temp.id == ("item" + arr[i])) {
                temp.className = "";
            }
        }
    }
}

function clearLocalStorage() {
    let arr = [];
    localStorage.setItem(LOCAL_STORAGE_ITEM_SAVE_KEY, JSON.stringify(arr));

    for (let f = 0; f < galleryLength; f++) {
        let temp = document.querySelector("#item" + f);
        temp.className = "hidden";
    }
}