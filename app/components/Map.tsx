"use client"

import React, { useEffect, useRef, useState } from "react";
import L, {LatLng, Map, PointExpression} from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../../public/images/icons/no-outlets-confirmed.png";
import '../utils/Leaflet.DoubleTapDrag';
import '../utils/Leaflet.DoubleTapDragZoom';
import { placeMarker } from "@/app/utils/mapHandler";

const iconSize: PointExpression = [48, 48];
const iconAnchor: PointExpression = [24, 45];
const popupAnchor: PointExpression = [0, -45];

let locationDetected: boolean = false;

function buildIcon(path: string,
                   customSize: PointExpression = iconSize,
                   customIconAnchor: PointExpression = iconAnchor,
                   customPopupAnchor: PointExpression = popupAnchor,
                   ): L.Icon {
    return L.icon({
        iconUrl: '/images/icons/' + path,

        iconSize: customSize,
        iconAnchor: customIconAnchor,
        popupAnchor: customPopupAnchor,
    })
}

function buildFormMarkup(e: LatLng): string {
    return (`
        <div class="font-montserrat">
            <div class="text-2xl mb-5 text-center font-bold">Adding point</div>
            <form onsubmit="#" id="addPoint">
                <div class="flex-col justify-items-center items-center min-w-[300px]">
                    <div class="w-full mb-4">Coordinates: <input class="text-center focus:outline-0" type="text" id="coordinates" name="coordinates" readonly
                    value="[` + e.lat.toFixed(6).toString() + ', ' + e.lng.toFixed(6).toString() + `]"/></div>
                    <div class="w-full mb-2"><input class="w-full p-[8px] focus:outline-gray-400" type="text" id="name" name="name" required placeholder="Name*"/></div>
                    <div class="w-full mb-2"><input class="w-full p-[8px] focus:outline-gray-400" type="text" id="description" name="description" required placeholder="Description*"/></div>
                    <div class="w-full mb-2"><input class="w-full" type="file" id="photo" name="photo" accept=".png, .jpg, .jpeg, .gif" /></div>
                    
                    <div class="radio-wrapper-19">
                        <div class="radio-inputs-19">
                            <label for="example-19-1">
                                <input id="example-19-1" type="radio" name="type" required value="has-outlets">
                                <span class="name"><span class="text-green-700">Has outlets</span></span>
                            </label>
                            <label for="example-19-2">
                                <input id="example-19-2" type="radio" name="type" required value="no-outlets">
                                <span class="name"><span class="text-red-600">No outlets</span></span>
                            </label>
                        </div>
                    </div>
                    <div class="w-full mb-2 flex justify-center">
                        <input class="w-full text-center button-6" type="submit" id="submit" value="Add point">
                    </div>
                </div>
            </form>
        </div>`
    )
}

async function populateMap(leafletMap: Map) {
    const req = await fetch("api/points");
    const json = await req.json();
    json.points.map((point: any) => {
        const pointIconName: string = point.type + (point.is_confirmed ? '-' : '-not-') + 'confirmed.png';
        placeMarker(leafletMap, JSON.parse(point.coordinates), buildIcon(pointIconName), JSON.stringify({
            name: point.name,
            is_confirmed: point.is_confirmed,
            photo: point.photo,
            description: point.description
        }))
    })
}

async function placeNewPoint(map: Map, coords: L.LatLng) {
    const latlngAsString = '[' + coords.lat.toFixed(6).toString() + ', ' + coords.lng.toFixed(6).toString() + ']';
    const req = await fetch('/api/get-point?coordinates=' + encodeURIComponent(latlngAsString), {
        method: 'GET',
    });
    const reqJSON = await req.json();
    const newPoint = reqJSON.point;
    const pointIconName: string = newPoint.type + (newPoint.is_confirmed ? '-' : '-not-') + 'confirmed.png';
    placeMarker(map, JSON.parse(newPoint.coordinates), buildIcon(pointIconName), JSON.stringify({
        name: newPoint.name,
        is_confirmed: newPoint.is_confirmed,
        photo: newPoint.photo,
        description: newPoint.description
    }))
}

function setLocationDetected(value: boolean): void { // Did this for shits and giggles tbh
    locationDetected = value;
}

export default function MapDisplay() {


    const mapRef = useRef(null);
    const mapProt = useRef<Map | null>(null);

    useEffect(() => {

        if (mapRef.current && !mapProt.current) {
            mapProt.current = L.map(mapRef.current, {
                // @ts-expect-error: doubleTapDragZoom is very much there but for some reason is unrecognized
                doubleTapDragZoom: 'center',
                doubleTapDragZoomOptions: {
                    reverse: true,
                },
                zoomSnap: 0.01,
                zoomControl: false,
            })
            .setView([55.751934, 37.618346], 16);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            }).addTo(mapProt.current);
            const map = mapProt.current;
            const locationMarker = L.marker([55.751934, 37.618346], {
                icon: buildIcon('user-location.png', [32, 32], [16, 16], [0, -15])
            })
                .bindPopup("<div class='font-montserrat font-bold text-xl text-center'>You are here</div>")
                .addTo(map);

            const onLocationFound = ((e: any): void => {
                if (!locationDetected) {
                    map.setView(e.latlng, map.getZoom());
                    setLocationDetected(true);
                }
                locationMarker.setLatLng(e.latlng);
            });
            const onLocationError = ((e: any): void => {
                map.setView([55.751934, 37.618346], 16);
                locationMarker.remove();
            })
            const onContextMenu = ((coords: any) => {
                const marker = L.marker(coords.latlng, {
                    icon: buildIcon('outlets-not-defined-confirmed.png')
                }).addTo(map)
                    .bindPopup(buildFormMarkup(coords.latlng), {
                        keepInView: true,
                        //autoPan: true,
                        //autoPanPadding: markerPadding,
                    }).openPopup();
                marker.on('popupclose', () => {
                    const element = marker.getElement();
                    if (element) {
                        element.style.transition = 'opacity 0.3s ease';
                        element.style.opacity = '0';
                    }
                    setTimeout(() => {
                        map.removeLayer(marker);
                    }, 300);
                })

                const form = document.getElementById("addPoint") as HTMLFormElement;
                form.addEventListener('submit', async (e: Event) => {
                    e.preventDefault();

                    const target = e.target as HTMLFormElement;
                    const formData = new FormData(target);
                    const jsonData: Record<string, any> = {};

                    let photoName: string = '';

                    const file = (document.getElementById('photo') as HTMLInputElement).files?.[0];
                    if (file) {
                        const arrayBuffer = await file.arrayBuffer();
                        const blob = new Blob([arrayBuffer], { type: file.type });
                        photoName = crypto.randomUUID() + '.' + file.type.split('/')[1];

                        await fetch('/api/upload-photo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': file.type,
                                'X-Filename': photoName,
                            },
                            body: blob,
                        })
                    }

                    formData.forEach((value, key) => {
                        key != 'photo' ? (jsonData[key] = value) : jsonData[key] = photoName;
                    });
                    jsonData['is_confirmed'] = true;  // TODO: change when implementing access levels
                    const res = await fetch('/api/add-point', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    })
                    if (res.ok) {
                        let star_count = Number(localStorage.getItem("star_count"));
                        if (star_count == null) star_count = 0;
                        star_count += 10;
                        localStorage.setItem("star_count", String(star_count));
                        marker.bindPopup(`
                        <div class='font-montserrat min-w-[300px] text-green-600 text-xl text-center'>Point has been added, your earned 10⭐ stars!</div>
                    `).on('popupclose', () => {
                            placeNewPoint(map, coords.latlng);
                        });
                    } else {
                        marker.bindPopup(`
                        <div class='font-montserrat min-w-[300px] text-red-600 text-xl text-center'>An error occurred, point not added</div>
                    `).on('popupclose', () => {
                            placeNewPoint(map, coords.latlng);
                        });
                    }
                    return false;
                });

                let point = map.latLngToLayerPoint(coords.latlng);
                point.y -= map.getSize().y / 10;
                map.panTo(map.layerPointToLatLng(point));
                //map.setView(map.layerPointToLatLng(point), 17);
                // It's not up to Pollo's standards ;(
                // But shit guess I have to be ok with it
            })

            map.locate({ maxZoom: 16, watch: true, timeout: 30000, enableHighAccuracy: true }) // Prospective "enableHighAccuracy: true" use
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
            map.on('contextmenu', onContextMenu);
            populateMap(map);
        }
        return () => {
            if (mapProt.current) {
                mapProt.current.remove();
                mapProt.current = null;
            }
        };
    }, []);

    return (
        <div ref={mapRef} className="h-[100vh] w-full font-montserrat"/>
    );
}
