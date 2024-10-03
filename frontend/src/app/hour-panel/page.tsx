'use client';

import React, {useEffect, useState} from "react";
import HourPanelCard from "@/app/components/hour-panel-card";
import { useRouter } from "next/navigation";

export default function HourPanel() {
    const router = useRouter();

    const [weekCost, setWeekCost] = useState<WeekCostDTO | undefined>(undefined);

    async function fetchWeekReservedDaysAndCost() {
        try {
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_API_URL}/user/week-cost`, {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            if (res.status===403) {
                router.push('/login');
            }

            const data: WeekCostDTO = await res.json();
            console.log(data)
            setWeekCost(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchWeekReservedDaysAndCost();
    }, []);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[14.3rem]">
            <h1 className="py-4 font-bold text-3xl text-white">
                Panel de Horas
            </h1>
            <div className="rounded-lg bg-white h-full">
                <div
                    className="grid place-items-center grid-cols-1 py-2">
                    {weekCost && weekCost.weekDays.map((day, index) => (
                        <HourPanelCard
                            key={index}
                            day={new Date(day.date.toString())}
                            hourCuantity={day.hoursCount}/>
                    ))}
                </div>
            </div>
            <div
                className="absolute bottom-[80px] left-4 right-4 bg-white flex flex-col items-center py-1 h-16 rounded-lg font-bold">
                <p>{`Total de horas: ${weekCost ? weekCost.totalHours : 0} hs`}</p>
                <p>{`Costo total: $${weekCost ? weekCost.totalCost : 0}`}</p>
            </div>
        </main>
    );
}