import { useRouter } from 'next/navigation';
import React from 'react';
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const [adminUsers, setAdminUsers] = React.useState<User[]>([]);
    const [regularUsers, setRegularUsers] = React.useState<User[]>([]);

    const [showMessage, setShowMessage] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    async function fetchAdminUsers() {
        try {
            const res = await fetch('http://localhost:8080/admin/admin-users', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            }
            const data: User[] = await res.json();
            setAdminUsers(data);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchRegularUsers() {
        try {
            const res = await fetch('http://localhost:8080/admin/regular-users', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            }
            const data: User[] = await res.json();
            setRegularUsers(data);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchUsers() {
        fetchAdminUsers();
        fetchRegularUsers();
    }

    async function removeAdmin(adminEmail: string) {
        try {
            const res = await fetch(`http://localhost:8080/admin/${adminEmail}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.status === 403) {
                router.push('/login');
            } else if (res.status === 200) {
                setShowMessage(true);
                setStatusMessage(`El usuario con el correo ${adminEmail} fue eliminado de la lista de Admins con éxito.`);
                fetchUsers();
            } else {
                setShowMessage(true);
                setStatusMessage(`Error al intentar realizar la operación.`);
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    async function makeAdmin(user: User) {
        try {
            const res = await fetch("http://localhost:8080/admin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            } else if (res.status === 200) {
                setShowMessage(true);
                setStatusMessage(`El usuario ${user.name} ${user.lastName} fue agregado al grupo de Admins con éxito.`);
                fetchUsers();
            } else {
                setShowMessage(true);
                setStatusMessage(`Error al intentar realizar la operación.`);
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <h2 className="text-lg font-semibold mb-2">Administradores</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {adminUsers.map((user) => (
                        <li key={user.email} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span className="font-bold">{user.name} {user.lastName} ({user.email})</span>
                            <div>
                                <button
                                    onClick={() => removeAdmin(user.email)}
                                    className="mr-2 p-1 bg-red-500 text-white rounded"
                                >
                                    Quitar Admin
                                </button>
                                <button
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <h2 className="text-lg font-semibold mb-2">Usuarios Regulares</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {regularUsers.map((user) => (
                        <li key={user.email} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span>{user.name} {user.lastName} ({user.email})</span>
                            <div>
                                <button
                                    onClick={() => makeAdmin(user)}
                                    className="mr-2 p-1 bg-green-500 text-white rounded"
                                >
                                    Hacer Admin
                                </button>
                                <button
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {showMessage && (
                    <p className={`${statusMessage.includes("éxito") ? 'text-green-500' : 'text-red-500'}`}>{statusMessage}</p>
                )}
            </div>
        </div>
    );
};

export default UserManagementModal;
