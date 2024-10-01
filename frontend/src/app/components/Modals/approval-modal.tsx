import React from 'react';
import { useRouter } from "next/navigation";

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const [unauthorizedUsers, setUnauthorizedUsers] = React.useState<User[]>([]);
    const [showMessage, setShowMessage] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('');

    // Fetch unauthorized users only when the modal is opened
    React.useEffect(() => {
        if (isOpen) {
            fetchUnauthorizedUsers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function fetchUnauthorizedUsers() {
        try {
            const res = await fetch('http://localhost:8080/admin/unauthorized-users', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            }
            const data = await res.json();
            setUnauthorizedUsers(data);
        } catch (e) {
            console.log(e);
        }
    }

    async function acceptUser(userEmail: string, name: string, lastName:string) {
        try {
            const res = await fetch(`http://localhost:8080/admin/accept-user/${userEmail}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (res.status === 200) {
                setStatusMessage(`Usuario ${name} ${lastName} autorizado con éxito.`);
                setShowMessage(true);
                fetchUnauthorizedUsers();
            } else {
                setStatusMessage("Error al intentar rechazar el usuario. Inténtelo de nuevo.");
                setShowMessage(true);
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    async function rejectUser(userEmail: string, name: string, lastName:string) {
        try {
            const res = await fetch (`http://localhost:8080/admin/reject-user/${userEmail}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (res.status === 200) {
                setStatusMessage(`Usuario ${name} ${lastName} rechazado con éxito.`);
                setShowMessage(true);
                fetchUnauthorizedUsers();
            } else {
                setStatusMessage("Error al intentar rechazar el usuario. Inténtelo de nuevo.");
                setShowMessage(true);
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Autorizar Usuarios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {unauthorizedUsers.length > 0 ? (
                        <ul className="space-y-2">
                            {unauthorizedUsers.map((user) => (
                                <li key={user.email}
                                    className="p-2 border border-gray-300 rounded flex justify-between items-center">
                                    <div>
                                        <span>{`${user.name} ${user.lastName} (${user.email})`}</span>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => acceptUser(user.email, user.name, user.lastName)}
                                            className="mr-2 p-1 bg-green-500 text-white rounded w-20"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => rejectUser(user.email, user.name, user.lastName)}
                                            className="p-1 bg-red-600 text-white rounded w-20"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No hay usuarios esperando autorización.</p>
                    )}
                </div>
                {showMessage && (
                    <p className={`${statusMessage.includes("éxito") ? 'text-green-500' : 'text-red-500'}`}>{statusMessage}</p>
                )}
            </div>
        </div>
    );
};

export default ApprovalModal;