'use client'

import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axiosInstance from "@/utils/axios_instance";

const ForgotPasswordPage = ({searchParams, }: {searchParams: { token: string}}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.token) {
            setIsModalOpen(true);
        }
    }, [searchParams.token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance.post('/user/reset-password', { email })
            .then(() => {
                setSuccessMessage("Email de recuperación enviado con éxito!");
                setEmail("");
            })
            .catch(() => setErrorMessage("Error al enviar el correo de recuperación, intente nuevamente más tarde."))
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                        setIsModalOpen(false);
                        setSuccessMessage(null);
                        setErrorMessage(null);
                    }, 3000
                );
            });
    };

    const handlePasswordReset = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        axiosInstance.post('/user/reset-password-token', { token: searchParams.token, newPassword: newPassword })
            .then(() => {
                setSuccessMessage("Contraseña cambiada con éxito!");
                setTimeout(() => router.push("/login"), 2000);
            })
            .catch((err) => {
                const status = err.response.status;

                if (status === 400) {
                    setErrorMessage("El token no es válido.")
                } else {
                    setErrorMessage("A ocurrido un error. Inténtelo más tarde.")
                }
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                        setIsModalOpen(false);
                        setSuccessMessage(null);
                        setErrorMessage(null);
                    }, 3000
                );
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Recuperación de Contraseña</h2>
                <p className="text-center text-gray-600">Ingresa la dirección de correo para recuperar la contraseña</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Dirección de Correo
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ingrese su correo"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 ..."
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
                        Enviar correo de recuperación
                    </button>
                </form>
                {successMessage && (
                    <p className="mt-4 text-center text-green-600">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="mt-4 text-center text-red-600">{errorMessage}</p>
                )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-md shadow-lg">
                        <h3 className="text-lg font-bold text-center">Reinicia tu Contraseña</h3>
                        <p className="mt-2 text-center text-gray-600">
                            Por favor ingresa tu nueva contraseña para resetearla.
                        </p>

                        <form className="mt-4 space-y-4" onSubmit={handlePasswordReset}>
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingresa la nueva contraseña"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirma la contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Confirma la nueva contraseña"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-center text-red-600">{passwordError}</p>
                            )}
                            {successMessage && (
                                <p className="mt-4 text-center text-green-600">{successMessage}</p>
                            )}
                            {errorMessage && (
                                <p className="mt-4 text-center text-red-600">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                className="flex justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {loading && (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 ..."
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
                                Reiniciar Contraseña
                            </button>
                        </form>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPasswordPage;