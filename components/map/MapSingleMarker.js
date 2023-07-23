import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const CENTER_DEFAULT = {lat: 13.7970244, lng: 100.5519849}


export default function MapSingleMarker(props) {
    // Get parameter from properties.
    const { center = CENTER_DEFAULT, zoom = 15, children, events , callbackMapState, callbackMarker} = props

    // map instance object.
    const [mapState, setMapState] = useState();

    const [position, setPosition] = useState();

    useEffect(() => {

    }, []);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAZwkIoSUWsWQwXOSvZ1JZTeYFC3pP2bWk',
    });

    const onLoad = useCallback(function callback(map) {
        setMapState(map);
    }, []);
    
    const onUnmount = useCallback(function callback(map) {
        setMapState(null);
        callbackMapState(null);
    }, []);
    

    const handleClickListner = (mapsMouseEvent) => {
        //console.log("handleClickListner", mapsMouseEvent.latLng.toJSON() )
        //console.log("handleClickListner", JSON.stringify(mapsMouseEvent) )

        setPosition(mapsMouseEvent.latLng)

        callbackMarker(mapsMouseEvent.latLng.toJSON())
    }

        
    return isLoaded ? (
        <div className="map-container flex items-stretch">
            <GoogleMap className="map-ref self-stretch mx-auto"
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleClickListner}
            >
                {position && <Marker position={position} /> 
                }

                {!isLoaded &&
                    React.Children.map(children, child => {
                    return React.cloneElement(child, { map, maps });
                })}
            </GoogleMap>
        </div>
    ) : (
        <></>
    );
}
