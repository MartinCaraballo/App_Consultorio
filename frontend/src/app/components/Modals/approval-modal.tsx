import React from 'react';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, users, setUsers }) => {
    const approveUser = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isApproved: true } : user
        ));
    };

    const rejectUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    if (!isOpen) return null;

    const pendingUsers = users.filter(user => !user.isApproved);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Autorizar Usuarios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times; {/* Carácter de cruz */}
                    </button>
                </div>

                <ul className="space-y-2">
                    {pendingUsers.map((user) => (
                        <li key={user.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span>{`${user.name} (${user.email})`}</span>
                            <div>
                                <button
                                    onClick={() => approveUser(user.id)}
                                    className="mr-2 p-1 bg-green-500 text-white rounded"
                                >
                                    Aprobar
                                </button>
                                <button
                                    onClick={() => rejectUser(user.id)}
                                    className="p-1 bg-red-600 text-white rounded"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ApprovalModal;