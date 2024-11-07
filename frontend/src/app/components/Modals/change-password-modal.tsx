import React, { useState } from 'react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    async function changePassword() {
        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/user/change-pass`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: currentPassword, newPassword: newPassword }),
                credentials: 'include',
            });

            if (res.status === 200) {
                setMessage('Cambio de contraseña exitoso.');
                setMessageType('success');
            } else if (res.status === 401) {
                setMessage('La contraseña actual ingresada no es correcta.');
                setMessageType('error');
            } else {
                setMessage('Ha ocurrido un error inesperado. Vuelva a intentarlo más tarde.');
                setMessageType('error');
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword === confirmPassword && currentPassword) {
            changePassword();
        } else {
            setMessage('Error: Las contraseñas no coinciden.');
            setMessageType('error');
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Cambiar Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="current-password">Contraseña Actual</label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="new-password">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                                required
                            />
                        </div>
                        {message && (
                            <div className={`mb-4 p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Cambiar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ChangePasswordModal;
