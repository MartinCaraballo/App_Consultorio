"use client";

import React, {useEffect, useState} from "react";
import axiosInstance from "@/utils/axios_instance";
import LoadingComponent from "../loading/loading";
import {canInsertSemicolon} from "sucrase/dist/types/parser/traverser/util";
import {
    createFlightRouterStateFromLoaderTree
} from "next/dist/server/app-render/create-flight-router-state-from-loader-tree";

const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

const FixedReserveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
                                                                                   isOpen,
                                                                                   onClose,
                                                                               }) => {
    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const [dayIndex, setDayIndex] = useState<number>(0);
    const [startHour, setStartHour] = useState<string>("07:00");
    const [endHour, setEndHour] = useState<string>("23:00");
    const [status, setStatus] = useState<string>("");
    const [statusType, setStatusType] = useState<
        "success" | "error" | "warning" | ""
    >("");
    const [reservedSlots, setReservedSlots] = useState<ReserveDTO[]>([]);
    const [reserving, setReserving] = useState<boolean>(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingReserves, setLoadingReserves] = useState(true);

    async function fetchReservedSlots(roomId: number, dayIndex: number) {
        setLoadingReserves(true);
        axiosInstance
            .get(`/reserve/fixed?roomId=${roomId}&dayIndex=${dayIndex}`)
            .then((res) => {
                setReservedSlots(res.data);
            })
            .catch(() => {
                setStatus("Error al cargar las reservas.");
                setStatusType("error");
            })
            .finally(() => setLoadingReserves(false));
    }

    async function fetchRooms() {
        axiosInstance
            .get("/rooms")
            .then((res) => setRooms(res.data))
            .catch((err) => console.error(err));
    }

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        const value = event.currentTarget.value.toString().split(" ")[1];
        setSelectedRoom(value);
        setReservedSlots([]);
        fetchReservedSlots(value, dayIndex);
    };

    const handleTimeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setTime: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const [hour] = event.target.value.split(":");
        setTime(`${hour}:00`);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            dayIndex: dayIndex,
            startTime: startHour,
            endTime: endHour,
            roomId: selectedRoom,
        };

        axiosInstance
            .post<string[]>("/reserve/fixed", payload)
            .then((res) => {
                const data = res.data;
                if (data.length === 0) {
                    setStatus("Reserva realizada con éxito.");
                    setStatusType("success");
                    return;
                }
                let message =
                    "Se encontraron reservas en los siguientes horarios:";
                data.map((hour) => (message += `- ${hour}`));
                setStatus(message);
                setStatusType("warning");
            })
            .catch((err) => {
                setStatus(
                    "Error al realizar la reserva. Por favor, inténtelo de nuevo."
                );
                setStatusType("error");
            })
            .finally(() => {
                setLoading(false);
                fetchReservedSlots(selectedRoom, dayIndex);
                setReserving(false);
            });
    };

    const handleCancel = async (
        roomId: number,
        dayIndex: number,
        startTime: string
    ) => {
        setLoading(true);
        axiosInstance
            .delete(
                `/reserve/fixed?roomId=${roomId}&dayIndex=${dayIndex}&startTime=${startTime}`
            )
            .then(() => {
                setStatusType('success');
                setStatus("Reserva cancelada con éxito.");
                fetchReservedSlots(selectedRoom, dayIndex);
            })
            .catch(() => {
                    setStatusType('error');
                    setStatus(
                        "Error al cancelar la reserva. Por favor, inténtelo de nuevo."
                    )
                }
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                fetchRooms(),
                fetchReservedSlots(selectedRoom, dayIndex),
            ]).then(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-6 flex flex-col ">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">
                            Administración de Reservas Fijas
                        </h1>
                        <div className="pl-2">
                            {loadingReserves && (
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
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-2xl hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="day" className="block text-gray-700">
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
                                setReservedSlots([]);
                                fetchReservedSlots(
                                    selectedRoom,
                                    selectedDayIndex
                                );
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
                    <div>
                        <p className="block text-gray-700">Horas reservadas:</p>
                        <div className={`mt-2 max-h-24 ${!reserving ? 'lg:max-h-80' : ''} overflow-y-auto`}>
                            {reservedSlots.length > 0 ? (
                                <ul>
                                    {reservedSlots.map((slot) => {
                                        const startTime = new Date();
                                        startTime.setHours(slot.startTime[0]);
                                        startTime.setMinutes(slot.startTime[1]);

                                        const endTime = new Date();
                                        endTime.setHours(slot.endTime[0]);
                                        endTime.setMinutes(slot.endTime[1]);

                                        return (
                                            <li
                                                key={slot.startTime.toString()}
                                                className="flex items-center justify-between border-b py-2"
                                            >
                                                <span>
                                                    {formatTime(startTime)} -{" "}
                                                    {formatTime(endTime)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancel(
                                                            slot.roomId,
                                                            dayIndex,
                                                            formatTime(
                                                                startTime
                                                            )
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 px-4"
                                                >
                                                    {loading && (
                                                        <svg
                                                            className="animate-spin h-5 w-5 mr-3 ..."
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="164"
                                                                cy="164"
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
                                                    {!loading ? "Eliminar hora" : ""}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">
                                    No hay horarios reservados.
                                </p>
                            )}
                        </div>
                    </div>
                    {reserving && (
                        <>
                            <div>
                                <label
                                    htmlFor="startHour"
                                    className="block text-gray-700"
                                >
                                    Hora de inicio
                                </label>
                                <input
                                    type="time"
                                    id="startHour"
                                    value={startHour}
                                    onChange={(e) =>
                                        handleTimeChange(e, setStartHour)
                                    }
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="endHour"
                                    className="block text-gray-700"
                                >
                                    Hora de fin
                                </label>
                                <input
                                    type="time"
                                    id="endHour"
                                    value={endHour}
                                    onChange={(e) =>
                                        handleTimeChange(e, setEndHour)
                                    }
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex flex-row justify-end space-x-4">
                                <button
                                    className="flex bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                                    onClick={() => setReserving(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                                >
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
                                    {!loading ? "Reservar" : "Procesando..."}
                                </button>
                            </div>
                        </>
                    )}
                </form>
                {!reserving && (
                    <div className="flex items-center justify-center mt-4">
                        <button
                            className="border-2 px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                            onClick={() => setReserving(true)}
                        >
                            Agregar reserva
                        </button>
                    </div>
                )}
                {status && (
                    <p
                        className={`mt-4 border rounded-lg p-3 ${statusType === "success"
                            ? "text-green-600 border-green-300 bg-green-100"
                            : ""
                        } ${statusType === "warning"
                            ? "text-yellow-600 border-yellow-300 bg-yellow-100"
                            : ""
                        } ${statusType === "error"
                            ? "text-red-600 border-red-300 bg-red-100"
                            : ""
                        }`}
                    >
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FixedReserveModal;
