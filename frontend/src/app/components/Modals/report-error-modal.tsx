import React, { useState } from 'react';

interface ReportErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReportErrorModal: React.FC<ReportErrorModalProps> = ({ isOpen, onClose }) => {

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    async function sendErrorReport(message: string) {
        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/user/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
                credentials: 'include',
            });

            if (res.status === 200) {
                setMessage('Informe de error enviado exitosamente.');
                setMessageType('success');
                setErrorMessage('');
            } else {
                setMessage('Ha ocurrido un error al intentar enviar el reporte, inténtelo de nuevo más tarde.');
                setMessageType('error');
                setErrorMessage('');
            }

        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (errorMessage.trim().length === 0) {
            setMessage('Error: El mensaje de error no puede estar vacío.');
            setMessageType('error');
            return
        }

        sendErrorReport(errorMessage);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Reportar un Error</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="error-message">Descripción del Error</label>
                            <textarea
                                id="error-message"
                                value={errorMessage}
                                onChange={(e) => setErrorMessage(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                                rows={4}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`mb-4 p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ReportErrorModal;
