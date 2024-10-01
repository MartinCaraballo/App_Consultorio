'use client';

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>(undefined);
    const phoneRegex = /^09\d{7}$/;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        const name = formData.get('name');
        const lastName = formData.get('lastname');
        const phoneNumber = formData.get('phone-number');

        if (password != confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!phoneRegex.test(phoneNumber as string)) {
            setError('El número de teléfono no es válido')
            return;
        }

        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, lastName, phoneNumber }),
        });

        if (response.ok) {
            router.replace('/login');
        } else if (response.status === 401) {
            const responseBody = await response.json();
            const bodyMessage = responseBody.message;
            setError(bodyMessage);
        } else {
            setError("Los datos ingresados coinciden con un usuario existente.");
        }
    }

    return (
        <main className="flex items-center justify-center h-screen">
            <div className="flex min-h-3/4 min-w-96 flex-col justify-center px-6 py-12 lg:px-8 rounded-xl border-2 border-gray-200">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Crear una cuenta</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                        <div>
                            <label htmlFor="name"
                                   className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                            <div className="mt-2">
                                <input id="name" name="name" type="text" placeholder="Nombre" required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastname"
                                   className="block text-sm font-medium leading-6 text-gray-900">Apellido</label>
                            <div className="mt-2">
                                <input id="lastname" name="lastname" type="text" placeholder="Apellido" required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">Número
                                de Teléfono</label>
                            <div className="mt-2">
                                <input id="phone-number" name="phone-number" type="number" placeholder="091 234 567"
                                       autoComplete="phone-number" required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Correo
                                electrónico</label>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" placeholder="ejemplo@dominio.com"
                                       autoComplete="email" required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" placeholder="Contraseña"
                                       autoComplete="current-password"
                                       required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirm-password"
                                       className="block text-sm font-medium leading-6 text-gray-900">Confirmar contraseña</label>
                            </div>
                            <div className="mt-2">
                                <input id="confirm-password" name="confirm-password" type="password" placeholder="Confirmar Contraseña"
                                       autoComplete="current-password"
                                       required
                                       className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                    className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Registrarse
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}