import React, { useState } from "react";
import axiosInstance from "@/utils/axios_instance";

interface ReportErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        ""
    );
    const [loading, setLoading] = useState(false);

    async function sendErrorReport(message: string) {
        setLoading(true);

        axiosInstance
            .post("/user/report", { message: message })
            .then(() => {
                setMessage("Informe de error enviado exitosamente.");
                setMessageType("success");
                setErrorMessage("");
            })
            .catch(() => {
                setMessage(
                    "Ha ocurrido un error al intentar enviar el reporte, inténtelo de nuevo más tarde."
                );
                setMessageType("error");
                setErrorMessage("");
            })
            .finally(() => setLoading(false));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (errorMessage.trim().length === 0) {
            setMessage("Error: El mensaje de error no puede estar vacío.");
            setMessageType("error");
            return;
        }

        sendErrorReport(errorMessage);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">
                        Reportar un Error
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="error-message"
                            >
                                Descripción del Error
                            </label>
                            <textarea
                                id="error-message"
                                value={errorMessage}
                                onChange={(e) =>
                                    setErrorMessage(e.target.value)
                                }
                                className="border border-gray-300 p-2 rounded w-full"
                                rows={4}
                                required
                            />
                        </div>
                        {message && (
                            <div
                                className={`mb-4 p-2 rounded ${
                                    messageType === "success"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                                {!loading ? "Enviar" : "Procesando..."}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ReportErrorModal;
