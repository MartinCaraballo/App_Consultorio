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
    const [userReserveData, setUserReserveData] = useState<
        UserReserveData | undefined
    >(undefined);

    async function fetchData() {
        axiosInstance
            .get<UserReserveData>(`/get-reserve-data/${searchParams.userEmail}`)
            .then((res) => setUserReserveData(res.data))
            .finally(() => setLoading(false));
    }

    React.useEffect(() => {
        fetchData();
    });

    if (loading) {
        return <div>{<LoadingComponent />}</div>;
    }

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                {`Información de: ${userReserveData?.userName} ${userReserveData?.lastName}`}
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
                {/* Contenedor de fechas, responsivo con flex wrap */}
                <div className="flex flex-wrap justify-center p-4 mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="font-bold text-gray-700">
                        Desde:
                        <input
                            type="date"
                            className="rounded-lg ml-2 mr-5 border-2 border-gray-300 px-2 py-1 mt-2 sm:mt-0"
                        />
                    </div>
                    <div className="font-bold text-gray-700">
                        Hasta:
                        <input
                            type="date"
                            className="rounded-lg ml-2 border-2 border-gray-300 px-2 py-1 mt-2 sm:mt-0"
                        />
                    </div>
                </div>

                {/* Contenedor de tablas responsivo */}
                <div className="flex flex-col space-y-4 px-4 mt-8 xl:mx-36 2xl:mx-52 text-white">
                    {/* Encabezado de la tabla */}
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
