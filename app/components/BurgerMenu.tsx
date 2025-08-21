"use client"

import { slide as Menu } from 'react-burger-menu';
import React from "react";

const styles = {
    bmBurgerButton: {
        position: 'fixed',
        scale: '100%',
        width: '64px',
        height: '64px',
        left: '10px',
        top: '10px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmBurgerBarsHover: {
        background: '#a90000'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenuWrap: {
        position: 'fixed',
        height: '100%'
    },
    bmMenu: {
        background: '#ededed',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#1c1c1c',
        padding: '0.8em'
    },
    bmItem: {
        display: 'inline-block'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

export default function BurgerMenu() {
    return (
        <Menu styles = { styles } className="flex-col h-full font-montserrat" customBurgerIcon={ <img src="/images/icons/hamburger-menu.png" alt="🍔"/> }>
            <div className="flex h-full flex-col ">
                <div className="mb-4 w-full"><a href="/">Main Map</a></div>
                <div className="mb-4 w-full"><a href="/profile">Profile</a></div>
                <div className="absolute bottom-12"><a href="/credits">Credits</a></div>
            </div>
        </Menu>
    )
}