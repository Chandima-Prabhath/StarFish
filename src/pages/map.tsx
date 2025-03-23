import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./map.css";

// Import marker images as ES modules
import markerIcon2x from "../assets/marker-icon-2x.png";
import markerIcon from "../assets/marker-icon.png";
import markerShadow from "../assets/marker-shadow.png";

// Fix default marker icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function MapPage() {
    const [location, setLocation] = useState<Coordinates | null>({ latitude: 6.905870, longitude: 81.135293 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLocation() {
            try {
                // Check existing permissions
                const permission = await Geolocation.checkPermissions();

                // If permission is not granted, request it.
                if (permission.location !== "granted") {
                    const request = await Geolocation.requestPermissions();
                    if (request.location !== "granted") {
                        setError("Location permission is required to show the map.");
                        return;
                    }
                }

                // Get the current position
                const position = await Geolocation.getCurrentPosition();
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            } catch (err: any) {
                console.error("Error fetching location:", err);
                setError(
                    err?.message || "An unexpected error occurred while retrieving your location."
                );
            }
        }

        fetchLocation();
    }, []);

    return (
        <div className="map-page scroll-page fade-in">
            {error && <p className="error-message">{error}</p>}
            {location ? (
                <div className="location-info">
                    <MapContainer style={{ height: '100dvh', width: '100%' }} center={[location.latitude, location.longitude]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[location.latitude, location.longitude]}>
                            <Popup>
                                Your current location
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            ) : (
                !error && <p>Fetching your location...</p>
            )}
        </div>
    );
}
