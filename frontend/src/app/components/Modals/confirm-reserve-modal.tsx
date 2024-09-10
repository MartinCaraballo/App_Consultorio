import { useState } from 'react';

const Modal = ({ isOpen, onClose, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Lista de Objetos Seleccionados</h2>
    <ul className="list-disc pl-5 mb-4">
        {items.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
))}
    </ul>
    <button
    onClick={onClose}
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
        Cerrar
        </button>
        </div>
        </div>
);
};

export default Modal;