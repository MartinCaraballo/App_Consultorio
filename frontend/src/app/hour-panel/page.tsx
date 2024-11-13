"use client";

import React, { useEffect, useState } from "react";
import HourPanelCard from "@/app/components/hour-panel-card";
import axiosInstance from "@/utils/axios_instance";
import LoadingComponent from "../components/loading/loading";

export default function HourPanel() {
    const [weekCost, setWeekCost] = useState<WeekCostDTO | undefined>(
        undefined
    );
    const [monthCost, setMonthCost] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchWeekCost = () => {
        axiosInstance
            .get("/user/week-cost")
            .then((res) => setWeekCost(res.data));
    };
    const fetchMonthlyCost = () => {
        axiosInstance
            .get("/user/monthly-cost")
            .then((res) => setMonthCost(res.data));
    };

    useEffect(() => {
        Promise.all([fetchWeekCost(), fetchMonthlyCost()]).then(() =>
            setLoading(false)
        );
    }, []);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[16.3rem]">
            <h1 className="py-4 font-bold text-3xl text-white">
                Panel de Horas
            </h1>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {<LoadingComponent />}
                </div>
            )}

            <div className="rounded-lg bg-white h-full overflow-y-auto">
                <div className="grid place-items-center grid-cols-1 py-2 overflow-y-auto">
                    {weekCost &&
                        weekCost.weekDays.map((day, index) => (
                            <HourPanelCard
                                key={index}
                                day={new Date(day.date.toString())}
                                hourCuantity={day.hoursCount}
                            />
                        ))}
                </div>
            </div>
            <div className="absolute bottom-[80px] left-4 right-4 bg-white flex flex-col items-center py-1 h-24 rounded-lg font-bold text-lg">
                <p>{`Total de horas: ${
                    weekCost ? weekCost.totalHours : 0
                } hs`}</p>
                <p>{`Costo total (semana): $${
                    weekCost ? weekCost.totalCost : 0
                }`}</p>
                <p>{`Costo total (mes): $${monthCost}`}</p>
            </div>
        </main>
    );
}
