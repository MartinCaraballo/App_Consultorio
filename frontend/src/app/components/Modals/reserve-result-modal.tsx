import React from 'react';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type: 'success' | 'error';
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    const modalClasses = `fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50`;
    const contentClasses = `bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto ${
        type === 'success' ? 'border-green-500 border' : 'border-red-500 border'
    }`;
    const buttonClasses = `py-2 px-4 rounded transition-colors duration-300 ${
        type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
    }`;

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                    {type === 'success' ? 'Reserva Confirmada' : 'Error al Confirmar'}
                </h2>
                <p className="text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`${buttonClasses} text-white`}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
