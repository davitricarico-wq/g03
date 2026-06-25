import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { registrarCoordenadaGPS } from '../utils/forms.ts';
import { TILE_URL } from '../utils/offlineMap.ts';

// Santo André - SP
const CENTRO_PADRAO: [number, number] = [-23.6639, -46.5383];
// Host único (sem subdomínio {s}) para que os tiles pré-baixados sirvam offline.
const TILE = TILE_URL;

const pinIcon = L.divIcon({
    className: '',
    html: '<div class="picker-pin"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28]
});

const currentLocationIcon = L.divIcon({
    className: '',
    html: '<div class="map-current-location-pin"><span></span></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14]
});

/** Recentraliza o mapa apenas quando `focusSignal` muda (ex.: ao capturar GPS),
 *  para não "pular" enquanto o usuário arrasta o pino. */
function Recenter({
    pos,
    currentPos,
    focusSignal,
    currentFocusSignal
}: {
    pos: [number, number] | null;
    currentPos: [number, number] | null;
    focusSignal: number;
    currentFocusSignal: number;
}) {
    const map = useMap();
    useEffect(() => {
        if (pos) map.setView(pos, Math.max(map.getZoom(), 16), { animate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusSignal]);
    useEffect(() => {
        if (!pos && currentPos) map.setView(currentPos, Math.max(map.getZoom(), 15), { animate: true });
    }, [currentPos, map, pos]);
    useEffect(() => {
        if (currentPos) map.setView(currentPos, Math.max(map.getZoom(), 16), { animate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFocusSignal]);
    // garante render correto quando o container aparece (troca de aba)
    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 60);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

function MapInteractionLock({ locked }: { locked: boolean }) {
    const map = useMap();

    useEffect(() => {
        const interactions = [
            map.dragging,
            map.touchZoom,
            map.doubleClickZoom,
            map.scrollWheelZoom,
            map.boxZoom,
            map.keyboard
        ];

        interactions.forEach((interaction) => {
            if (locked) interaction.disable();
            else interaction.enable();
        });

        const t = window.setTimeout(() => map.invalidateSize(), 50);
        return () => window.clearTimeout(t);
    }, [locked, map]);

    return null;
}

function MapControls({
    currentPos,
    locked,
    onLocate,
    onToggleLock
}: {
    currentPos: [number, number] | null;
    locked: boolean;
    onLocate: () => void;
    onToggleLock: () => void;
}) {
    const map = useMap();
    const controlsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!controlsRef.current) return;
        L.DomEvent.disableClickPropagation(controlsRef.current);
        L.DomEvent.disableScrollPropagation(controlsRef.current);
    }, []);

    function centralizarNaLocalizacao() {
        if (currentPos) {
            map.setView(currentPos, Math.max(map.getZoom(), 16), { animate: true });
        }
        onLocate();
    }

    return (
        <div className="loc-picker-controls" ref={controlsRef}>
            <button
                type="button"
                className="loc-map-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    centralizarNaLocalizacao();
                }}
            >
                Minha localização
            </button>
            <button
                type="button"
                className={`loc-map-btn ${locked ? 'locked' : ''}`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock();
                }}
            >
                {locked ? 'Destravar mapa' : 'Travar mapa'}
            </button>
        </div>
    );
}

function ClickCapture({ locked, onPick }: { locked: boolean; onPick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (locked) return;
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
    const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
    const [mapLocked, setMapLocked] = useState(true);
    const [currentFocusSignal, setCurrentFocusSignal] = useState(0);
    const lat = Number(latitude);
    const lng = Number(longitude);
    const temPos = latitude.trim() !== '' && longitude.trim() !== '' && Number.isFinite(lat) && Number.isFinite(lng);
    const pos: [number, number] | null = temPos ? [lat, lng] : null;
    const center = pos ?? currentPos ?? CENTRO_PADRAO;

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coordenada = registrarCoordenadaGPS(position);
                setCurrentPos([coordenada.latitude, coordenada.longitude]);
            },
            () => setCurrentPos(null),
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 10000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    function localizarUsuario() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordenada = registrarCoordenadaGPS(position);
                setCurrentPos([coordenada.latitude, coordenada.longitude]);
                setCurrentFocusSignal((signal) => signal + 1);
            },
            () => undefined,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    return (
        <div className="loc-picker">
            <MapContainer center={center} zoom={temPos || currentPos ? 16 : 13} className="loc-picker-map" zoomControl scrollWheelZoom={!mapLocked} dragging={!mapLocked}>
                <TileLayer url={TILE} attribution="&copy; OpenStreetMap" />
                <ClickCapture locked={mapLocked} onPick={onChange} />
                <MapInteractionLock locked={mapLocked} />
                <MapControls
                    currentPos={currentPos}
                    locked={mapLocked}
                    onLocate={localizarUsuario}
                    onToggleLock={() => setMapLocked((locked) => !locked)}
                />
                <Recenter pos={pos} currentPos={currentPos} focusSignal={focusSignal} currentFocusSignal={currentFocusSignal} />
                {currentPos && (
                    <Marker position={currentPos} icon={currentLocationIcon} zIndexOffset={1000}>
                        <Popup>Sua localização atual</Popup>
                    </Marker>
                )}
                {pos && (
                    <Marker
                        key={`moradia-${pos[0]}-${pos[1]}-${mapLocked ? 'locked' : 'unlocked'}`}
                        position={pos}
                        icon={pinIcon}
                        draggable={!mapLocked}
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
                    ? 'Pino vermelho: moradia. Pino azul: sua localização atual. Arraste ou clique no mapa para ajustar a casa.'
                    : 'Pino azul: sua localização atual. Clique no mapa para marcar a localização da casa.'}
            </p>
        </div>
    );
}
