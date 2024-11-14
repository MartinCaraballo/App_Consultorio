"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios_instance";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        axiosInstance
            .post("/auth/login", { email, password })
            .then(() => {
                router.push("/reserve");
            })
            .catch((err) => {
                const status = err.response.status;
                if (status === 401) {
                    setError("Este usuario no está autorizado.");
                } else if (status === 404) {
                    setError("Usuario o contraseña incorrectas.");
                } else {
                    setError("Error al iniciar sesión, inténtelo más tarde.");
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <main className="flex items-center justify-center h-screen">
            <div className="flex min-h-3/4 min-w-96 flex-col justify-center px-6 py-12 lg:px-8 rounded-xl border-2 border-gray-200">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Inicia sesión en tu cuenta
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        method="POST"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Correo electrónico
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <a
                                        href={"/forgot-password"}
                                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                                {!loading ? "Iniciar Sesión" : "Procesando..."}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                            <p>{error}</p>
                        </div>
                    )}
                    <p className="mt-10 text-center text-sm text-gray-500">
                        ¿No estás registrado?
                        <a
                            href="/register"
                            className="pl-1 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Regístrate ahora!
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
