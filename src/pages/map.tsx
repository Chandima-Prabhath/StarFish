import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function MapPage() {
    const [location, setLocation] = useState<Coordinates | null>(null);
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
                    <h2>Your Location</h2>
                    <p>Latitude: {location.latitude.toFixed(6)}</p>
                    <p>Longitude: {location.longitude.toFixed(6)}</p>
                    <MapContainer center={[location.latitude, location.longitude]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[location.latitude, location.longitude]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
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
