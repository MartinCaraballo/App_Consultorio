import React, { useState } from 'react';
import { useRouter } from "next/navigation";

interface ConfirmReserveModalProps {
    isOpen: boolean;
    onClose: () => void;
    hoursToReserve: string[];
    selectedDayDate: string;
    selectedRoomId: number;
    clearHoursToReserve: () => void;
    updateReserveCards: () => void;
}

const ConfirmReserveModal: React.FC<ConfirmReserveModalProps> = (
    { isOpen, onClose, hoursToReserve, selectedDayDate, selectedRoomId, clearHoursToReserve, updateReserveCards }) => {

    const router = useRouter();

    // State to handle the confirmation result
    const [status, setStatus] = useState<'success' | 'error' | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

    // Function to format time
    const formatTime = (timeString: string): string => {
        const [hour, minute] = timeString.split(':').map(Number);
        const plusHour = hour + 1;
        return `${plusHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    // Create JSON payload for reservation
    const createReservePayload = () => {
        return hoursToReserve.map(hour => {
            const [startHour, startMinute] = hour.split(':').map(Number);
            const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            return {
                roomId: selectedRoomId,
                startTime: startTime,
                reserveDate: selectedDayDate
            };
        });
    };

    // Function to post reserves
    const postReserves = async () => {
        const reservesPayload = createReservePayload();
        try {
            const res = await fetch('http://localhost:8080/reserve', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reservesPayload),
                credentials: 'include',
            });

            if (res.status === 201) {
                setStatus('success');
                setStatusMessage('Reserva confirmada exitosamente.');
                clearHoursToReserve();
            } else if (res.status === 401) {
                setStatus('error');
                setStatusMessage('No estas autorizado para realizar esta acción.')
                router.push('/login')
            } else {
                setStatus('error');
                setStatusMessage('Hubo un error al confirmar la reserva. Revisa la hora y día seleccionada y vuelve a intentarlo.');
            }
            setTimeout(onClose, 2000);
            updateReserveCards();
        } catch (error) {
            setStatus('error');
            setStatusMessage('Hubo un error al confirmar la reserva.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                    {status === null ? 'Confirmar Reserva' : status === 'success' ? 'Reserva Confirmada' : 'Error de Confirmación'}
                </h2>
                {status === null && (
                    <>
                        <ul className="list-disc pl-5 mb-4 text-gray-700">
                            {hoursToReserve.map((hour, index) => (
                                <li key={index} className="mb-2">
                                    {`${hour} - ${formatTime(hour)}`}
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={postReserves}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
                            >
                                Confirmar
                            </button>
                        </div>
                    </>
                )}
                {status !== null && (
                    <div className={`mt-4 p-4 ${status === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'} rounded`}>
                        <p>{statusMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmReserveModal;
