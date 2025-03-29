import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { MapContainer, Marker, Popup, TileLayer, useMap, } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "../assets/marker-icon-2x.png";
import markerIcon from "../assets/marker-icon.png";
import markerShadow from "../assets/marker-shadow.png";

interface Coordinates {
    latitude: number;
    longitude: number;
}

// Helper component to update the map view when center or zoom changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function MapPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [location, setLocation] = useState<Coordinates | null>(null);
    // Default center (e.g., country center)
    const [center, setCenter] = useState<Coordinates>({ latitude: 7.8731, longitude: 80.7718 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLocation() {
            try {
                if (Capacitor.getPlatform() === "web") {
                    // Use browser's geolocation API on web
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const coords = {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                };
                                setLocation(coords);
                                setCenter(coords);
                            },
                            (err) => {
                                console.error("Error fetching location (web):", err);
                                setError(err.message);
                            }
                        );
                    } else {
                        setError("Geolocation is not available in your browser.");
                    }
                } else {
                    // For Android, use Capacitor Geolocation API
                    L.Icon.Default.mergeOptions({
                        iconRetinaUrl: markerIcon2x,
                        iconUrl: markerIcon,
                        shadowUrl: markerShadow,
                    });
                    const permission = await Geolocation.checkPermissions();
                    if (permission.location !== "granted") {
                        const request = await Geolocation.requestPermissions();
                        if (request.location !== "granted") {
                            setError("Location permission is required to show the map.");
                            return;
                        }
                    }
                    const position = await Geolocation.getCurrentPosition();
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(coords);
                    setCenter(coords);
                }
            } catch (err: any) {
                console.error("Error fetching location:", err);
                setError(
                    err?.message ||
                    "An unexpected error occurred while retrieving your location."
                );
            }
        }

        fetchLocation();
        console.log(searchParams)
    }, []);

    return (
        <div className="map-page scroll-page fade-in">
            {error && <p className="error-message">{error}</p>}
            <div className="location-info">
                <MapContainer
                    className="fade-in"
                    style={{ height: '100dvh', width: '100dvw' }}
                    center={[center.latitude, center.longitude]}
                    zoom={7}
                    scrollWheelZoom={true}
                >
                    {/* Update map view dynamically when center changes */}
                    {location && (
                        <ChangeView center={[center.latitude, center.longitude]} zoom={20} />
                    )}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {location ? (
                        <Marker position={[location.latitude, location.longitude]}>
                            <Popup>You are here</Popup>
                        </Marker>
                    ) : (
                        !error && <p>Looking for your location...</p>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
