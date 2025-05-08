'use client'

import React, {useEffect, useState} from "react";
import {Dialog} from '@headlessui/react'
import {X} from 'lucide-react'
import {daysOfWeek} from "@/app/components/Modals/adm-fixed-reserves-modal";
import axiosInstance from "@/utils/axios_instance";

export default function MonthlyReservesModal({isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void
}) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [selectedHours, setSelectedHours] = useState<Date[]>([])
    const [dayIndex, setDayIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const today = new Date();
    const month_names = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(1);
    const [resultType, setResultType] = useState<"success" | "error">("success");
    const [resultMessage, setResultMessage] = useState("");

    const [selectedMonth, setSelectedMonth] = useState(month_names[today.getMonth()]);

    const hours = Array.from({length: 16}, (_, i) => {
        const date = new Date();
        date.setHours(7 + i)
        date.setMinutes(0)
        return date
    })

    const toggleHour = (hora: Date) => {
        setSelectedHours(prev =>
            prev.some(h => h.getHours() === hora.getHours())
                ? prev.filter(h => h.getHours() !== hora.getHours())
                : [...prev, hora]
        );
    };

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        const value = event.currentTarget.value.toString().split(" ")[1];
        setSelectedRoom(value);
        // fetchReservedSlots(value, dayIndex);
    };

    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const createMonthlyReservePayload = () => {
        return selectedHours.map((hour) => {
            const startTime = `${hour.getHours().toString().padStart(2, "0")}:${hour.getMinutes().toString().padStart(2, "0")}`;
            return {
                roomId: selectedRoom,
                startTime,
                dayIndex: dayIndex,
                monthIndex: month_names.indexOf(selectedMonth) + 1 % 12
            };
        });
    };

    const postMonthlyReserves = async () => {
        setLoading(true);
        setResultMessage("");
        const reservesPayload = createMonthlyReservePayload();
        axiosInstance
            .post("/reserve/monthly", reservesPayload)
            .then(() => {
                setResultMessage("¡Tu reserva ha sido realizada con éxito!");
                setResultType("success");
                setSelectedHours([]);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    setResultMessage("No se cumplen con las condiciones horarias para efectuar la reserva.");
                    setResultType("error");
                } else {
                    setResultMessage("Hubo un error al confirmar la reserva. Revisa la hora y día seleccionada y vuelve a intentarlo.");
                    setResultType("error");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    async function fetchRooms() {
        axiosInstance
            .get("/rooms")
            .then((res) => setRooms(res.data))
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                fetchRooms(),
                // fetchReservedSlots(selectedRoom, dayIndex),
            ]).then(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md lg:max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-row">
                        <h2 className="text-xl font-bold">Realizar una Reserva Mensual</h2>
                        <div className="pl-2">
                            {loading && (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="select-month" className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccione el mes
                    </label>
                    <select
                        id="select-month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full border-gray-300 p-2"
                    >
                        <option value={month_names[(today.getMonth())]}>{month_names[today.getMonth()]}</option>
                        <option
                            value={month_names[(today.getMonth() + 1) % 12]}>{month_names[(today.getMonth() + 1) % 12]}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                        Día de la semana
                    </label>
                    <select
                        id="day"
                        value={daysOfWeek[dayIndex]}
                        onChange={(e) => {
                            const selectedDayIndex = daysOfWeek.indexOf(
                                e.target.value
                            );
                            setDayIndex(selectedDayIndex);
                            // setReservedSlots([]);
                            // fetchReservedSlots(
                            //     selectedRoom,
                            //     selectedDayIndex
                            // );
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                        {daysOfWeek.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="room" className="block text-gray-700">
                        Consultorio
                    </label>
                    <select
                        id="room"
                        value={`Consultorio ${selectedRoom}`}
                        onChange={handleChangeRoom}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                        {rooms.map((c) => (
                            <option key={c}>{`Consultorio ${c}`}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 pt-4">
                    <label className="block font-medium mb-1">Selecciona las horas</label>
                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 max-h-32 lg:max-h-60 overflow-y-auto">
                        {hours.map(hour => {
                            const nextDate = new Date();
                            nextDate.setHours(hour.getHours() + 1);
                            nextDate.setMinutes(0);
                            console.log(selectedHours)
                            return (
                                <button
                                    key={hour.getHours()}
                                    onClick={() => toggleHour(hour)}
                                    className={`p-4 rounded-md border text-sm text-center
                    ${selectedHours.some(selectedHour => selectedHour.getHours() === hour.getHours()) ? 'bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {formatTime(hour)} - {formatTime(nextDate)}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button
                        onClick={postMonthlyReserves}
                        className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
                        disabled={selectedHours.length === 0}
                    >
                        Reservar
                    </button>
                </div>

                <p className={`${resultType == 'success' ? "text-green-500" : "text-red-500"} mb-4`}>{resultMessage}</p>
            </div>
        </Dialog>
    )
}
