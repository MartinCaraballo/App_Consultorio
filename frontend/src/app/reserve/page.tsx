'use client'

import React, {useEffect, useState} from "react";
import HourCard from "@/app/components/hour-card";
import {ReserveDTO} from "@/app/models/ReserveDTO";

export default function ReservePage() {

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Stores and updates the room selected.
    const [selectedRoom, setSelectedRoom] = useState(1);

    // Boolean to enter to edit mode and exit from it.
    const [editingReserve, setEditingReserve] = useState(false);

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        const value = event.currentTarget.value.toString().split(" ")[1]
        setSelectedRoom(value);
        fetchReserves(value, selectedDayIndex, selectedDayDate);
    }

    // week day index.
    const todayDate = new Date();
    const today = todayDate.getDay() - 1;
    const dayToHighlight = today > 0 ? today : 0;

    // Name of the days in the week.
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    // Selected day to highlight in the bar.
    const [selectedDay, setSelectedDay] = useState(daysNameOfWeek[dayToHighlight]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedDayDate, setSelectedDayDate] = useState(formatDate(new Date()));

    // Fetch week days, rooms and reserves data
    const [rooms, setRooms] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [reserveCards, setReserveCards] = useState<ReserveDTO[]>([]);

    async function fetchWeek() {
        const res = await fetch('http://localhost:8080/week');
        const data = await res.json();
        setWeekDates(data);
    }

    async function fetchRooms() {
        const res = await fetch('http://localhost:8080/rooms');
        const data = await res.json();
        setRooms(data);
    }

    async function fetchReserves(roomId: number, dayIndex: number, date: string) {
        const res = await fetch(
            `http://localhost:8080/reserve?roomId=${roomId}&dayIndex=${dayIndex}&date=${date}`
        );
        const data: ReserveDTO[] = await res.json();
        setReserveCards(data);
    }

    useEffect(() => {
        fetchWeek();
        fetchRooms();
        fetchReserves(selectedRoom, selectedDayIndex, selectedDayDate);
    }, []);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Reservar un consultorio
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
                <div className="flex justify-center p-2 border-gray-300 rounded-lg">
                    <div className="inline-flex overflow-x-auto max-w-full font-bold">
                        {weekDates.map((day, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    const date = new Date(day);
                                    setSelectedDay(daysNameOfWeek[index]);
                                    setSelectedDayIndex(index);
                                    setSelectedDayDate(formatDate(date));
                                    fetchReserves(selectedRoom, index, formatDate(date));
                                }}
                                className={`flex-shrink-0 w-28 text-center py-2 cursor-pointer ${
                                    selectedDay === daysNameOfWeek[index] ? 'bg-gray-700 text-white' : 'text-gray-700'
                                } rounded-lg transition-colors duration-300`}
                            >
                                {`${daysNameOfWeek[index]} ${new Date(day).getDate()}`}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`px-4 flex flex-wrap ${editingReserve ? 'justify-evenly' : ''}`}>
                    <div className="py-1 font-bold text-lg">
                        <select
                            className="block px-3 py-2 bg-gray-700 rounded-lg text-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-700"
                            id="combobox"
                            value={`Consultorio ${selectedRoom}`}
                            onChange={handleChangeRoom}
                        >
                            {rooms.map(option => (
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
                <div className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2 overflow-y-auto max-h-[80vg]">
                    {reserveCards.map((reserve) => {
                        const startTime = new Date();
                        startTime.setHours(reserve.startTime[0]);
                        startTime.setMinutes(reserve.startTime[1]);

                        const endTime = new Date(startTime);
                        endTime.setHours(endTime.getHours() + 1);
                        return (
                            <HourCard
                                key={reserve.startTime.toString()}
                                clientName={reserve.name}
                                clientLastName={reserve.lastName}
                                start_date={startTime}
                                end_date={endTime}
                                canCancel={reserve.canCancel}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}