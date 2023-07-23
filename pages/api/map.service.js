
let myMapData; //Google map instance
let markers = [] //Marker pin on google map
let _directionsRenderer = null
let totalDistance = 0 //kilometer

export const MapService = {
    setMap,
    getMap,
    renderMarker,
    addMarker,
    setMarker,
    // drawDirectionRoute,
    getTotalDistance,
    // getDistince,
    getDirectionAsync,
    getDirectionAsyncInitCharge,
    getPlaceByGeocoder,
};

function setMap(map) {
    myMapData = map
}

function getMap() {
    return myMapData
}

function currentMap() {
    return myMapData
}


// const addWaypoint = () => {
//     const waypointCnt = waypoints.length
//     let point = {
//         "uuid" : uuid() ,
//         "pointSeq" : waypointCnt + 1,
//     }   

//     setWaypoints([...waypoints, point])

//     console.log(" waypoints " + waypoints.length)
// }

function jobPointToMapsLatLng(jobPoint) {
    console.log("jobPointToMapsLatLng : ", jobPoint)
    const latitude = Number(jobPoint.lat)
    const longitude = Number(jobPoint.long)
    return new google.maps.LatLng({ lat: latitude, lng: longitude });
}



function getTotalDistance() {
    return totalDistance
}

// ===================================================================================================
// Start : Marker Function ---------------------------------------------------------------------------
// Adds a marker to the map and push to the array.
function addMarker(seqNo, placeName, latitude, longitude) {
    const map = currentMap()

    let position = { lat: latitude, lng: longitude }

    console.log("addMarker " + seqNo + " " + placeName, latitude, longitude)

    const marker = new google.maps.Marker({
        position,
        map,
        title: `${seqNo}. ${placeName}`,
        label: {
            text: `${seqNo}`,
            color: "white"
        },
        optimized: false,
    });

    // Create an info window to share between markers.
    const infoWindow = new google.maps.InfoWindow();

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker.getTitle());
        infoWindow.open(marker.getMap(), marker);
    });

    markers.push(marker);
}

function setMarker(seqNo, placeName, latitude, longitude) {
    if (markers.length <= seqNo) {
        addMarker(seqNo, placeName, latitude, longitude)
        return
    }

    markers[seqNo].setMap(null);

    const map = currentMap()

    let position = { lat: latitude, lng: longitude }

    console.log("addMarker " + seqNo + " " + placeName, latitude, longitude)

    const marker = new google.maps.Marker({
        position,
        map,
        title: `${seqNo + 1}. ${placeName}`,
        label: {
            text: `${seqNo + 1}`,
            color: "white"
        },
        optimized: false,
    });

    // Create an info window to share between markers.
    const infoWindow = new google.maps.InfoWindow();

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker.getTitle());
        infoWindow.open(marker.getMap(), marker);
    });

    markers[seqNo] = marker
}

function renderMarker(jobPoints) {
    clearMarkers()

    console.log("renderMarker..")
    if (jobPoints && jobPoints.length > 0) {
        console.log("renderMarker marker " + jobPoints.length + " locations.")

        for (var i = 0; i < jobPoints.length; i++) {
            const p = jobPoints[i]

            let lat = p.lat
            let lng = p.long

            addMarker(i + 1, p.fullAddress, lat, lng)
        }
    } else {
        console.log("renderMarker, jobPoints is empty")
    }
}

// Sets the map on all markers in the array.
function setMapOnAll() {
    const map = currentMap()

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function clearMarkers() {
    if (markers && markers.length > 0) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    markers = [];
}

// End : Marker Function ---------------------------------------------------------------------------
// ===================================================================================================


// ===================================================================================================
// Start : Direction-Route Function ------------------------------------------------------------------
/*
const getDistanceMatrix = (service, data) => new Promise((resolve, reject) => {
    service.getDistanceMatrix(data, (response, status) => {
        console.log("service.getDistanceMatrix = ", status)
        console.log("service.getDistanceMatrix = ", response)
        if(status === 'OK') {
            resolve(response)
        } else {
            reject(response);
        }
    })
});


async function getDistince(){
    const service = new google.maps.DistanceMatrixService();

    const origin = jobPointToMapsLatLng(_source)
    const destination = jobPointToMapsLatLng(_destination)

    let waypts = []

    if( waypoint.length > 0 ){
        waypts.push({
            location: new google.maps.LatLng({lat: -34, lng: 151}),
            stopover: true,
        });
    }

    var requestRoute = {
        // origin: origin,
        // destination: destination,
        origins: [origin],
        destinations: [destination],
        // waypoints: waypts,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
    };

    console.log("requestRoute ", requestRoute)
    const result = await getDistanceMatrix( service, requestRoute )

    return {
        distance: result.rows[0].elements[0].status
    };
}
*/

async function getDirectionAsync(requestRoute) {
    const map = currentMap()

    const directionsService = new google.maps.DirectionsService()
    /*
    const origin = jobPointToMapsLatLng(_source)
    const destination = jobPointToMapsLatLng(_destination)
    let _waypts = []

    var requestRoute = {
        origin: origin,
        destination: destination,
        waypoints: _waypts,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
    };
    */

    const response = await directionsService.route(requestRoute)
    const status = await response.status

    let myroute = null
    if (status == "OK") {
        myroute = response.routes[0]
        //console.log("directionsService.route = " + JSON.stringify(myroute) )

        //Clear Marker on map
        clearMarkers()

        //Clear RouteDirection on map
        if (_directionsRenderer != null) {
            _directionsRenderer.setMap(null)
        }

        //Render on map
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map)
        directionsRenderer.setDirections(response);
        _directionsRenderer = directionsRenderer

        //Find distince
        return computeTotalDistance(response)
    } else {
        console.error("Error, cannot find result from directionsService.route service.")
    }

};

async function getDirectionAsyncInitCharge(requestRoute) {
    const map = currentMap()

    const directionsService = new google.maps.DirectionsService()
    const response = await directionsService.route(requestRoute)
    const status = await response.status

    let myroute = null
    if (status == "OK") {
        myroute = response.routes[0]

        //Find distince
        return computeTotalDistance(response)
    } else {
        console.error("Error, cannot find result from directionsService.route service.")
    }
};

/*
function drawDirectionRoute(divIdRenderLeg) {
    const map = currentMap()

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map)

    if( divIdRenderLeg ){
        directionsRenderer.setPanel(divIdRenderLeg)
    }


    directionsRenderer.addListener('directions_changed', () => {
        const directions = directionsRenderer.getDirections();
    
        if (directions) {
            computeTotalDistance(directions);
        }
    });


    displayRoute(directionsService, directionsRenderer)
}

function displayRoute(directionsService, directionsRenderer) {

    const origin = jobPointToMapsLatLng(_source)
    const destination = jobPointToMapsLatLng(_destination)

    let _waypts = []

    if( waypoint.length > 0 ){
        _waypts.push({
            location: new google.maps.LatLng({lat: -34, lng: 151}),
            stopover: true,
        });
    }

    var requestRoute = {
        origin: origin,
        destination: destination,
        waypoints: _waypts,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
    };
    
    directionsService.route(requestRoute)
    .then((result) => {
        directionsRenderer.setDirections(result);

    }).catch((e) => {
        alert('Could not display directions due to: ' + e);

    });
        
}
*/

function computeTotalDistance(result) {
    console.log("computeTotalDistance..")
    let sumDistance = 0; //unit kilometer
    let sumDuration = 0; //Unit sec.

    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        //Distance value
        sumDistance += myroute.legs[i].distance.value;

        //Duration value
        sumDuration += myroute.legs[i].duration.value;
    }

    // let totalDistance = Math.floor(sumDistance / 1000);
    let totalDistance = sumDistance / 1000;
    console.log("computeTotalDistance = ", totalDistance)

    let totalMinutes = Math.floor(sumDuration / 60);
    console.log("computeTotalMinutes = ", totalMinutes)

    return { "distance": totalDistance, "duration": totalMinutes }
}
// End : Direction-Route Function --------------------------------------------------------------------
// ===================================================================================================


// Start : Geocoding Service Function --------------------------------------------------------------------
// ===================================================================================================
async function getPlaceByGeocoder(lat, long) {
    const map = currentMap()

    var latlng = new google.maps.LatLng(lat, long)

    var requestGeo = {
        location: latlng,
    };

    try {
        const geocoderService = new google.maps.Geocoder()
        const response = await geocoderService.geocode(requestGeo)

        // console.log("response = " + JSON.stringify(response))

        let geocoderResult = response.results[0]

        return geocoderResult

    } catch (error) {
        console.error("Error, cannot find result from geocoderService.geocode service.")
        console.error(error)
    }

};

// End : Geocoding Service Function --------------------------------------------------------------------
// ===================================================================================================