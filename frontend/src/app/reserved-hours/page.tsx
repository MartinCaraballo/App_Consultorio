"use client";

import React, {useEffect, useState} from "react";
import ReservedHourCard from "@/app/components/reserved-hour-card";
import FixedReserveModal from "@/app/components/Modals/adm-fixed-reserves-modal";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import axiosInstance from "@/utils/axios_instance";
import LoadingComponent from "../components/loading/loading";

interface JwtPayload {
    sub: string;
    name: string;
    lastname: string;
    role: string;
    exp: number;
}

export default function ReservedHours() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [canMakeFixedReserves, setCanMakeFixedReserves] = useState<boolean>(false);

    const [reserveCards, setReserveCards] = useState<ReserveDTO[]>([]);
    const [monthlyReserves, setMonthlyReserves] = useState<ReserveDTO[]>([]);

    const [activeTab, setActiveTab] = useState<"active" | "monthly">("active");

    async function fetchActiveReserves() {
        axiosInstance
            .get<ReserveDTO[]>("/reserve/active")
            .then((res) => setReserveCards(res.data))
            .finally(() => setLoading(false));
    }

    async function fetchMonthlyReserves() {
        axiosInstance
            .get<ReserveDTO[]>("/reserve/monthly")
            .then((res) => setMonthlyReserves(res.data))
            .catch((err) => console.error("Error fetching monthly reserves:", err))
            .finally(() => setLoading(false));
    }

    async function getUserCanMakeFixedReserves() {
        axiosInstance
            .get<boolean>("/user/can-make-fixed-reserves")
            .then((res) => setCanMakeFixedReserves(res.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchActiveReserves();
        fetchMonthlyReserves();

        const token = document.cookie.split("=")[1];
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);

                if (decodedToken.role === "ADMIN") {
                    setIsAdmin(true);
                } else {
                    getUserCanMakeFixedReserves();
                }

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Mis Reservas
            </h1>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {<LoadingComponent/>}
                </div>
            )}
            <div className="rounded-lg bg-white h-full text-lg overflow-y-auto">
                {(isAdmin || canMakeFixedReserves) && (
                    <div className="flex flex-row px-4 justify-center">
                        <button
                            onClick={openModal}
                            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 mt-4"
                        >
                            Administrar Mis Reservas Fijas
                        </button>
                    </div>
                )}
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`py-2 px-4 rounded-t-lg ${
                            activeTab === "active"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Activas de la Semana
                    </button>
                    <button
                        onClick={() => setActiveTab("monthly")}
                        className={`py-2 px-4 rounded-t-lg ${
                            activeTab === "monthly"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Historial del Mes
                    </button>
                </div>
                <div className="px-4 pb-4">
                    {activeTab === "active" && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Reservas Activas de la Semana</h2>
                            {reserveCards.length === 0 ? (
                                <p className="text-center text-gray-500 mt-4">No tienes reservas activas esta
                                    semana.</p>
                            ) : (
                                <div
                                    className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2">
                                    {reserveCards.map((reserve, index) => (
                                        <ReservedHourCard
                                            key={`active-${index}`}
                                            startTime={reserve.startTime}
                                            endTime={reserve.endTime}
                                            reserveDate={reserve.reserveDate}
                                            room={reserve.roomId}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "monthly" && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Historial de Reservas del Mes</h2>
                            {monthlyReserves.length === 0 ? (
                                <p className="text-center text-gray-500 mt-4">No se encontraron reservas este mes.</p>
                            ) : (
                                <div
                                    className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2">
                                    {monthlyReserves.map((reserve, index) => (
                                        <ReservedHourCard
                                            key={`monthly-${index}`}
                                            startTime={reserve.startTime}
                                            endTime={reserve.endTime}
                                            reserveDate={reserve.reserveDate}
                                            room={reserve.roomId}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <FixedReserveModal isOpen={isModalOpen} onClose={closeModal}/>
        </main>
    );
}
