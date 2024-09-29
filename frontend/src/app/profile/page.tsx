'use client'

import {useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import UserManagementModal from "@/app/components/Modals/user-management-modal";
import ApprovalModal from "@/app/components/Modals/approval-modal";
import PriceModificationModal from "@/app/components/Modals/price-modification-modal";

interface JwtPayload {
    sub: string;
    name: string;
    lastname: string;
    role: string;
    exp: number;
}

const Profile = () => {
    const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('=')[1];
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                setUserInfo(decodedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = async () => {
        // Aquí deberías manejar la lógica de cierre de sesión
        await fetch('/api/logout', {method: 'POST'});
        // Cookie.remove('jwt-token'); // Eliminar el token de las cookies
        router.push('/login');
    };

    const [users, setUsers] = useState([
        { id: 1, name: 'Usuario Uno', email: 'uno@example.com', isAdmin: false, isApproved: false },
        { id: 2, name: 'Usuario Dos', email: 'dos@example.com', isAdmin: true, isApproved: false },
    ]);

    const [prices, setPrices] = useState([
        { id: 1, hours: 10, pricePerHour: 280.00 },
        { id: 2, hours: 20, pricePerHour: 500.00 },
    ]);

    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
    const [isPriceModalOpen, setPriceModalOpen] = useState(false);

    return (
        <main className="flex flex-col min-h-screen bg-gray-600 px-4 pb-16">
            <div className="flex flex-col items-center place-content-center flex-grow">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                        <Image
                            src="/generic_avatar.png"
                            alt="Profile Picture"
                            priority={true}
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <h1 className="mt-4 text-2xl font-semibold text-gray-800">{`${userInfo?.name} ${userInfo?.lastname}`}</h1>
                        <p className="mt-2 text-gray-600">{userInfo?.sub}</p>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {userInfo?.role === 'ADMIN' &&
                            <>
                                <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                    <button
                                        onClick={() => setApprovalModalOpen(true)}
                                        className="text-white hover:underline"
                                    >
                                        Autorizaciones Pendientes
                                    </button>
                                </li>
                                <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                    <button
                                        onClick={() => setUserModalOpen(true)}
                                        className="text-white hover:underline w-full h-full">
                                        Ver Usuarios
                                    </button>
                                </li>
                                <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                    <button
                                        onClick={() => setPriceModalOpen(true)}
                                        className="text-white hover:underline"
                                    >
                                        Modificar Precios
                                    </button>
                                </li>
                            </>

                        }
                        <>
                            <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                <a href="/profile/change-email" className="text-white hover:underline">
                                    Cambiar Correo Electrónico
                                </a>
                            </li>
                            <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                <a href="/profile/change-password" className="text-white hover:underline">
                                    Cambiar Contraseña
                                </a>
                            </li>
                            <li className="text-center h-12 rounded-xl place-content-center bg-gray-700">
                                <a href="/profile/report-issue" className="text-white hover:underline">
                                    Reportar un Problema
                                </a>
                            </li>
                        </>
                    </ul>
                    <div className="text-center h-12 mt-16 rounded-xl place-content-center bg-red-600">
                        <button onClick={handleLogout} className="text-white hover:underline">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            <UserManagementModal
                isOpen={isUserModalOpen}
                onClose={() => setUserModalOpen(false)}
                users={users}
                setUsers={setUsers}
            />
            <ApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setApprovalModalOpen(false)}
                users={users}
                setUsers={setUsers}
            />
            <PriceModificationModal
                isOpen={isPriceModalOpen}
                onClose={() => setPriceModalOpen(false)}
                prices={prices}
                setPrices={setPrices}
            />
        </main>
    );
};

export default Profile;
