"use client";

import axiosInstance from "@/utils/axios_instance";
import {useState} from "react";
import React from "react";
import LoadingComponent from "../components/loading/loading";

const UserDataPage = ({
                          searchParams,
                      }: {
    searchParams: { userEmail: string };
}) => {
    const [loading, setLoading] = useState(true);
    const [userReserves, setUserReserves] = useState<ReserveDTO[] | undefined>(undefined);
    const [userMonthCost, setUserMonthCost] = React.useState<number>(0);

    const today = new Date();
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date>(new Date(today.getFullYear(), today.getMonth() + 1, 0));

    function formatDate(date: Date) {
        const year = date.getFullYear().toString().padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    async function fetchUserReserves() {
        axiosInstance
            .get<ReserveDTO[]>(`/admin/get-user-reserves/${searchParams.userEmail}?startDate=${'2024-11-14'}&endDate=${'2024-11-28'}`)
            .then((res) => setUserReserves(res.data))
    }

    async function fetchUserMonthlyCost() {
        axiosInstance
            .get<number>(`/admin/get-user-monthly-cost/${searchParams.userEmail}?startDate=${'2024-11-14'}&endDate=${'2024-11-28'}`)
            .then((res) => setUserMonthCost(res.data))
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
        return <div>{<LoadingComponent/>}</div>;
    }

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                {`Información de: ${userReserves?.pop()?.name} ${userReserves?.pop()?.lastName}`}
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
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

                <div className="flex flex-col space-y-4 px-4 mt-8 xl:mx-36 2xl:mx-52 text-white">
                    <div className="flex flex-col sm:flex-row rounded-lg bg-gray-700 p-4 text-center sm:space-x-4">
                        <div className="w-full sm:w-1/3 font-bold">Reserve</div>
                        <div className="w-full sm:w-1/3 font-bold">Date</div>
                        <div className="w-full sm:w-1/3 font-bold">
                            Monthly Cost
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default UserDataPage;
