"use client"
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        let star_count = Number(localStorage.getItem("star_count"));
        if (star_count == null) star_count = 0;
        let el = document.getElementById("star_count");
        if (el != null) el.innerText = String(star_count);
    }, []);

    return (
        <div className="flex w-screen justify-center items-center text-xl font-montserrat pt-7 text-center">
            <div className="max-w-1/2">You have <span id="star_count"></span>⭐ stars!</div>
        </div>
    )
}