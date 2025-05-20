type propsType = {
    startTime: number[],
    endTime: number[],
    reserveDate: number[],
    room: number,
    canCancel: boolean,
    cancelReserveFunction: (roomId: number, date: string, startTime: string) => void;
}

const MonthlyReservedHourCard = (props: propsType) => {
    const weekDaysName = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const startTime = new Date();
    startTime.setHours(props.startTime[0]);
    startTime.setMinutes(props.startTime[1]);

    const endTime = new Date();
    endTime.setHours(props.endTime[0]);
    endTime.setMinutes(props.endTime[1]);

    const reserveDate = new Date(props.reserveDate[0], props.reserveDate[1] - 1, props.reserveDate[2]);

    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date: number[]): string => {
        const year = date[0].toString().padStart(2, '0');
        const month = date[1].toString().padStart(2, '0');
        const day = date[2].toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-950 rounded-lg flex flex-row items-center text-white justify-center bg-gray-700 w-72">
                <div className="flex flex-col p-2">
                    <h1 className="font-bold text-3xl px-2 py-2">
                        {`${formatTime(startTime)} - ${formatTime(endTime)}`}
                    </h1>
                    <p className="py-2 px-2 font-medium">
                        {`${weekDaysName[reserveDate.getDay() - 1]} ${reserveDate.getDate()} - Consultorio ${props.room}`}
                    </p>
                    {props.canCancel && (
                        <button
                            onClick={() => {
                                props.cancelReserveFunction(props.room, formatDate(props.reserveDate), formatTime(startTime))
                            }}
                            className={'border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg bg-black border-red-800'}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default MonthlyReservedHourCard;