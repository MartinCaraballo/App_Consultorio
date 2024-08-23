type propsType = {
    start_date: Date,
    end_date: Date,
    room: number,
}

const ReservedHourCard = (props: propsType) => {
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row items-center justify-center bg-gray-200 w-72">
                <div className="flex flex-col">
                    <h1 className="font-bold text-3xl px-2 py-2">
                        {`${props.start_date.getHours()} : ${props.start_date.getMinutes()} - ${props.end_date.getHours()} : ${props.end_date.getMinutes()}`}
                    </h1>
                    <p className="py-2 px-2 font-medium">
                        {`${daysNameOfWeek[props.start_date.getDay() - 1]} ${props.start_date.getDate()} - Consultorio ${props.room}`}
                    </p>
                </div>
            </div>
        </main>
    );
}

export default ReservedHourCard;