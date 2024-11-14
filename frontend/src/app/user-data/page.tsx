"use client";

import axiosInstance from "@/utils/axios_instance";
import { useState } from "react";
import React from "react";
import LoadingComponent from "../components/loading/loading";

const UserDataPage = ({
    searchParams,
}: {
    searchParams: { userEmail: string };
}) => {
    const [loading, setLoading] = useState(true);
    const [userReserves, setUserReserves] = useState<ReserveDTO[]>([]);
    const [userMonthCost, setUserMonthCost] = React.useState<number>(0);
    const [userName, setUserName] = React.useState("");
    const [userLastName, setUserLastName] = React.useState("");

    const today = new Date();
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date>(new Date(today.getFullYear(), today.getMonth() + 1, 0));

    function formatDate(date: Date) {
        const year = date.getFullYear().toString().padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    async function fetchUserReserves() {
        axiosInstance
            .get<ReserveDTO[]>(
                `/admin/get-user-reserves/${searchParams.userEmail
                }?startDate=${"2024-11-14"}&endDate=${"2024-11-28"}`
            )
            .then((res) => {
                setUserReserves(res.data);
                const reserve = res.data.pop();
                if (reserve) {
                    setUserName(reserve.name);
                    setUserLastName(reserve.lastName);
                }
            });
    }

    async function fetchUserMonthlyCost() {
        axiosInstance
            .get<number>(
                `/admin/get-user-monthly-cost/${searchParams.userEmail
                }?startDate=${"2024-11-14"}&endDate=${"2024-11-28"}`
            )
            .then((res) => setUserMonthCost(res.data));
    }

    function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const eventValue = e.target.value;
        const date = eventValue.split('-');
        setSelectedStartDate(new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])));
    }

    function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const eventValue = e.target.value;
        const date = eventValue.split('-');
        setSelectedEndDate(new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])));
    }

    React.useEffect(() => {
        Promise
            .all([fetchUserReserves(), fetchUserMonthlyCost()])
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>{<LoadingComponent />}</div>;
    }

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                {`Información de: ${userName} ${userLastName}`}
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
                {/* Contenedor de fechas, responsivo con flex wrap */}
                <div className="flex flex-wrap justify-center p-4 mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="font-bold text-gray-700">
                        Desde:
                        <input
                            type="date"
                            className="rounded-lg ml-2 mr-5 border-2 border-gray-300 px-2 py-1 mt-2 sm:mt-0"
                            value={`${formatDate(selectedStartDate)}`}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="font-bold text-gray-700">
                        Hasta:
                        <input
                            type="date"
                            className="rounded-lg ml-2 border-2 border-gray-300 px-2 py-1 mt-2 sm:mt-0"
                            value={`${formatDate(selectedEndDate)}`}
                            onChange={handleEndDateChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-self-center">
                    <div className="flex flex-col items-center justify-center mt-2 overflow-y-auto">
                        <ul className="w-full flex flex-col items-center">
                            {userReserves.map((reserve, index) => {
                                const startTime = new Date();
                                startTime.setHours(reserve.startTime[0]);
                                startTime.setMinutes(reserve.startTime[1]);

                                const endTime = new Date();
                                endTime.setHours(reserve.endTime[0]);
                                endTime.setMinutes(reserve.endTime[1]);

                                const year = reserve.reserveDate[0].toString();
                                const month = reserve.reserveDate[1].toString();
                                const day = reserve.reserveDate[2].toString();

                                return (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between border-b py-2 w-full sm:w-1/2 font-bold flex-col sm:flex-row rounded-lg bg-gray-700 p-4 text-center sm:space-x-4 text-white"
                                    >
                                        <span>
                                            {formatTime(startTime)} - {formatTime(endTime)}
                                        </span>
                                        <span>
                                            {`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="grid">
                        <div className="flex p-4 justify-self-end justify-center border rounded-lg bg-gray-700 text-white font-bold">
                            {`Costo mensual: $${userMonthCost}`}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default UserDataPage;
