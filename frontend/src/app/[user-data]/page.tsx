'use client';

import axiosInstance from "@/utils/axios_instance";
import {useState} from "react";
import React from "react";
import LoadingComponent from "../components/loading/loading";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {daysOfWeek} from "@/app/components/Modals/adm-fixed-reserves-modal";

const UserDataPage = ({searchParams}: { searchParams: { userEmail: string }; }) => {
    const [loading, setLoading] = useState(false);
    const [userReserves, setUserReserves] = useState<ReserveDTO[]>([]);
    const [userFixedReserves, setUserFixedReserves] = useState<ReserveDTO[]>([]);
    const [userMonthCost, setUserMonthCost] = useState<number>(0);
    const [userData, setUserData] = useState<User>();
    const [loadingUserData, setLoadingUserData] = useState(true);
    const [showUserReserves, setShowUserReserves] = useState<boolean>(false);
    const [showFixedReserves, setShowFixedReserves] = useState<boolean>(false);

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

    async function fetchUserReserves(startDate: string, endDate: string) {
        setLoading(true);
        axiosInstance
            .get<ReserveDTO[]>(
                `/admin/get-user-reserves/${searchParams.userEmail}?startDate=${startDate}&endDate=${endDate}`
            )
            .then((res) => setUserReserves(res.data))
            .finally(() => setLoading(false));
    }

    async function fetchUserFixedReserves() {
        setLoading(true);
        axiosInstance
            .get<ReserveDTO[]>(`/admin/get-user-fixed-reserves/${searchParams.userEmail}`)
            .then((res) => setUserFixedReserves(res.data))
            .finally(() => setLoading(false));
    }

    async function fetchUserMonthlyCost(startDate: string, endDate: string) {
        setLoading(true);
        axiosInstance
            .get<number>(
                `/admin/get-user-monthly-cost/${searchParams.userEmail}?startDate=${startDate}&endDate=${endDate}`
            )
            .then((res) => setUserMonthCost(res.data))
            .finally(() => setLoading(false));
    }

    async function fetchUserData() {
        axiosInstance.get<User>(`/admin/get-user-data/${searchParams.userEmail}`)
            .then((res) => setUserData(res.data))
            .finally(() => setLoadingUserData(false));
    }

    async function fetchData(startDate: string, endDate: string) {
        setLoading(true);
        await fetchUserReserves(startDate, endDate);
        await fetchUserMonthlyCost(startDate, endDate);
    }

    function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const eventValue = e.target.value;
        const date = eventValue.split('-');
        const dateObject = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
        setSelectedStartDate(dateObject);
        fetchData(formatDate(dateObject), formatDate(selectedEndDate)).finally(() => setLoading(false));
    }

    function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const eventValue = e.target.value;
        const date = eventValue.split('-');
        const dateObject = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
        setSelectedEndDate(dateObject);
        fetchData(formatDate(selectedStartDate), formatDate(dateObject)).finally(() => setLoading(false));
    }

    const toggleFixedReserves = () => {
        setShowFixedReserves(!showFixedReserves);

        if (!showFixedReserves) {
            fetchUserFixedReserves();
        }
    }
    const toggleUserReserves = () => {
        setShowUserReserves(!showUserReserves);

        if (!showUserReserves) {
            const selectedStartDateFormatted = formatDate(selectedStartDate);
            const selectedEndDateFormatted = formatDate(selectedEndDate);
            Promise
                .all([
                    fetchUserReserves(selectedStartDateFormatted, selectedEndDateFormatted),
                    fetchUserMonthlyCost(selectedStartDateFormatted, selectedEndDateFormatted),
                ])
                .finally(() => setLoading(false));
        }
    }

    React.useEffect(() => {
        fetchUserData()
    }, []);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                {`Información de: ${loadingUserData ? `Cargando...` : `${userData?.name} ${userData?.lastName}`}`}
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
                {loading && (
                    <div>{<LoadingComponent/>}</div>
                )}
                <div className="grid py-2 sm:grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-row font-bold text-gray-700 items-center justify-self-center py-2">
                        <p className="pr-4">Desde:</p>
                        <input
                            type="date"
                            className="rounded-lg border-2 border-gray-300"
                            value={`${formatDate(selectedStartDate)}`}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="flex flex-row font-bold text-gray-700 items-center justify-self-center py-2">
                        <p className="pr-4">Hasta:</p>
                        <input
                            type="date"
                            className="rounded-lg border-2 border-gray-300"
                            value={`${formatDate(selectedEndDate)}`}
                            onChange={handleEndDateChange}
                        />
                    </div>
                </div>
                <div
                    className="flex flex-col justify-self-center mt-2 w-full px-8 sm:px-16 lg:w-2/3 lg:px-0 space-y-4">
                    <button onClick={toggleUserReserves}
                            className="w-full text-left text-lg text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded flex items-center justify-between">
                        <span>{showUserReserves ? "Ocultar Reservas" : "Mostrar Reservas"}</span>
                        <FontAwesomeIcon icon={showUserReserves ? faChevronUp : faChevronDown}/>
                    </button>
                    {showUserReserves && (
                        <ul className="items-center text-lg xl:text-xl space-y-1">
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
                                        className="flex items-center justify-around border-b rounded-lg font-bold bg-gray-700 text-center text-white flex-col sm:flex-row h-24 sm:h-12"
                                    >
                                    <span>
                                        Consultorio: {reserve.roomId}
                                    </span>
                                        <span>
                                        Hora: {formatTime(startTime)} - {formatTime(endTime)}
                                    </span>
                                        <span>
                                        Fecha: {`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`}
                                    </span>
                                        <span>
                                        Tipo: {`${reserve.isMonthly ? "Mensual" : "Semanal"}`}
                                    </span>
                                    </li>
                                );
                            })}
                            <div
                                className="flex justify-end font-bold rounded-lg text-white items-center">
                                <div
                                    className="flex border rounded-lg bg-gray-700 text-white font-bold p-4">
                                    {`Costo mensual total: $${userMonthCost}`}
                                </div>
                            </div>
                        </ul>
                    )}
                    <div
                        className="flex flex-col justify-self-center mt-2 w-full px-8 sm:px-16 lg:px-0 space-y-4">
                        {userData?.canMakeFixedReserve && (
                            <button onClick={toggleFixedReserves}
                                    className="w-full text-left text-lg text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded flex items-center justify-between">
                                <span>{showFixedReserves ? "Ocultar Reservas Fijas" : "Mostrar Reservas Fijas"}</span>
                                <FontAwesomeIcon icon={showFixedReserves ? faChevronUp : faChevronDown}/>
                            </button>
                        )}
                        {showFixedReserves && (
                            <ul className="items-center text-lg xl:text-xl space-y-1 w-full">
                                {userFixedReserves.map((reserve, index) => {
                                    const startTime = new Date();
                                    startTime.setHours(reserve.startTime[0]);
                                    startTime.setMinutes(reserve.startTime[1]);

                                    const endTime = new Date();
                                    endTime.setHours(reserve.endTime[0]);
                                    endTime.setMinutes(reserve.endTime[1]);

                                    return (
                                        <li
                                            key={index}
                                            className="flex items-center justify-around border-b rounded-lg font-bold bg-gray-700 text-center text-white flex-col sm:flex-row h-24 sm:h-12"
                                        >
                                            <span>
                                                Consultorio: {reserve.roomId}
                                            </span>
                                            <span>
                                                Día: {daysOfWeek[reserve.dayIndex]}
                                            </span>
                                            <span>
                                                Hora: {formatTime(startTime)} - {formatTime(endTime)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
export default UserDataPage;
