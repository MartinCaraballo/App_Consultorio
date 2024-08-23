import React from "react";
import HourPanelCard from "@/app/components/hour-panel-card";

export default function HourPanel() {
    const totalCost = 1123123
    const totalHours = 18
    return (
        <main className="h-screen bg-gray-600 px-4 pb-[14.3rem]">
            <h1 className="py-4 font-bold text-3xl text-white">
                Panel de Horas
            </h1>
            <div className="rounded-lg bg-white h-full">
                <div
                    className="grid place-items-center grid-cols-1 py-2">
                    <HourPanelCard day={new Date()} hour_cuantity={1123}/>
                </div>
            </div>
            <div
                className="absolute bottom-[80px] left-4 right-4 bg-white flex flex-col items-center py-1 h-16 rounded-lg font-bold">
                <p>{`Total de horas: ${totalHours} hs`}</p>
                <p>{`Costo total: $${totalCost}`}</p>
            </div>
        </main>
    );
}