// let map = document.querySelector("#map-img");
let mPointsParent = document.querySelector("#map-points");
let body = document.querySelector("body");

let displayMapPoint = document.querySelector("#map-point-display");

let mapPoints = [];
let mapPointCoords = [];
let mapPointIndex = 0;

let mapCoords = [0, 0];

let mapUrl = "map-points.json";
let mapData;

let prevX = 0;
let prevY = 0;
let mapZoom = 1200;
let maxZoom = 1800;

let canvas = document.createElement('canvas');
let c = canvas.getContext("2d");
document.querySelector("#canvas-map").appendChild(canvas);

canvas.width = 500;
canvas.height = 500;

let mapImg = new Image();
mapImg.src = "img/nh-map.png"

getJson(mapUrl);

mapImg.addEventListener("load", () => {
    c.drawImage(mapImg, 0, 0, mapZoom, mapZoom);
});

function paintPoint(x, y, scale, size, color) {
    c.fillStyle = color;
    c.fillRect(x * scale, y * scale, size.x, size.y);
}

async function getJson(url) {
    const requestURL = url;
    const request = new Request(requestURL);

    const response = await fetch(request);
    const file = await response.json();

    console.log(file);
    mapData = file;

    populateMapFromJSON();
}

canvas.addEventListener("mousedown", (e) => {
    prevX = e.screenX - mapCoords[0];
    prevY = e.screenY - mapCoords[1];
    console.log(prevX, prevY);
});

canvas.addEventListener("mousemove", (e) => {

    if (e.buttons == 1) {
        e.preventDefault();

        mapCoords[0] = (e.screenX - prevX);
        mapCoords[1] = (e.screenY - prevY);

        mapCoords[0] = clamp(mapCoords[0], -(mapZoom - 500), 0);
        mapCoords[1] = clamp(mapCoords[1], -(mapZoom - 500), 0);

        // console.log((e.screenX - prevX), (e.screenY - prevY));

        // mapP.style = `position: absolute;
        // transform: translate(${mapCoords[0]}px, ${mapCoords[1]}px);`

        // c.drawImage(mapImg, mapCoords[0], mapCoords[1], 1200, 1200);

        moveMap(mapCoords[0], mapCoords[1]);

        //console.log(mapCoords);
    }
});

document.addEventListener("wheel", (e) => {
    mapZoom -= e.deltaY;
    mapZoom = clamp(mapZoom, 500, maxZoom);
    // console.log(mapZoom);

    mapCoords[0] = clamp(mapCoords[0], -(mapZoom - 500), 0);
    mapCoords[1] = clamp(mapCoords[1], -(mapZoom - 500), 0);

    moveMap(mapCoords[0], mapCoords[1]);
});

function moveMap(x, y) {
    // mapP.style = `position: absolute;
    // transform: translate(${x}px, ${y}px);`

    c.drawImage(mapImg, x, y, mapZoom, mapZoom);

    //move the map pois
    for (let i = 0; i < mapPoints.length; i++) {
        let tmpPoint = document.querySelector('#' + mapPoints[i]);
        // console.log(tmpPoint);

        let lm = maxZoom / 500;
        let zoomMod = lerp(mapZoom, 500, maxZoom, 1, lm);
        let moveX = (mapPointCoords[i][0] * zoomMod) + mapCoords[0];
        let moveY = (mapPointCoords[i][1] * zoomMod) + mapCoords[1];

        tmpPoint.style = `position: absolute;
            transform: translate(${moveX}px, ${moveY}px);`

        if (moveX > canvas.width || moveX < 0 || moveY > canvas.height || moveY < 0) {
            tmpPoint.style = "display:none";
        }
    }
}

let touching = false;

canvas.addEventListener("touchstart", (e) => {
    touching = true;
    e.preventDefault();

    prevX = e.touches[0].screenX - mapCoords[0];
    prevY = e.touches[0].screenY - mapCoords[1];
});

canvas.addEventListener("touchend", (e) => {
    touching = false;
    e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
    if (touching) {
        e.preventDefault();

        mapCoords[0] = (e.touches[0].screenX - prevX);
        mapCoords[1] = (e.touches[0].screenY - prevY);

        mapCoords[0] = clamp(mapCoords[0], -(mapZoom - 500), 0);
        mapCoords[1] = clamp(mapCoords[1], -(mapZoom - 500), 0);

        moveMap(mapCoords[0], mapCoords[1]);

        // mapP.style = `position: absolute;
        // transform: translate(${mapCoords[0]}px, ${mapCoords[1]}px);`

        // // prevX = mx;
        // // prevY = my;
    }
});

displayMapPoint.addEventListener("mousedown", (e) => {
    closeDialog();

    e.preventDefault();
    prevX = e.screenX - mapCoords[0];
    prevY = e.screenY - mapCoords[1];
});

displayMapPoint.addEventListener("touchstart", (e) => {
    closeDialog();

    e.preventDefault();
    prevX = e.touches[0].screenX - mapCoords[0];
    prevY = e.touches[0].screenY - mapCoords[1];
});

// createPoint(0, 0, "here");
// createPoint(50, 50, "two");
// createPoint(150, 50, "here");

function populateMapFromJSON() {
    for (let i = 0; i < mapData["locations"].length; i++) {
        let tmpPoint = mapData["locations"][i];

        createPoint(tmpPoint.x, tmpPoint.y, tmpPoint.name);
    }

    moveMap(mapCoords[0], mapCoords[1]);
}

function createPoint(x, y, name) {
    mPointsParent.innerHTML += `<span id="map-poi${mapPointIndex}" onclick="mapPointClicked(${mapPointIndex})" class = "map-waypoint">* ${name}</span>`;
    let idStr = `map-poi${mapPointIndex}`;

    let tmpP = document.querySelector(`#map-poi${mapPointIndex}`);
    tmpP.style = `position: absolute;
            transform: translate(${x}px, ${y}px);`

    mapPoints.push(idStr);
    mapPointCoords.push([x, y]);
    mapPointIndex++;
}

function mapPointClicked(elementId) {
    let tmpData = mapData["locations"][elementId];

    displayMapPoint.innerHTML = "<p>" + tmpData["author"] + "<br><br>" + tmpData["description"] + "</p>" + "<img src = '#' width='200'>";
    displayMapPoint.style = `background-color: rgba(80, 80, 50, 0.8); z-index: 100; color:white;`;

    // map.style = "filter: blur(1px);";
    // mPointsParent.style = "filter: blur(1px);";

    console.log(elementId);
}

function closeDialog() {
    displayMapPoint.innerHTML = "";
    displayMapPoint.style = `z-index: -100;`;

    // map.style = "filter: blur(0px);";
    // mPointsParent.style = "filter: blur(0px);";
}

function clamp(v, min, max) {
    if (v < min) {
        return min;
    }
    else if (v > max) {
        return max;
    }
    else {
        return v;
    }
}