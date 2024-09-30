import React from 'react';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    let adminUsers: User[] = [];
    let regularUsers: User[] = [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <h2 className="text-lg font-semibold mb-2">Administradores</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {adminUsers.map((user) => (
                        <li key={user.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span className="font-bold">{user.name}</span>
                            <div>
                                <button
                                    className="mr-2 p-1 bg-red-500 text-white rounded"
                                >
                                    Quitar Admin
                                </button>
                                <button
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <h2 className="text-lg font-semibold mb-2">Usuarios Regulares</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {regularUsers.map((user) => (
                        <li key={user.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span>{user.name}</span>
                            <div>
                                <button
                                    className="mr-2 p-1 bg-green-500 text-white rounded"
                                >
                                    Hacer Admin
                                </button>
                                <button
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserManagementModal;
