import {useState} from "react";

type propsType = {
    start_date: Date,
    end_date: Date,
    clientName?: string,
    clientLastName?: string,
    canCancel: boolean,
    setEditingModeFunction: (mode: boolean) => void;
    addHourToReserveListFunction: (selectedStartTime: string) => void;
    removeHourToReserveListFunction: (canceledStartTime: string) => void;
}

const HourCard = (props: propsType) => {

    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Boolean indicating if the card is being selected or not.
    const [editingMode, setEditingMode] = useState(false);

    return (
        <main className="py-1">
            <div
                className={`border-2 border-gray-950 rounded-lg flex flex-row justify-evenly items-center text-white ${props.clientName ? 'bg-gray-900' : 'bg-gray-700'} w-72 sm:w-[26rem] lg:w-96`}>
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg px-2 py-2 2xl:text-3xl">
                        {`${formatTime(props.start_date)} - ${formatTime(props.end_date)}`}
                    </h1>
                    <p className="py-2 px-2 font-medium text-xs w-52 sm:text-sm sm:w-60">
                        {props.clientName ? `Reservado por ${props.clientName} ${props.clientLastName}` : 'Libre para reservar'}
                    </p>
                </div>
                {!props.clientName && !editingMode &&(
                    <button
                        onClick={() => {
                            props.setEditingModeFunction(true);
                            setEditingMode(true);
                            props.addHourToReserveListFunction(formatTime(props.start_date));
                        }}
                        className={'border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg bg-black border-black'}>
                        Reservar
                    </button>
                )}
                {!props.clientName && editingMode && (
                    <button
                        onClick={() => {
                            setEditingMode(false);
                            props.removeHourToReserveListFunction(formatTime(props.start_date));
                        }}
                        className={'border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg bg-red-600 border-red-800'}>
                        Cancelar
                    </button>
                )}
                {props.canCancel && (
                    <button
                        onClick={() => {
                            // Cancelar reserva
                        }}
                        className={'border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg bg-black border-red-800'}>
                        Cancelar
                    </button>
                )}
            </div>
        </main>
    );
}

export default HourCard;