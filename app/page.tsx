"use client"

import dynamic from "next/dynamic";
import { useEffect } from "react";
import bridge from '@vkontakte/vk-bridge';

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
    useEffect(() => {
        bridge.send('VKWebAppInit')
        .then((data) => { 
            if (data.result) {
            // Приложение инициализировано
            } else {
            // Ошибка
            }
        })
        .catch((error) => {
            // Ошибка
            console.log(error);
        });
    }, []);
    return (
        <div className="font-montserrat">
            <MapDisplay />
        </div>
  );
}
