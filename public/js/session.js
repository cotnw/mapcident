var map = null;
var marker = [];
let crashes = [
    [28.488988, 77.057178]
];
let currentPosition = [];
navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
    currentPosition = [position.coords.latitude, position.coords.longitude];
    console.log(currentPosition);
    map = new MapmyIndia.Map('map', {
        center: currentPosition,
        zoomControl: true,
        hybrid: true
    });

    function mapmyindia_fit_markers_into_bound(position) {
        var maxlat = position.lat;
        var maxlon = position.lng;
        var minlat = position.lat;
        var minlon = position.lng;
        var southWest = L.latLng(maxlat, maxlon);
        var northEast = L.latLng(minlat, minlon);
        var bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds);
    }

    function addMarker(position, icon, title, draggable) {
        if (icon == '') {
            var mk = new L.Marker(position, {
                draggable: draggable,
                title: title
            });
        } else {
            var mk = new L.Marker(position, {
                icon: icon,
                draggable: draggable,
                title: title
            });
        }
        map.addLayer(mk);
        mk.on("click", function(e) {
            mapmyindia_fit_markers_into_bound(position);
            // calculateDistance(position);
            document.getElementById('bottom-card').style.display = "block"
        });
        return mk;
    }

    function calculateDistance(crashPosition) {
        let url = `https://api.radar.io/v1/route/distance?origin=${currentPosition[0]},${currentPosition[1]}&destination=${crashPosition.lat},${crashPosition.lng}&modes=car&units=metric`;
        fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.log(err));
    }

    function markCurrentLocation() {
        var icon = L.icon({
            iconUrl: 'https://media.discordapp.net/attachments/872743735388172318/929084635126857768/unknown.png',
            iconRetinaUrl: 'https://media.discordapp.net/attachments/872743735388172318/929084635126857768/unknown.png',
            iconSize: [30, 30],
            popupAnchor: [-3, -15]
        });
        var position = new L.LatLng(currentPosition[0], currentPosition[1]);
        var mk = addMarker(currentPosition, icon, 'Current Location', false);
    }

    function loadAllCrashes() {
        var icon = L.icon({
            iconUrl: 'https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png',
            iconRetinaUrl: 'https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png',
            iconSize: [100, 100],
            popupAnchor: [-3, -15]
        });
        for (let i = 0; i < crashes.length; i++) {
            var position = new L.LatLng(crashes[i][0], crashes[i][1]);
            console.log(position)
            marker.push(addMarker(position, icon, "", false));
        }
    }
    markCurrentLocation();
    loadAllCrashes();
}

document.getElementById('begin').addEventListener('click', () => {
    document.getElementById('startModal').style.display = "none"
    document.getElementById('map-custom-stuff').style.display = "block"
    start();
})

document.getElementById('skip').addEventListener('click', () => {
    document.getElementById('alertModal').style.display = "none"
})

document.getElementById('backSession').addEventListener('click', () => {
    document.getElementById('successAlert').style.display = "none"
})

document.getElementById('bottom-card-respond-button').addEventListener('click', () => {
    document.getElementById('bottom-card').style.display = 'none'
    document.getElementById('expanded-bottom-card').style.display = 'block'
})

document.getElementById('respond-button').addEventListener('click', () => {
    document.getElementById('alertModal').style.display = 'none'
    document.getElementById('expanded-bottom-card').style.display = 'block'
})

document.getElementById('end').addEventListener('click', () => {
    // send time of session and karma collected to a past record saving endpoint
    console.log(document.getElementsByClassName('timer')[0].innerHTML)
    window.location.href = '/dashboard';
})

function start() {
    x = setInterval(timer, 10);
} 
  
var milisec = 0;
var sec = 0;
var min = 0;
var hour = 0;

var miliSecOut = 0;
var secOut = 0;
var minOut = 0;
var hourOut = 0;

function timer() {
    miliSecOut = checkTime(milisec);
    secOut = checkTime(sec);
    minOut = checkTime(min);
    hourOut = checkTime(hour);
  
    milisec = ++milisec;
  
    if (milisec === 100) {
      milisec = 0;
      sec = ++sec;
    }
  
    if (sec == 60) {
      min = ++min;
      sec = 0;
    }
  
    if (min == 60) {
      min = 0;
      hour = ++hour;
    }

    document.getElementsByClassName('timer')[0].innerHTML = `${minOut}:${secOut}`;
}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

document.getElementById('map').addEventListener('click', () => {
    document.getElementById('bottom-card').style.display = "none"
})