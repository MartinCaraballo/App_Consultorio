import React, { useState } from "react";
import axiosInstance from "@/utils/axios_instance";
import LoadingComponent from "../loading/loading";

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
    const [unauthorizedUsers, setUnauthorizedUsers] = React.useState<User[]>(
        []
    );
    const [showMessage, setShowMessage] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState("");
    const [loading, setLoading] = useState(true);

    // Fetch unauthorized users only when the modal is opened
    React.useEffect(() => {
        if (isOpen) {
            fetchUnauthorizedUsers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function fetchUnauthorizedUsers() {
        setUnauthorizedUsers([]);
        setLoading(true);

        axiosInstance
            .get("/admin/unauthorized-users")
            .then((res) => setUnauthorizedUsers(res.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }

    async function acceptUser(
        userEmail: string,
        name: string,
        lastName: string
    ) {
        axiosInstance
            .put(`/admin/accept-user/${userEmail}`)
            .then(() => {
                setStatusMessage(
                    `Usuario ${name} ${lastName} autorizado con éxito.`
                );
                setShowMessage(true);
                fetchUnauthorizedUsers();
            })
            .catch(() => {
                setStatusMessage(
                    "Error al intentar rechazar el usuario. Inténtelo de nuevo."
                );
                setShowMessage(true);
            });

        setTimeout(() => setShowMessage(false), 2000);
    }

    async function rejectUser(
        userEmail: string,
        name: string,
        lastName: string
    ) {
        axiosInstance
            .put(`/admin/reject-user/${userEmail}`)
            .then(() => {
                setStatusMessage(
                    `Usuario ${name} ${lastName} rechazado con éxito.`
                );
                setShowMessage(true);
                fetchUnauthorizedUsers();
            })
            .catch(() => {
                setStatusMessage(
                    "Error al intentar rechazar el usuario. Inténtelo de nuevo."
                );
                setShowMessage(true);
            });

        setTimeout(() => setShowMessage(false), 2000);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">
                            Autorizar Usuarios
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
                <div className="overflow-y-auto">
                    {unauthorizedUsers.length > 0 ? (
                        <ul className="space-y-2">
                            {unauthorizedUsers.map((user) => (
                                <li
                                    key={user.email}
                                    className="p-2 border border-gray-300 rounded flex justify-between items-center"
                                >
                                    <div>
                                        <span>{`${user.name} ${user.lastName} (${user.email})`}</span>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() =>
                                                acceptUser(
                                                    user.email,
                                                    user.name,
                                                    user.lastName
                                                )
                                            }
                                            className="mr-2 p-1 bg-green-500 text-white rounded w-20"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() =>
                                                rejectUser(
                                                    user.email,
                                                    user.name,
                                                    user.lastName
                                                )
                                            }
                                            className="p-1 bg-red-600 text-white rounded w-20"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">
                            No hay usuarios esperando autorización.
                        </p>
                    )}
                </div>
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

export default ApprovalModal;
