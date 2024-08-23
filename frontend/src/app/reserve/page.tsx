'use client'

import WeekdayBar from "@/app/components/weekday-bar";
import React, {useState} from "react";
import HourCard from "@/app/components/hour-card";

export default function ReservePage() {
    const [selectedValue, setSelectedValue] = useState('');
    const [editingReserve, setEditingReserve] = useState(false);

    const handleChangeRoom = (event: any) => {
        setSelectedValue(event.currentTarget.value);
    }

    const options = [ 1, 2, 3, 4 ];
    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Reservar un consultorio
            </h1>
            <div className="rounded-lg bg-white h-full">
                <WeekdayBar></WeekdayBar>
                <div className={`px-4 flex flex-wrap ${editingReserve ? 'justify-evenly' : ''}`}>
                    <div className="py-1 font-bold text-lg">
                        <select
                            className="px-1 py-2 bg-gray-700 rounded-lg text-xl text-white"
                            id="combobox"
                            value={selectedValue}
                            onChange={handleChangeRoom}
                        >
                            {options.map(option => (
                                <option key={option}>
                                    {`Consultorio ${option}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {editingReserve && (
                        <button
                            className="py-1 bg-green-500 rounded-full px-2 font-bold text-lg border-2 border-green-800"
                            disabled={!editingReserve}
                        >
                            CONFIRMAR RESERVA
                        </button>
                    )}
                </div>
                <div className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2">
                    <HourCard client="Pablo Landeira" start_date={new Date()} end_date={new Date()} />
                    <HourCard client="Martin Caraballo" start_date={new Date()} end_date={new Date()} />
                    <HourCard client="" start_date={new Date()} end_date={new Date()} />
                    <HourCard client="ASDASD" start_date={new Date()} end_date={new Date()} />
                </div>
            </div>
        </main>
    );
}