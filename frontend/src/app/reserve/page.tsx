"use client";

import React, { useEffect, useState } from "react";
import HourCard from "@/app/components/hour-card";
import ConfirmReserveModal from "@/app/components/Modals/confirm-reserve-modal";
import InfoModal from "@/app/components/Modals/info-modal";
import axiosInstance from "../../utils/axios_instance";
import { error } from "console";

export default function ReservePage() {
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Stores and updates the room selected.
    const [selectedRoom, setSelectedRoom] = useState(1);

    // Boolean to enter to edit mode and exit from it.
    const [editingReserve, setEditingReserve] = useState(false);

    // Function to set the editing reserve mode from the card component.
    const setEditingMode = (mode: boolean) => {
        setEditingReserve(mode);
    };

    // State to manage hours to reserve
    const [hoursToReserve, setHoursToReserve] = useState<string[]>([]);

    // Function to add the selected card to reserve to the list.
    const addHourToReserve = (startTime: string) => {
        setHoursToReserve((prevHours) => [...prevHours, startTime]);
    };

    // Function to remove the canceled card to reserve in the list.
    const removeHourToReserve = (startTimeCanceled: string) => {
        setHoursToReserve((prevHours) => {
            const updatedHours = prevHours.filter(
                (hour) => hour !== startTimeCanceled
            );
            if (updatedHours.length === 0) {
                setEditingReserve(false);
            }
            return updatedHours;
        });
    };

    // Function to clear the list of hours to reserve
    const clearHoursToReserve = () => {
        setHoursToReserve([]);
        setEditingReserve(false);
        setReserveCards([]);
    };

    // State of the modal to confirm reserve.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
    const [infoModalMessage, setInfoModalMessage] = useState<string>("");
    const [infoModalSuccess, setInfoModalSuccess] = useState<boolean>(true);

    const handleInfoModalClose = () => {
        setIsInfoModalOpen(false);
    };

    const updateReserveCardsFromModal = () => {
        fetchReserves(
            selectedRoom,
            selectedDayIndex,
            formatDate(selectedDayDate)
        );
    };

    // Handle room selection in combobox.
    const handleChangeRoom = (event: any) => {
        const value = event.currentTarget.value.toString().split(" ")[1];
        setSelectedRoom(value);
        clearHoursToReserve();
        fetchReserves(value, selectedDayIndex, formatDate(selectedDayDate));
    };

    const today = new Date();
    // Name of the days in the week.
    const daysNameOfWeek = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    const [selectedDayIndex, setSelectedDayIndex] = useState(today.getDay());
    const [selectedDayDate, setSelectedDayDate] = useState(today);

    // Fetch week days, rooms and reserves data
    const [rooms, setRooms] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [reserveCards, setReserveCards] = useState<ReserveDTO[]>([]);

    async function fetchWeek() {
        try {
            axiosInstance.get("/week").then((res) => setWeekDates(res.data));
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchRooms() {
        try {
            axiosInstance.get("/rooms").then((res) => setRooms(res.data));
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchReserves(
        roomId: number,
        dayIndex: number,
        date: string
    ) {
        try {
            axiosInstance.get<ReserveDTO[]>(
                `/reserve?roomId=${roomId}&dayIndex=${dayIndex}&date=${date}`
            ).then((res) => setReserveCards(res.data));
        } catch (e) {
            console.log(e);
        }
    }

    const cancelReserve = async (
        roomId: number,
        date: string,
        startTime: string
    ) => {
        try {
            axiosInstance.delete(
                `/reserve?roomId=${roomId}&startTime=${startTime}&date=${date}`
            )
                .then((res) => {
                    setInfoModalMessage("Reserva cancelada con éxito.");
                    setInfoModalSuccess(true);
                    fetchReserves(
                        selectedRoom,
                        selectedDayIndex,
                        formatDate(selectedDayDate)
                    );
                    setIsInfoModalOpen(true);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        setInfoModalMessage(
                            "No se cumplen las condiciones horarias para cancelar la reserva."
                        );
                        setInfoModalSuccess(false);
                    } else {
                        setInfoModalMessage(
                            "Error al cancelar la reserva. Por favor, inténtelo de nuevo."
                        );
                        setInfoModalSuccess(false);
                    }
                });
        } catch (error) {
            setInfoModalMessage(
                "Error de conexión. Por favor, inténtelo más tarde."
            );
            setInfoModalSuccess(false);
        }
    };

    useEffect(() => {
        fetchWeek();
        fetchRooms();
        fetchReserves(
            selectedRoom,
            selectedDayIndex,
            formatDate(selectedDayDate)
        );
    }, []);

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Reservar un consultorio
            </h1>
            <div className="rounded-lg bg-white h-full overflow-y-auto">
                <div className="flex justify-center p-2 border-gray-300 rounded-lg">
                    <div className="inline-flex overflow-x-auto max-w-full font-bold">
                        {weekDates.map((day, index) => {
                            const dayDate = new Date(day);
                            const weekDayIndex = dayDate.getDay();
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedDayIndex(weekDayIndex);
                                        setSelectedDayDate(dayDate);
                                        clearHoursToReserve();
                                        fetchReserves(
                                            selectedRoom,
                                            weekDayIndex,
                                            formatDate(dayDate)
                                        );
                                    }}
                                    className={`flex-shrink-0 w-28 text-center py-2 cursor-pointer ${
                                        selectedDayDate.getDate() ===
                                        dayDate.getDate()
                                            ? "bg-gray-700 text-white"
                                            : "text-gray-700"
                                    } rounded-lg transition-colors duration-300`}
                                >
                                    {`${
                                        daysNameOfWeek[weekDayIndex]
                                    } ${dayDate.getDate()}`}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className={`px-4 flex flex-wrap ${
                        editingReserve ? "justify-evenly" : ""
                    }`}
                >
                    <div className="py-1 font-bold text-lg">
                        <select
                            className="block px-3 py-2 bg-gray-700 rounded-lg text-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-700"
                            id="combobox"
                            value={`Consultorio ${selectedRoom}`}
                            onChange={handleChangeRoom}
                        >
                            {rooms.map((option) => (
                                <option
                                    key={option}
                                >{`Consultorio ${option}`}</option>
                            ))}
                        </select>
                    </div>
                    {editingReserve && (
                        <button
                            onClick={openModal}
                            className="py-1 bg-green-500 rounded-full px-2 font-bold text-lg border-2 border-green-800"
                            disabled={!editingReserve}
                        >
                            CONFIRMAR RESERVA
                        </button>
                    )}
                </div>
                <div className="grid place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 py-2 overflow-y-auto max-h-[80vg]">
                    {reserveCards.map((reserve) => {
                        const startTime = new Date();
                        startTime.setHours(reserve.startTime[0]);
                        startTime.setMinutes(reserve.startTime[1]);

                        const endTime = new Date();
                        endTime.setHours(reserve.endTime[0]);
                        endTime.setMinutes(reserve.endTime[1]);
                        return (
                            <HourCard
                                key={reserve.startTime.toString()}
                                clientName={reserve.name}
                                clientLastName={reserve.lastName}
                                startDate={startTime}
                                endDate={endTime}
                                reserveDate={reserve.reserveDate}
                                roomId={reserve.roomId}
                                canCancel={reserve.canCancel}
                                setEditingModeFunction={setEditingMode}
                                addHourToReserveListFunction={addHourToReserve}
                                removeHourToReserveListFunction={
                                    removeHourToReserve
                                }
                                cancelReserveFunction={cancelReserve}
                            />
                        );
                    })}
                </div>
            </div>
            <ConfirmReserveModal
                isOpen={isModalOpen}
                onClose={closeModal}
                hoursToReserve={hoursToReserve}
                selectedDayDate={formatDate(selectedDayDate)}
                selectedRoomId={selectedRoom}
                clearHoursToReserve={clearHoursToReserve}
                updateReserveCards={updateReserveCardsFromModal}
            />
            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={handleInfoModalClose}
                message={infoModalMessage}
                success={infoModalSuccess}
            />
        </main>
    );
}
