let print = console.log;
print("hello world");

let items = [];
let saveValues = [];

let listParent = document.querySelector("#scavenger-list");

let scrollPosY = 0;

if (listParent != null) {
    loadJson("items.json");
}

function lerp(p, a1, a2, b1, b2) {
    let scale1 = a2 - a1;
    let delta = (p - a1) / scale1;
    let scale2 = b2 - b1;
    return scale2 * delta + b1;
}

//save testing
let saveBtn = document.querySelector("#save");
let loadBtn = document.querySelector("#load");
// let txtIn = document.querySelector("#input");
// let debug = document.querySelector("#readout");

const LOCAL_STORAGE_DATA_SAVE_KEY = 'littletoot.items.save';

function save() {
    localStorage.setItem(LOCAL_STORAGE_DATA_SAVE_KEY, JSON.stringify(saveValues));
    console.log(saveValues);
}

function load() {
    let v = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_SAVE_KEY)) || [];
    saveValues = v;
    console.log(v);
}

function checkItem(id) {
    saveValues[id] = true;
    for (let i = 0; i < saveValues.length; i++) {
        if (saveValues[i] == null) {
            saveValues[i] = false;
        }

        if (saveValues[i] == true) {
            let tmp = document.querySelector(`#item${i}`);
            tmp.className = "checked";
        }
    }
    save();
}

function reset() {
    for (let i = 0; i < saveValues.length; i++) {
        saveValues[i] = false;
        document.querySelector(`#item${i}`).className = "not-checked";
    }
    save();
}

function populateItems() {
    load();
    listParent.innerHTML = "";
    for (let i = 0; i < items["items"].length; i++) {
        listParent.innerHTML += `<p class = "${saveValues[i] == true ? "checked" : "not-checked"}" id="item${i}" >${items["items"][i].name} 
        <input type="checkbox" id="checkState${i}" class="toggle">
        <label for="checkState${i}" id = "lable${i}">
        <img src="img/${items["items"][i].src}" width="150px" id = "img${i}">
        </label>
        </p>`;

        //onclick="checkItem(${i})" ontouchstart="checkItem(${i})"
    }

    for (let i = 0; i < items["items"].length; i++) {

        // document.querySelector(`#item${i}`).addEventListener("touchstart", (e) => {
        //     if (document.querySelector(`#checkState${i}`).checked == true) {
        //         checkItem(i);
        //     }
        // });

        document.querySelector(`#checkState${i}`).addEventListener("change", (e) => {
            console.log(document.querySelector(`#checkState${i}`).checked);
            if (document.querySelector(`#checkState${i}`).checked == true) {
                checkItem(i);
            }
        });
    }

    // for (let i = 0; i < items["items"].length; i++) {
    //     document.querySelector(`#item${i}`).addEventListener("mouseup", (e) => {
    //         e.preventDefault();

    //         if (Math.abs(scrollPosY - e.screenY) < 60) {
    //             checkItem(i);
    //         }

    //         console.log(e.screenY);

    //         scrollPosY = e.screenY;
    //     });

    //     document.querySelector(`#item${i}`).addEventListener("touchend", (e) => {
    //         e.preventDefault();

    //         if (Math.abs(scrollPosY - e.screenY) < 60) {
    //             checkItem(i);
    //         }

    //         scrollPosY = e.screenY;
    //         console.log(i);
    //     });

    //     document.querySelector(`#item${i}`).addEventListener("touchstart", (e) => {
    //         scrollPosY = e.screenY;
    //         console.log(i);
    //     });

    //     document.querySelector(`#item${i}`).addEventListener("mousedown", (e) => {
    //         scrollPosY = e.screenY;
    //         console.log(i);

    //         console.log(e.screenY);
    //     });
    // }
}

async function loadJson(url) {
    const requestURL = url;
    const request = new Request(requestURL);

    const response = await fetch(request);
    const file = await response.json();

    // console.log(file);
    items = file;

    populateItems();
}