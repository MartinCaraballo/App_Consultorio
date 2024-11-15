import React, {useState} from "react";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axiosInstance from "@/utils/axios_instance";
import Link from "next/link";

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    const [adminUsers, setAdminUsers] = React.useState<User[]>([]);
    const [regularUsers, setRegularUsers] = React.useState<User[]>([]);

    const [showMessage, setShowMessage] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState("");
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchUsers();
        }
    }, [isOpen]);

    async function fetchAdminUsers() {
        axiosInstance
            .get("/admin/admin-users")
            .then((res) => setAdminUsers(res.data));
    }

    async function fetchRegularUsers() {
        axiosInstance
            .get("/admin/regular-users")
            .then((res) => setRegularUsers(res.data));
    }

    async function fetchUsers() {
        Promise.all([fetchAdminUsers(), fetchRegularUsers()]).then(() =>
            setLoading(false)
        );
    }

    async function removeAdmin(adminEmail: string) {
        axiosInstance
            .delete(`/admin/${adminEmail}`)
            .then(() => {
                setShowMessage(true);
                setStatusMessage(
                    `El usuario con el correo ${adminEmail} fue eliminado de la lista de Admins con éxito.`
                );
            })
            .catch(() => {
                setShowMessage(true);
                setStatusMessage("Error al intentar realizar la operación.");
            })
            .finally(() => {
                fetchUsers();
                setTimeout(() => setShowMessage(false), 2000);
            });
    }

    async function makeAdmin(user: User) {
        axiosInstance
            .post("/admin", { email: user.email })
            .then(() => {
                setShowMessage(true);
                setStatusMessage(
                    `El usuario ${user.name} ${user.lastName} fue agregado al grupo de Admins con éxito.`
                );
            })
            .catch(() => {
                setShowMessage(true);
                setStatusMessage(`Error al intentar realizar la operación.`);
            })
            .finally(() => {
                setTimeout(() => setShowMessage(false), 2000);
                fetchUsers();
            });
    }

    async function removeRegularUser(userEmail: string) {
        axiosInstance
            .delete(`/admin/user/${userEmail}`)
            .then(() => {
                setShowMessage(true);
                setStatusMessage(
                    `El usuario con el correo ${userEmail} fue eliminado de la lista de Admins con éxito.`
                );
            })
            .catch(() => {
                setShowMessage(true);
                setStatusMessage("Error al intentar realizar la operación.");
            })
            .finally(() => {
                fetchUsers();
                setTimeout(() => setShowMessage(false), 2000);
            });
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">
                            Gestión de Usuarios
                        </h1>
                        <div className="pl-2">
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
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-2xl hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <h2 className="text-lg font-semibold mb-2">Administradores</h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {adminUsers.map((user) => (
                        <li
                            key={user.email}
                            className="p-2 border border-gray-300 rounded flex justify-between items-center"
                        >
                            <span className="font-bold">
                                {user.name} {user.lastName} ({user.email})
                            </span>
                            <div>
                                <button
                                    onClick={() => removeAdmin(user.email)}
                                    className="mr-2 p-1 bg-red-500 text-white rounded"
                                >
                                    Quitar Admin
                                </button>
                                <button className="p-1 bg-red-600 text-white rounded">
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <h2 className="text-lg font-semibold mb-2">
                    Usuarios Regulares
                </h2>
                <ul className="space-y-2 mb-4 overflow-y-auto">
                    {regularUsers.map((user) => (
                        <li
                            key={user.email}
                            className="p-2 border border-gray-300 rounded flex justify-between items-center"
                        >
                            <Link
                                href={{
                                    pathname: '/user-data',
                                    query: { userEmail: `${user.email}`},
                                }}>
                                <span>
                                    {user.name} {user.lastName} ({user.email})
                                </span>
                            </Link>
                            <div>
                                <button
                                    onClick={() => makeAdmin(user)}
                                    className="mr-2 p-1 bg-green-500 text-white rounded"
                                >
                                    Hacer Admin
                                </button>
                                <button
                                    onClick={() =>
                                        removeRegularUser(user.email)
                                    }
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {showMessage && (
                    <p
                        className={`${
                            statusMessage.includes("éxito")
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserManagementModal;
