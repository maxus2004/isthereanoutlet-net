"use client"

import dynamic from "next/dynamic";
import { useEffect } from "react";
import bridge from '@vkontakte/vk-bridge';

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
    useEffect(() => {
        alert("starting")
        bridge.send('VKWebAppInit')
        .then((data) => { 
            if (data.result) {
            alert("init")
            } else {
            alert("not init")
            }
        })
        .catch((error) => {
            alert("error")
            console.log(error);
        });
    }, []);
    return (
        <div className="font-montserrat">
            <MapDisplay />
        </div>
  );
}
