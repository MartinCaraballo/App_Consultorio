type propsType = {
    start_date: Date,
    end_date: Date,
    reserveDate: number[],
    room: number,
}

const ReservedHourCard = (props: propsType) => {
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Function to show the hours with 2 digits.
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row items-center justify-center bg-gray-200 w-72">
                <div className="flex flex-col">
                    <h1 className="font-bold text-3xl px-2 py-2">
                        {`${formatTime(props.start_date)} - ${formatTime(props.end_date)}`}
                    </h1>
                    <p className="py-2 px-2 font-medium">
                        {/*{`${daysNameOfWeek[props.reserveDate.getDay() - 1]} ${props.reserveDate.getDate()} - Consultorio ${props.room}`}*/}
                    </p>
                </div>
            </div>
        </main>
    );
}

export default ReservedHourCard;