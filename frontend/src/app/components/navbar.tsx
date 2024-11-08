'use client'

import React, {useState} from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCalendarDay,
    faDashboard,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
    const pathname = usePathname().split('/')[1];
    if (pathname === 'login' || pathname === 'register' || pathname === '' || pathname === 'forgot-password') {
        return null;
    }
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center h-16">
            <div className="grid place-items-center">
                <Link href="/reserve" passHref>
                    <span
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${pathname === 'reserve' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faClock}/>
                    </span>
                </Link>
                <span className="grid place-items-center text-xs mt-1">Reservar</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/reserved-hours" passHref>
                    <span
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${pathname === 'reserved-hours' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faCalendarDay}/>
                    </span>
                    </Link>
                <span className="text-xs mt-1">Mis Reservas</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/hour-panel" passHref>
                    <span
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${pathname === 'hour-panel' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faDashboard}/>
                    </span>
                </Link>
                <span className="text-center text-xs mt-1">Panel de Horas</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/profile" passHref>
                    <span
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${pathname === 'profile' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faUser}/>
                    </span>
                </Link>
                <span className="grid place-items-center text-xs mt-1">Perfil</span>
            </div>
        </nav>
    );
}