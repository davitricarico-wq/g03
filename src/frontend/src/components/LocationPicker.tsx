import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Santo André - SP
const CENTRO_PADRAO: [number, number] = [-23.6639, -46.5383];
const TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const pinIcon = L.divIcon({
    className: '',
    html: '<div class="picker-pin"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28]
});

/** Recentraliza o mapa apenas quando `focusSignal` muda (ex.: ao capturar GPS),
 *  para não "pular" enquanto o usuário arrasta o pino. */
function Recenter({ pos, focusSignal }: { pos: [number, number] | null; focusSignal: number }) {
    const map = useMap();
    useEffect(() => {
        if (pos) map.setView(pos, Math.max(map.getZoom(), 16), { animate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusSignal]);
    // garante render correto quando o container aparece (troca de aba)
    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 60);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onPick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
        }
    });
    return null;
}

interface LocationPickerProps {
    latitude: string;
    longitude: string;
    focusSignal?: number;
    onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, focusSignal = 0, onChange }: LocationPickerProps) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const temPos = latitude.trim() !== '' && longitude.trim() !== '' && Number.isFinite(lat) && Number.isFinite(lng);
    const pos: [number, number] | null = temPos ? [lat, lng] : null;
    const center = pos ?? CENTRO_PADRAO;

    return (
        <div className="loc-picker">
            <MapContainer center={center} zoom={temPos ? 16 : 13} className="loc-picker-map" zoomControl scrollWheelZoom>
                <TileLayer url={TILE} attribution="&copy; OpenStreetMap" />
                <ClickCapture onPick={onChange} />
                <Recenter pos={pos} focusSignal={focusSignal} />
                {pos && (
                    <Marker
                        position={pos}
                        icon={pinIcon}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const m = e.target as L.Marker;
                                const ll = m.getLatLng();
                                onChange(Number(ll.lat.toFixed(6)), Number(ll.lng.toFixed(6)));
                            }
                        }}
                    />
                )}
            </MapContainer>
            <p className="loc-picker-hint">
                {pos
                    ? 'Arraste o pino ou clique no mapa para ajustar a localização exata da casa.'
                    : 'Clique no mapa para marcar a localização da casa (caso o GPS não funcione).'}
            </p>
        </div>
    );
}
