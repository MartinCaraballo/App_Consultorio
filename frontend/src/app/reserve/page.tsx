'use client'

import React, {useState} from "react";
import HourCard from "@/app/components/hour-card";

export default function ReservePage() {
    // Stores and updates the room selected.
    const [selectedValue, setSelectedValue] = useState('');

    // Boolean to enter to edit mode and exit from it.
    const [editingReserve, setEditingReserve] = useState(false);

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        setSelectedValue(event.currentTarget.value);
    }

    const options = [ 1, 2, 3, 4 ];

    // week day index.
    const today = new Date().getDay() - 1;
    const dayToHighlight = today > 0 ? today : 0;

    const week = () => {
        let week = [];
        let current = new Date();
        // set to monday.
        current.setDate((current.getDate() - current.getDay() + 1));
        for (let i = 0; i < 6; i++) {
            week.push(
                new Date(current)
            );
            current.setDate(current.getDate() + 1);
        }
        return week;
    }
    // Name of the days in the week.
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    // Selected day to highlight in the bar.
    const [selectedDay, setSelectedDay] = useState(daysNameOfWeek[dayToHighlight]);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Reservar un consultorio
            </h1>
            <div className="rounded-lg bg-white h-full">
                <div className="flex justify-center p-2 border-gray-300 rounded-lg">
                    <div className="inline-flex overflow-x-auto max-w-full font-bold">
                        {week().map((day, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedDay(daysNameOfWeek[index])}
                                className={`flex-shrink-0 w-28 text-center py-2 cursor-pointer ${
                                    selectedDay === daysNameOfWeek[index] ? 'bg-gray-600 text-white' : 'text-gray-700'
                                } rounded-lg transition-colors duration-300`}
                            >
                                {`${daysNameOfWeek[index]} ${day.getDate()}`}
                            </div>
                        ))}
                    </div>
                </div>
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