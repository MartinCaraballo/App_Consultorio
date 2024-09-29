import React from 'react';

interface User {
    id: number;
    name: string;
    isAdmin: boolean;
}

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, users, setUsers }) => {
    const toggleAdmin = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        ));
    };

    const deleteUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    if (!isOpen) return null;

    const adminUsers = users.filter(user => user.isAdmin);
    const regularUsers = users.filter(user => !user.isAdmin);

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
                                    onClick={() => toggleAdmin(user.id)}
                                    className="mr-2 p-1 bg-red-500 text-white rounded"
                                >
                                    Quitar Admin
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

                <h2 className="text-lg font-semibold mb-2">Usuarios Regulares</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {regularUsers.map((user) => (
                        <li key={user.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span>{user.name}</span>
                            <div>
                                <button
                                    onClick={() => toggleAdmin(user.id)}
                                    className="mr-2 p-1 bg-green-500 text-white rounded"
                                >
                                    Hacer Admin
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
            </div>
        </div>
    );
};

export default UserManagementModal;
