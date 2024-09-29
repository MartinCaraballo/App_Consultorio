import { useState } from 'react';

const UserManagementModal = ({ isOpen, onClose, users, setUsers }) => {
    const toggleAdmin = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        ));
    };

    const deleteUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span className={`${user.isAdmin ? 'font-bold' : ''}`}>{user.name}</span>
                            <div>
                                <button
                                    onClick={() => toggleAdmin(user.id)}
                                    className={`mr-2 p-1 ${user.isAdmin ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
                                >
                                    {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={onClose}
                    className="mt-4 p-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default UserManagementModal;
