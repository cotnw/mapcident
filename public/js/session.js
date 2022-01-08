var map = null;
var marker = [];
let crashes = [];
let currentPosition = [];
let currentMarkerLocation = [];
let resonanceId = "";
navigator.geolocation.getCurrentPosition(showPosition);
let karma = 0;

window.resonanceAsyncInit = function() {
    if (!Resonance.isCompatible()) {
        console.error('Your browser is not supported');
    }

    var resonance = new Resonance('9ab05624-9086-4b88-9606-a8ffad4932ed');

    resonance.startSearch('LAPTOP', function(error) {
        if (error) {
            console.error(error.message);
        } else {
            resonanceId = resonance.wsClient._clientId;
            console.log('resonance id : ' + resonanceId)
            fetch(`/api/user/resonance?token=${localStorage.getItem('accessToken')}&resonance_id=${resonance.wsClient._clientId}`).then(res => res.json()).then(data => {
                console.log(data)
            })
        }
    });

    resonance.on('nearbyFound', function(nearby) {
        console.log(nearby.clientId);
    });

    resonance.on('searchStopped', function(error) {
        if (error) {
            console.error(error.message);
        } else {
            // search was stopped normally
        }
    });
};


function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
var aDay = 24 * 60 * 60 * 1000;
console.log(timeSince(new Date(Date.now() - aDay)));
console.log(timeSince(new Date(Date.now() - aDay * 2)));

function showPosition(position) {
    currentPosition = [position.coords.latitude, position.coords.longitude];
    console.log(currentPosition);
    map = new MapmyIndia.Map('map', {
        center: currentPosition,
        zoomControl: true,
        hybrid: true
    });

    function getAllCrashes() {
        let url = `/api/crashes`;
        fetch(url).then(res => res.json()).then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let lat = data[i].location[0];
                let lon = data[i].location[1];
                let crash = [lat, lon];
                crashes.push(crash);
            }
            loadAllCrashes(data);
        });
    }

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
        mk.on("click", async function(e) {
            mapmyindia_fit_markers_into_bound(position);
            currentMarkerLocation = [position.lat, position.lng];
            calculateDistance(position, title);
            console.log(title)
        });
        return mk;
    }

    async function calculateDistance(crashPosition, crashResponse) {
        let crash = JSON.parse(crashResponse);
        let date = new Date(crash.date);
        let url = `https://api.radar.io/v1/route/distance?origin=${currentPosition[0]},${currentPosition[1]}&destination=${crashPosition.lat},${crashPosition.lng}&modes=car&units=metric`;
        fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                document.querySelector('#bottom-card > h1').innerHTML = data.routes.car.distance.text + ' away';
                document.querySelector('#bottom-card > p').innerHTML = 'Last updated ' + timeSince(date) + ' ago';
                document.querySelector('#expanded-bottom-card > div > div > h1').innerHTML = data.routes.car.distance.text + ' away';
                document.querySelector('#expanded-bottom-card > div > div > p').innerHTML = 'Last updated ' + timeSince(date) + ' ago';
                document.querySelector('#victim-id').value = crash.victim;
                document.getElementById('bottom-card').style.display = "block"
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

    function loadAllCrashes(crashResponse) {
        var icon = L.icon({
            iconUrl: 'https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png',
            iconRetinaUrl: 'https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png',
            iconSize: [100, 100],
            popupAnchor: [-3, -15]
        });
        for (let i = 0; i < crashes.length; i++) {
            var position = new L.LatLng(crashes[i][0], crashes[i][1]);
            console.log(position)
            marker.push(addMarker(position, icon, JSON.stringify(crashResponse[i]), false));
        }
    }
    getAllCrashes();
    markCurrentLocation();
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

document.getElementById('google-maps-icon').addEventListener('click', () => {
    window.open(`https://maps.google.com/?q=${currentMarkerLocation[0]},${currentMarkerLocation[1]}`)
})

document.getElementById('bottom-card-respond-button').addEventListener('click', () => {
    socket.emit('respond', { victim: document.querySelector('#victim-id').value, resonance_id: resonanceId });
    let url = '/api/user';
    fetch(`${url}?token=${document.querySelector('#victim-id').value}`).then(res => res.json()).then(data => {
        console.log(data);
        document.querySelector('#name').innerHTML = data.name;
        document.querySelector('#gp').innerHTML = `${data.gender}, ${data.phone_number}`;
        document.querySelector('#bg').innerHTML = `Blood Group: ${data.blood_group}`;
        document.querySelector('#epn').innerHTML = `${data.emergency_contact.phone_number}`;
        document.querySelector('#at').innerHTML = `${data.alert_time}s`;
    }).catch(err => console.log(err));
    document.getElementById('bottom-card').style.display = 'none'
    document.getElementById('expanded-bottom-card').style.display = 'block'
})

document.getElementsByClassName('pending-button')[0].addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(curPosition);

    function curPosition(position) {
        let url = `https://api.radar.io/v1/route/distance?origin=${position.coords.latitude},${position.coords.longitude}&destination=${currentMarkerLocation[0]},${currentMarkerLocation[1]}&modes=car&units=metric`;
        fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.routes.car.distance.value <= 10) {
                    document.getElementsByClassName('pending-button')[0].style.background = '#43B862';
                    document.getElementsByClassName('pending-button')[0].innerText = 'Success';
                    karma += 10;
                    fetch(`/api/user/success?token=${localStorage.getItem('accessToken')}`).then(res => res.json()).then(data => {}).catch(err => console.log(err));
                    setTimeout(() => {
                        document.getElementById('successAlert').style.display = "block";
                    }, 2000)

                }
            })
            .catch(err => console.log(err));
    }
})

document.getElementById('respond-button').addEventListener('click', () => {
    document.getElementById('alertModal').style.display = 'none'
    document.getElementById('expanded-bottom-card').style.display = 'block'
})

document.getElementById('end').addEventListener('click', () => {
    // send time of session and karma collected to a past record saving endpoint
    fetch(`/api/user/record?token=${localStorage.getItem('accessToken')}`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date: '9th',
            month: 'January',
            day: 'Sunday',
            creditsEarned: karma,
            totalTime: document.getElementsByClassName('timer')[0].innerHTML
        })
    }).then(res => res.json()).then(data => {
        window.location.href = '/dashboard';
    }).catch(err => console.log(err));
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