import { CheckIcon, HandThumbUpIcon, MapPinIcon, PencilSquareIcon, PlusIcon, UserCircleIcon, UserIcon } from '@heroicons/react/20/solid'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import ModalJobDetail from './ModalJobDetail'
import ModalMapForm from './ModalMapForm'
import SearchPlace from './SearchPlace'

export default function JobPoint({ jobpoint, disabled, callbackJobPointDetail, jobDetail, isErrorJobPoint, calBackError }) {
    const [showMapForm, setShowMapForm] = useState(false)
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [jobpoints, setJobpoints] = useState([])
    const [indexSel, setIndexSel] = useState(0)
    const [jobPointSelect, setJobPointSelect] = useState({})
    useEffect(() => {
        setJobpoints(jobpoint)
    }, [jobpoint]);
    useEffect(() => {
        setShowJobDetailForm(isErrorJobPoint && isErrorJobPoint.length > 0)
        setIndexSel(isErrorJobPoint && isErrorJobPoint.length > 0 && isErrorJobPoint[0].index)
        setJobPointSelect({})
    }, [isErrorJobPoint]);
    useEffect(() => {
        console.log('Do something after counter has changed', indexSel, isErrorJobPoint);
    }, [indexSel]);
    const onSetMapModal = (value) => {
        setShowMapForm(value)
    }
    const openMapModal = () => {
        setShowMapForm(true)
    }
    const openJobDetailModal = () => {
        setShowJobDetailForm(true)
    }
    const onSetJobDetailModal = (value) => {
        setShowJobDetailForm(value)
        calBackError(false)
    }

    const selectPinLocation = async (e) => {

        if (e) {
            const place = await getPlaceByGeocoder(e.lat, e.lng)
            console.log(place)
            let _newValue = [...jobpoint]
            console.log("_newValue", _newValue)
            console.log("indexSel", indexSel)
            _newValue[indexSel]['fullAddress'] = place.formatted_address
            _newValue[indexSel]['lat'] = e.lat
            _newValue[indexSel]['long'] = e.lng
            if (place.address_components != null) {
                place.address_components.forEach(element => {
                    // console.log("address_components : " + JSON.stringify(element))
                    if (element.types.indexOf("street_number") > -1) {
                        _newValue[indexSel]['houseNo'] = element.short_name
                    } else if (element.types.indexOf("route") > -1) {

                    } else if (element.types.indexOf("sublocality_level_2") > -1) {
                        _newValue[indexSel]['subDistrict'] = element.short_name
                    } else if (element.types.indexOf("locality") > -1) {
                        _newValue[indexSel]['subDistrict'] = element.short_name
                    } else if (element.types.indexOf("sublocality_level_1") > -1) {
                        _newValue[indexSel]['district'] = element.short_name
                    } else if (element.types.indexOf("administrative_area_level_2") > -1) {
                        _newValue[indexSel]['district'] = element.short_name
                    } else if (element.types.indexOf("administrative_area_level_1") > -1) {
                        _newValue[indexSel]['province'] = element.short_name
                    } else if (element.types.indexOf("country") > -1) {

                    } else if (element.types.indexOf("postal_code") > -1) {
                        _newValue[indexSel]['zipcode'] = element.short_name
                    }
                });
            }
            console.log('place.address_components', place.address_components)
            setJobpoints(_newValue)
            console.log("_newValue", _newValue)
            callbackJobPointDetail("CHANGE_MAP", _newValue)
        }

    }
    const handleSaveForm = async (e) => {
        let _newValue = [...jobpoint]
        _newValue[indexSel]['contactName'] = e.contactName
        _newValue[indexSel]['contactPhone'] = e.contactPhone
        _newValue[indexSel]['height'] = e.height
        _newValue[indexSel]['length'] = e.length
        _newValue[indexSel]['package'] = e.package
        _newValue[indexSel]['parcelWeight'] = e.parcelWeight
        _newValue[indexSel]['remark'] = e.remark
        _newValue[indexSel]['locationDesc'] = e.locationDesc
        _newValue[indexSel]['width'] = e.width
        setJobpoints(_newValue)
        callbackJobPointDetail("CHANGE_DETAIL", _newValue)
    }
    async function getPlaceByGeocoder(lat, long) {
        // const map = currentMap()
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
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleChangePlace = async (place, lat, lng, _prefix) => {
        const _place = await getPlaceByGeocoder(lat, lng)
        let _newValue = [...jobpoint]
        _newValue[_prefix]['fullAddress'] = _place.formatted_address
        _newValue[_prefix]['lat'] = lat
        _newValue[_prefix]['long'] = lng
        if (_place.address_components != null) {
            _place.address_components.forEach(element => {
                // console.log("address_components : " + JSON.stringify(element))
                if (element.types.indexOf("street_number") > -1) {
                    _newValue[_prefix]['houseNo'] = element.short_name
                } else if (element.types.indexOf("route") > -1) {

                } else if (element.types.indexOf("sublocality_level_2") > -1) {
                    _newValue[_prefix]['subDistrict'] = element.short_name
                } else if (element.types.indexOf("locality") > -1) {
                    _newValue[_prefix]['subDistrict'] = element.short_name
                } else if (element.types.indexOf("sublocality_level_1") > -1) {
                    _newValue[_prefix]['district'] = element.short_name
                } else if (element.types.indexOf("administrative_area_level_2") > -1) {
                    _newValue[_prefix]['district'] = element.short_name
                } else if (element.types.indexOf("administrative_area_level_1") > -1) {
                    _newValue[_prefix]['province'] = element.short_name
                } else if (element.types.indexOf("country") > -1) {

                } else if (element.types.indexOf("postal_code") > -1) {
                    _newValue[_prefix]['zipcode'] = element.short_name
                }
            });
        }
        setJobpoints(_newValue)
        // console.log('place.address_components', _place.address_components)
        console.log("_newValue", _newValue)
        callbackJobPointDetail("CHANGE_MAP", _newValue)
    }
    return (
        <div className="flow-root">
            {/* <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-start">
                    <span className="bg-white px-3 text-lg font-medium text-gray-900">Route (Max 4 point)</span>
                </div>
            </div> */}
            <ul role="list" className="-mb-8 px-4 pt-4">
                {jobpoints.map((point, eventIdx) => (
                    <li key={eventIdx}>
                        <div className="relative pb-8">
                            {eventIdx !== jobpoint.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-2">
                                <div>
                                    <span className={"text-white bg-indigo-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"}>
                                        {eventIdx + 1}
                                    </span>
                                </div>
                                <div><span className="text-red-800">*</span></div>
                                <div className="flex flex-auto">
                                    <div className="grow">
                                        <SearchPlace
                                            _prefix={eventIdx}
                                            // onBlur={(e) => { setIndexSel(e); console.log(e) }}
                                            // handleChangePlace={(e) => { handleChangePlace(e) }}
                                            handleChangePlace={handleChangePlace}
                                            value={point.fullAddress}
                                            disabled={disabled || (jobDetail.jobPackageType === "NORMAL" && jobDetail.paymentStatus === 'PAID')}
                                        />
                                        {/* <input
                                            type="text" placeholder="ค้นหาตำแหน่ง"
                                            value={point.fullAddress}
                                            onChange={handleChangePlace}
                                            className="block w-full rounded-md border-gray-300 py-1 pl-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                            disabled={disabled || jobDetail.paymentStatus === 'PAID'}
                                        /> */}
                                    </div>

                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <button className="w-auto flex-none justify-end items-center text-blue"
                                        type="button" onClick={() => { openMapModal(eventIdx); setIndexSel(eventIdx) }} disabled={disabled || (jobDetail.jobPackageType === "NORMAL" && jobDetail.paymentStatus === 'PAID')}>
                                        <MapPinIcon
                                            className={classNames(!disabled ? "hover:fill-red-500" : "", "-ml-0.5 mr-2 h-6 w-6 fill-red-500")}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="relative flex space-x-2 py-2">
                                <div>
                                    <div className={"text-white h-8 w-8 rounded-full flex items-center justify-center"}></div>
                                </div>
                                <div><span className="text-red-800">*</span></div>
                                <div className="flex flex-auto">
                                    <div className={classNames(disabled ? "text-gray-800 bg-gray-100 " : "", "grow px-2 py-1 hover:bg-gray-100 hover:cursor-pointer rounded-lg border")}>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium text-indigo-900">
                                                {point.contactName}  {point.contactPhone ? " | " + point.contactPhone : ""}
                                            </span>
                                            <br />
                                            {
                                                point.package == "" && (point.width || point.height || point.length) && <span className="font-medium text-indigo-900">ขนาดพัสดุ(ซม.) : กว้าง {point.width || '-'} ยาว {point.length || '-'} สูง {point.height || '-'}</span>
                                            }
                                            {point.parcelWeight &&
                                                <div>
                                                    <p className="font-medium text-indigo-900">น้ำหนักพัสดุ(กก.) : {point.parcelWeight}
                                                    </p>
                                                </div>
                                            }
                                            {point.remark &&
                                                <div>
                                                    <p className="text-sm text-indigo-500">หมายเหตุ : {point.remark}
                                                    </p>
                                                </div>
                                            }
                                        </p>
                                    </div>

                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    {/* hover:fill-gray-500 hover:cursor-pointer */}
                                    <button className="w-auto flex-none justify-end items-center text-blue"
                                        type="button" onClick={() => { openJobDetailModal(eventIdx); setIndexSel(eventIdx); setJobPointSelect(point) }} disabled={disabled}>
                                        <UserCircleIcon className={classNames(!disabled ? "hover:fill-gray-500" : "", "-ml-0.5 mr-2 h-6 w-6 fill-gray-500 ")} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <ModalMapForm
                open={showMapForm}
                setOpen={onSetMapModal}
                handlePinLocation={selectPinLocation}
            />

            {/* Modal */}
            <ModalJobDetail
                open={showJobDetailForm}
                setOpen={onSetJobDetailModal}
                jobEntry={jobDetail}
                pointSeqno={indexSel}
                jobPoint={jobPointSelect}
                handleSaveForm={handleSaveForm}
            />
        </div >
    )
}