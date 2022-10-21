
import React, { useMemo, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"

const LocationCenter = ({ lat, lng, zoom = 12 }) => {
    const map = useMap()
  
    useEffect(() => {
        map.setView([lat, lng], zoom)
    }, [lat, lng, zoom])
  
    return null
}

const MapMarker = ({ onChangeMarker, zoom }) => {
    const map = useMapEvents({
        click: (e) => {
            onChangeMarker(e.latlng, map.getZoom())
        }
    })
    return null
}

const MapChoose = ({ city, marker, onChangeMarker, zoom }) => {
    const lat = useMemo(() => {
        if (marker !== null) {
            return marker.lat
        }
        if (city === null) {
            return 35.694390000000055
        }
        return city.lat
    }, [city, marker])

    const lng = useMemo(() => {
        if (marker !== null) {
            return marker.lng
        }
        if (city === null) {
            return 51.42151000000007
        }
        return city.lng
    }, [city, marker])

    const myIcon = L.icon({
        iconUrl: '/assets/leaflet/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [13, 35],
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null
    })

    return <>
        <div className="relative overflow-hidden h-96 dir-ltr">
            <MapContainer center={[lat, lng]} zoom={zoom} className="h-96">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapMarker onChangeMarker={onChangeMarker} zoom={zoom}/>
                <LocationCenter lat={lat} lng={lng} marker={marker} zoom={zoom} />
                {marker !== null && <Marker position={[marker.lat, marker.lng]} icon={myIcon} autoPan></Marker>}
            </MapContainer>
        </div>
    </>
}
export default MapChoose