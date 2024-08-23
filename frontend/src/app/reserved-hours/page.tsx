import React from "react";
import ReservedHourCard from "@/app/components/reserved-hour-card";

export default function ReservedHours() {
    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.9rem]">
            <h1 className="py-4 font-bold text-3xl text-white">
                Mis Reservas
            </h1>
            <div className="rounded-lg bg-white h-full pb-96">
                <div
                    className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-2">
                    <ReservedHourCard start_date={new Date()} end_date={new Date()} room={1}/>
                    <ReservedHourCard start_date={new Date()} end_date={new Date()} room={2}/>
                    <ReservedHourCard start_date={new Date()} end_date={new Date()} room={4}/>
                </div>
            </div>
        </main>
    );
}