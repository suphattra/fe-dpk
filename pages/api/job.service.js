import { authService } from './auth/auth-service';
import { http } from './nxrider/http.endpoint.nxrider';

export const JobService = {
    getJobList,
    getJobDetail,
    updateJob,
    createJob,
    updateJobPointDetail,
    createJobPointDetail,

    calculatePrice,

    getDirectionRequestInitialCharge,
    getDirectionRequestForGoogleMap,
    adjustTimeDuration,

    getAttach,
    attachfile,
    deleteAttachfile,
    getAttachfile,

    assignJobToDriver,
    unassignJobDriver,
    updateJobLock,
    overLapTimeDriver,
    recalculateJobPlan
};

async function getJobList(param) {
    try {
        return http.get(`/nx/v1/job`, param);
    } catch (err) {
        console.log(err)
    }
}
async function getJobDetail(param) {
    try {
        return http.get(`/nx/v1/job/${param}`);
    } catch (err) {
        console.log(err)
    }
}

async function updateJob(param, data) {
    try {
        return http.put(`/nx/v1/job/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createJob(data) {
    try {
        return http.post(`/nx/v1/job`, data);
    } catch (err) {
        console.log(err)
    }
}

async function updateJobPointDetail(param, data) {
    try {
        return http.put(`/nx/v1/job/job-point/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function createJobPointDetail(data) {
    try {
        return http.post(`/nx/v1/job/job-point`, data);
    } catch (err) {
        console.log(err)
    }
}
async function getAttach(param) {
    try {
        return http.get(`/nx/v1/job/${param}/attach`);
    } catch (err) {
        console.log(err)
    }
}
async function attachfile(param, data) {
    try {
        return http.post(`/nx/v1/job/${param}/attach`, data);
    } catch (err) {
        console.log(err)
    }
}
async function deleteAttachfile(param) {
    try {
        return http.del(`/nx/v1/job/attach/${param}`);
    } catch (err) {
        console.log(err)
    }
}
async function getAttachfile(param) {
    try {
        return http.getfile(`/nx/v1/job/attach/${param}`);
    } catch (err) {
        console.log(err)
    }
}
async function calculatePrice(id, distance1, distance2, extraCharge, usePackage) {
    try {
        let userId = authService.getUserId()
        const requestPayload = {
            userId: userId,
            customerId: id,
            distanceFromOrigin: distance1,
            distanceSendReceive: distance2,
            totalExtraCharge: extraCharge,
            usePackage: usePackage
        }
        return http.post(`/nx/v1/job/price`, requestPayload);
    } catch (err) {
        console.log(err)
    }
}

async function assignJobToDriver(param, data) {
    try {
        return http.put(`/nx/v1/job/assign-job/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function unassignJobDriver(param, data) {
    try {
        return http.put(`/nx/v1/job/unassign-job/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function updateJobLock(param, data) {
    try {
        return http.put(`/nx/v1/job/job-lock/${param}`, data);
    } catch (err) {
        console.log(err)
    }
}
async function overLapTimeDriver(driverId, shipmentDate, startTime, endTime) {
    try {
        let userId = authService.getUserId()
        const requestPayload = {
            userId: userId,
            driverId: driverId,
            shipmentDate: shipmentDate,
            startTime: startTime,
            endTime: endTime
        }
        return http.post(`/nx/v1/job/overlap`, requestPayload);
    } catch (err) {
        console.log(err)
    }
}
async function recalculateJobPlan(param) {
    try {
        return http.get(`/nx/v1/job-plan/recalculate`, param);
    } catch (err) {
        console.log(err)
    }
}

// let jobPoints = []
let startLocation = null
let finishLocation = null

function convertToMapsLatLng(jobPoint) {
    console.log("jobPointToMapsLatLng : ", jobPoint)
    const latitude = parseFloat(jobPoint.lat)
    const longitude = parseFloat(jobPoint.long)
    return new google.maps.LatLng({ lat: latitude, lng: longitude });
}

function findWaypoints(_jobPointList) {
    if (_jobPointList == null || _jobPointList.length == 0) {
        console.error("Please call function setJobPointList first.")
        return
    }

    if (_jobPointList.length < 2) {
        console.error("Two locations are required to get directions between them.")
        return
    }

    startLocation = _jobPointList[0]
    finishLocation = _jobPointList[_jobPointList.length - 1]
    let _waypts = []

    console.log(`JobService.findWaypoints origin : new google.maps.LatLng({lat: ${startLocation.lat}, lng: ${startLocation.long}}) Name:${startLocation.fullAddress}`)

    for (var i = 1; i < _jobPointList.length - 1; i++) {
        var point = _jobPointList[i]
        // _waypts.push({
        //     location: new google.maps.LatLng({lat: -34, lng: 151}),
        //     stopover: true,
        // });

        _waypts.push({
            location: convertToMapsLatLng(point),
            stopover: true,
        });

        console.log(`JobService.findWaypoints waypoint : new google.maps.LatLng({lat: ${point.lat}, lng: ${point.long}}) Name:${point.fullAddress} `)
    }

    console.log(`JobService.findWaypoints destination : new google.maps.LatLng({lat: ${finishLocation.lat}, lng: ${finishLocation.long}}) Name:${finishLocation.fullAddress} `)


    const resultObject = {
        origin: convertToMapsLatLng(startLocation),
        destination: convertToMapsLatLng(finishLocation),
        waypoints: _waypts,
    }

    return resultObject
}
async function getDirectionRequestInitialCharge(jobPoints) {
    console.log("getDirectionRequestInitialCharge")
    const origin = new google.maps.LatLng({ lat: 13.696248694330697, lng: 100.53760124006553 }) //panjathaniL
    const resultObject = await findWaypoints(jobPoints)
    console.log("resultObject.origin", resultObject.origin.lat)
    const destination = resultObject.origin

    var requestRoute = {
        origin: origin,
        destination: destination,
        waypoints: [],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
    };

    return requestRoute
}

async function getDirectionRequestForGoogleMap(jobPoints) {
    console.log("getDirectionRequestForGoogleMap")
    if (startLocation == null) {
        console.error("Start location is null. Please call function setJobPointList first.")
        return
    }

    if (finishLocation == null) {
        console.error("Finsih location is null. Please call function setJobPointList first.")
        return
    }

    const resultObject = findWaypoints(jobPoints)

    const origin = resultObject.origin
    const destination = resultObject.destination
    const waypoints = resultObject.waypoints

    var requestRoute = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true,
    };

    return requestRoute
}


async function adjustTimeDuration(minuteValue) {
    // Initiate an infinite loop
    for (; ;) {
        minuteValue += 1
        if (minuteValue % 15 == 0) {
            break
        }
    }

    return minuteValue
}