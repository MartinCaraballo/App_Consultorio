import React, {useState} from "react";
import ResultModal from "@/app/components/Modals/reserve-result-modal";
import axiosInstance from "@/utils/axios_instance";

interface ConfirmReserveModalProps {
    isOpen: boolean;
    onClose: () => void;
    hoursToReserve: string[];
    selectedDayDate: string;
    selectedRoomId: number;
    clearHoursToReserve: () => void;
    updateReserveCards: () => void;
}

const ConfirmReserveModal: React.FC<ConfirmReserveModalProps> = (props: ConfirmReserveModalProps) => {
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultType, setResultType] = useState<"success" | "error">(
        "success"
    );
    const [resultMessage, setResultMessage] = useState("");
    const [confirmDisabled, setConfirmDisabled] = useState(false);

    // Function to format time
    const formatTime = (timeString: string): string => {
        const [hour, minute] = timeString.split(":").map(Number);
        const plusHour = hour + 1;
        return `${plusHour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
    };

    // Create JSON payload for reservation
    const createReservePayload = () => {
        return props.hoursToReserve.map((hour) => {
            const [startHour, startMinute] = hour.split(":").map(Number);
            const startTime = `${startHour
                .toString()
                .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
            return {
                roomId: props.selectedRoomId,
                startTime: startTime,
                reserveDate: props.selectedDayDate,
            };
        });
    };

    // Function to post reserves
    const postReserves = async () => {
        setConfirmDisabled(true);
        const reservesPayload = createReservePayload();
        axiosInstance.post('/reserve', reservesPayload)
            .then(() => {
                setResultMessage("¡Tu reserva ha sido realizada con éxito!");
                setResultType("success");
                props.clearHoursToReserve();
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    setResultMessage(
                        "No se cumplen con las condiciones horarias para efectuar la reserva."
                    );
                    setResultType("error");
                } else {
                    setResultMessage(
                        "Hubo un error al confirmar la reserva. Revisa la hora y día seleccionada y vuelve a intentarlo."
                    );
                    setResultType("error");
                }
            })
            .finally(() => {
                setConfirmDisabled(false);
                props.updateReserveCards();
                setShowResultModal(true);
            });
    };

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto overflow-y-auto h-3/5 sm:h-max">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                    Confirmar Reserva
                </h2>
                <>
                    <ul className="list-disc pl-5 mb-4 text-gray-700 overflow-y-auto">
                        {props.hoursToReserve.map((hour, index) => (
                            <li key={index} className="mb-2">
                                {`${hour} - ${formatTime(hour)}`}
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
                        <button
                            onClick={props.onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={postReserves}
                            disabled={confirmDisabled}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
                        >
                            Confirmar
                        </button>
                    </div>
                    <ResultModal
                        isOpen={showResultModal}
                        onClose={() => {
                            setShowResultModal(false);
                            props.onClose();
                        }}
                        message={resultMessage}
                        type={resultType}
                    />
                </>
            </div>
        </div>
    );
};

export default ConfirmReserveModal;
