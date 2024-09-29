// components/InfoModal.tsx
'use client'

import React from 'react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    success: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, message, success }) => {
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
                <h1 className={`text-2xl font-bold mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
                    {success ? 'Éxito' : 'Error'}
                </h1>
                <p className="text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
