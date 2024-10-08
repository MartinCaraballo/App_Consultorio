// components/ReserveModal.tsx
'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";

const daysOfWeek = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const FixedReserveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    const router = useRouter();

    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [dayIndex, setDayIndex] = useState<number>(0);
    const [startHour, setStartHour] = useState<string>('07:00');
    const [endHour, setEndHour] = useState<string>('23:00');
    const [status, setStatus] = useState<string>('');
    const [reservedSlots, setReservedSlots] = useState<ReserveDTO[]>([]);
    const [reserving, setReserving] = useState<boolean>(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(1);

    const fetchReservedSlots = async (roomId: number, dayIndex: number) => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/reserve/fixed?roomId=${roomId}&dayIndex=${dayIndex}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setReservedSlots(data);
            } else if (response.status === 403) {
                router.push('/login');
            } else {
                setStatus('Error al cargar las reservas.');
            }
        } catch (error) {
            setStatus('Error de conexión.');
        }
    };

    async function fetchRooms() {
        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            }
            const data = await res.json();
            setRooms(data);
        } catch (e) {
            console.log(e);
        }
    }

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        const value = event.currentTarget.value.toString().split(" ")[1]
        setSelectedRoom(value);
        console.log(value);
        setReservedSlots([]);
        fetchReservedSlots(value, dayIndex);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, setTime: React.Dispatch<React.SetStateAction<string>>) => {
        const [hour] = event.target.value.split(':');
        setTime(`${hour}:00`);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            dayIndex: dayIndex,
            startTime: startHour,
            endTime: endHour,
            roomId: selectedRoom,
        };

        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/reserve/fixed`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (res.status === 201) {
                setStatus('Reserva realizada con éxito.');
            } else {
                setStatus('Error al realizar la reserva. Por favor, inténtelo de nuevo.');
            }
            fetchReservedSlots(selectedRoom, dayIndex);
            setReserving(false);
        } catch (error) {
            setStatus('Error de conexión. Por favor, inténtelo más tarde.');
        }
    };

    const handleCancel = async (roomId: number, dayIndex: number, startTime: string) => {
        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/reserve/fixed?roomId=${roomId}&dayIndex=${dayIndex}&startTime=${startTime}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.status === 200) {
                setStatus('Reserva cancelada con éxito.');
            } else {
                setStatus('Error al cancelar la reserva. Por favor, inténtelo de nuevo.');
            }
            fetchReservedSlots(selectedRoom, dayIndex);
        } catch (error) {
            setStatus('Error de conexión. Por favor, inténtelo más tarde.');
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRooms();
            fetchReservedSlots(selectedRoom, dayIndex);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold mb-4">Administración de Reservas Fijas</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="day" className="block text-gray-700">Día de la semana</label>
                        <select
                            id="day"
                            value={daysOfWeek[dayIndex]}
                            onChange={(e) => {
                                const selectedDayIndex = daysOfWeek.indexOf(e.target.value);
                                setDayIndex(selectedDayIndex);
                                setReservedSlots([]);
                                fetchReservedSlots(selectedRoom, selectedDayIndex);
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        >
                            {daysOfWeek.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="room" className="block text-gray-700">Consultorio</label>
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
                        <div className="mt-2 max-h-24 lg:max-h-80 overflow-y-auto">
                            {reservedSlots.length > 0 ? (
                                <ul>
                                    {reservedSlots.map(slot => {
                                        const startTime = new Date();
                                        startTime.setHours(slot.startTime[0]);
                                        startTime.setMinutes(slot.startTime[1]);

                                        const endTime = new Date();
                                        endTime.setHours(slot.endTime[0]);
                                        endTime.setMinutes(slot.endTime[1]);

                                        return (
                                            <li key={slot.startTime.toString()}
                                                className="flex items-center justify-between border-b py-2">
                                            <span>
                                                {formatTime(startTime)} - {formatTime(endTime)}
                                            </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(slot.roomId, dayIndex, formatTime(startTime))}
                                                    className="text-red-500 hover:text-red-700 px-4"
                                                >
                                                    Cancelar
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No hay horarios reservados.</p>
                            )}
                        </div>
                    </div>
                    {reserving && (
                        <>
                            <div>
                                <label htmlFor="startHour" className="block text-gray-700">Hora de inicio</label>
                                <input
                                    type="time"
                                    id="startHour"
                                    value={startHour}
                                    onChange={(e) => handleTimeChange(e, setStartHour)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"/>
                            </div>
                            <div>
                                <label htmlFor="endHour" className="block text-gray-700">Hora de fin</label>
                                <input
                                    type="time"
                                    id="endHour"
                                    value={endHour}
                                    onChange={(e) => handleTimeChange(e, setEndHour)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"/>
                            </div>
                            <div className="flex flex-row justify-end">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                                >
                                    Reservar
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
                    <p className={`mt-4 ${status.includes('éxito') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FixedReserveModal;
