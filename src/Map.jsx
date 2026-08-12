import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MAP_CENTER, MAP_ZOOM } from "./data/events";
import { pinIcon } from "./pinIcon";
import EventCard from "./EventCard";
import "./Map.css";

export default function Map({ events }) {
    return(
        <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {events && events.filter(e => e.locations).map((event) => (
                <Marker key={event.id} position={[event.locations.lat, event.locations.lng]} icon={pinIcon}>
                    <Popup closeButton={true}>
                        <EventCard event={event}></EventCard>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}