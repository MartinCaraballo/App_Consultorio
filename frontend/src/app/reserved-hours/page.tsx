"use client";

import React, { useEffect, useState } from "react";
import ReservedHourCard from "@/app/components/reserved-hour-card";
import FixedReserveModal from "@/app/components/Modals/adm-fixed-reserves-modal";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
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

    async function fetchActiveReserves() {
        axiosInstance
            .get<ReserveDTO[]>("/reserve/active")
            .then((res) => setReserveCards(res.data))
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
                    {<LoadingComponent />}
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
                <div className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2 max-h-[80vg]">
                    {reserveCards.map((reserve, index) => {
                        return (
                            <ReservedHourCard
                                key={index}
                                startTime={reserve.startTime}
                                endTime={reserve.endTime}
                                reserveDate={reserve.reserveDate}
                                room={reserve.roomId}
                            />
                        );
                    })}
                </div>
            </div>
            <FixedReserveModal isOpen={isModalOpen} onClose={closeModal} />
        </main>
    );
}
