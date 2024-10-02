'use client'

import React, {useEffect, useState} from 'react';
import ReservedHourCard from "@/app/components/reserved-hour-card";
import FixedReserveModal from "@/app/components/Modals/adm-fixed-reserves-modal";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import {ReserveDTO} from "@/app/models/ReserveDTO";

interface JwtPayload {
    sub: string;
    name: string;
    lastname: string;
    role: string;
    exp: number;
}

export default function ReservedHours() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);


    const [reserveCards, setReserveCards] = useState<ReserveDTO[]>([]);
    async function fetchActiveReserves() {
        try {
            const res = await fetch(
                `http://${process.env.BACKEND_URL}/reserve/active`, {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            if (res.status===403) {
                router.push('/login');
            }

            const data: ReserveDTO[] = await res.json();
            setReserveCards(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchActiveReserves();
        const token = document.cookie.split('=')[1];
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                setIsAdmin(decodedToken.role === 'ADMIN');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Mis Reservas
            </h1>
            <div className="rounded-lg bg-white h-full pb-96 text-lg">
                {isAdmin && (
                    <div className="flex flex-row px-4 justify-center">
                        <button
                            onClick={openModal}
                            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 mt-4"
                        >
                            Administrar Mis Reservas Fijas
                        </button>
                    </div>
                )}
                <div
                    className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2 overflow-y-auto max-h-[80vg]">
                    {reserveCards.map((reserve) => {
                        const startTime = new Date();
                        startTime.setHours(reserve.startTime[0]);
                        startTime.setMinutes(reserve.startTime[1]);

                        const endTime = new Date(startTime);
                        endTime.setHours(endTime.getHours() + 1);
                        return (
                            <ReservedHourCard
                                key={reserve.startTime.toString()}
                                start_date={startTime}
                                end_date={endTime}
                                reserveDate={reserve.reserveDate}
                                room={reserve.roomId} />
                        );
                    })}
                </div>
            </div>
            <FixedReserveModal isOpen={isModalOpen} onClose={closeModal}/>
        </main>
    );
}
