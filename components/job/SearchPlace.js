import React, { useState, useEffect, useRef, useContext } from 'react'
import { useRouter } from 'next/router';
import { Loader } from '@googlemaps/js-api-loader';
export default function SearchPlace(props) {
    const router = useRouter()
    // const { register, setValue, errors } = useFormContext();
    let autocomplete;
    const { _prefix, handleChangePlace, value, disabled } = props
    useEffect(() => {
        document.getElementById(`${_prefix}-pac-input`).value = value
        const loader = new Loader({
            apiKey: "AIzaSyAZwkIoSUWsWQwXOSvZ1JZTeYFC3pP2bWk",
            version: 'weekly',
            language: "th",
            libraries: ["places"]
        });

        // if (Object.keys(autocomplete).length === 0) {
        //     console.log('Object is empty');
        //     return
        // }
        loader.load().then(async () => {
            const google = window.google;
            autocomplete = new google.maps.places.Autocomplete((document.getElementById(`${_prefix}-pac-input`)))
            console.log("autocomplete ...", autocomplete)

            autocomplete && autocomplete.addListener("place_changed", () => {
                console.log("place_changed ...")
                const place = autocomplete.getPlace()

                console.log(place)
                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                let lat = place.geometry.location.lat()
                let lng = place.geometry.location.lng()
                console.log(`Latitude: ${lat}, Longitude: ${lng},_prefix${_prefix}`);
                handleChangePlace(place, lat, lng, _prefix)
            })
           
        });
        return () => {
            document.removeEventListener("place_changed", () => { });
        };
    }, [_prefix, autocomplete,value]);


    return (
        <div className="flex space-x-1 h-8">
            <div className="grow">
                <input
                    id={`${_prefix}-pac-input`}
                    // {...register(`${_prefix}.fullAddress`)}
                    // defaultValue={value}
                    // value={textSearch}
                    // onChange={onChange}
                    disabled={disabled}
                    type="text" placeholder="ค้นหาตำแหน่ง"
                    className="block w-full rounded-md border-gray-300 py-1 pl-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
            </div>

        </div>
    )

}
