"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            }
        );

        if (response.ok) {
            router.push("/reserve");
        } else if (response.status === 401 || response.status === 404) {
            const responseBody = await response.json();
            setError(responseBody.message);
        }
    }

    async function sendRecoverPasswordReq(email: string) {
        try {
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            console.log(res.status);
        } catch (e) {
            console.error(e);
        }
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
                                Iniciar Sesión
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
