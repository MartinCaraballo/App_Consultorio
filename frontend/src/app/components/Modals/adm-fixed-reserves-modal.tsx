// components/ReserveModal.tsx
'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";

const daysOfWeek = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const FixedReserveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    const router = useRouter();

    const [dayIndex, setDayIndex] = useState<number>(0);
    const [startHour, setStartHour] = useState<string>('07:00');
    const [endHour, setEndHour] = useState<string>('23:00');
    const [status, setStatus] = useState<string>('');
    const [reservedSlots, setReservedSlots] = useState<any[]>([]);
    const [reserving, setReserving] = useState<boolean>(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(1);

    const fetchReservedSlots = async (roomId: number, dayIndex: number) => {
        try {
            const response = await fetch(`http://localhost:8080/reserve/fixed?roomId=${selectedRoom}&dayIndex=${dayIndex}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setReservedSlots(data);
            } else {
                setStatus('Error al cargar las reservas.');
            }
        } catch (error) {
            setStatus('Error de conexión.');
        }
    };

    async function fetchRooms() {
        try {
            const res = await fetch('http://localhost:8080/rooms', {
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
        fetchReservedSlots(value, dayIndex);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, setTime: React.Dispatch<React.SetStateAction<string>>) => {
        const [hour] = event.target.value.split(':');
        setTime(`${hour}:00`);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            dayIndex,
            startHour,
            endHour,
            selectedRoom,
        };

        try {
            const res = await fetch('http://localhost:8080/reserve/fixed', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (res.status === 200) {
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

    const handleCancel = async (id: number) => {
        try {
            const res = await fetch(`/api/reserve/${id}`, {
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
        fetchRooms();
        fetchReservedSlots(selectedRoom, dayIndex);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    &times;
                </button>
                <h1 className="text-2xl font-bold mb-4">Administración de Reservas Fijas</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="day" className="block text-gray-700">Día de la semana</label>
                        <select
                            id="day"
                            value={daysOfWeek[dayIndex]}
                            onChange={(e) => {
                                const selectedDayIndex = daysOfWeek.indexOf(e.target.value);
                                setDayIndex(selectedDayIndex);
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
                        <div className="mt-2">
                            {reservedSlots.length > 0 ? (
                                <ul>
                                    {reservedSlots.map(slot => (
                                        <li key={slot.id}
                                            className="flex items-center justify-between border-b py-2">
                                            <span>
                                                {slot.startHour} - {slot.endHour}
                                            </span>
                                            <button
                                                onClick={() => handleCancel(slot.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Cancelar
                                            </button>
                                        </li>
                                    ))}
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
                    <p className={`mt-4 ${status.includes('Éxito') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FixedReserveModal;
