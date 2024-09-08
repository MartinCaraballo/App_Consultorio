type propsType = {
    start_date: Date,
    end_date: Date,
    clientName?: string,
    clientLastName?: string,
    canCancel: boolean,
}

const HourCard = (props: propsType) => {

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row justify-evenly items-center bg-gray-200 w-72 sm:w-[26rem] lg:w-96">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg px-2 py-2 2xl:text-3xl">
                        {`${formatTime(props.start_date)} - ${formatTime(props.end_date)}`}
                    </h1>
                    <p className="py-2 px-2 font-medium text-xs w-52 sm:text-sm sm:w-60">
                        {props.clientName ? `Reservado por ${props.clientName} ${props.clientLastName}` : 'Libre para reservar'}
                    </p>
                </div>
                {!props.clientName && (
                    <button
                        className={`border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg ${props.canCancel ? 'bg-red-600 border-red-800' : 'bg-black'}`}>
                        {props.canCancel ? 'Cancelar' : 'Reservar'}
                    </button>
                )
                }
            </div>
        </main>
    );
}

export default HourCard;