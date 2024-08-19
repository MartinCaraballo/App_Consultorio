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

export default function NavigationBar() {
    const [activeTab, setActiveTab] = useState<string>('Reservar')

    const handleTabChange = (tab:string) => {
        setActiveTab(tab);
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center h-16">
            <div className="grid place-items-center">
                <Link href="/reserve" passHref>
                    <span
                        onClick={() => setActiveTab("reserve")}
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${activeTab === 'reserve' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faClock}/>
                    </span>
                </Link>
                <span className="grid place-items-center text-xs mt-1">Reservar</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/reserved-hours" passHref>
                    <span
                        onClick={() => setActiveTab("reserved-hours")}
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${activeTab === 'reserved-hours' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faCalendarDay}/>
                    </span>
                    </Link>
                <span className="text-xs mt-1">Mis Reservas</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/hour-panel" passHref>
                    <span
                        onClick={() => setActiveTab("hour-panel")}
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${activeTab === 'hour-panel' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faDashboard}/>
                    </span>
                </Link>
                <span className="text-center text-xs mt-1">Panel de Horas</span>
            </div>
            <div className="grid place-items-center">
                <Link href="/profile" passHref>
                    <span
                        onClick={() => setActiveTab("profile")}
                        className={`flex flex-col w-12 py-2 rounded-full cursor-pointer ${activeTab === 'profile' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                    >
                        <FontAwesomeIcon icon={faUser}/>
                    </span>
                </Link>
                <span className="grid place-items-center text-xs mt-1">Perfil</span>
            </div>
        </nav>
    );
}