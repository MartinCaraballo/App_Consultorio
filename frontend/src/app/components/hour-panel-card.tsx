type propsType = {
    day: Date,
    hour_cuantity: number
}

const HourPanelCard = (props: propsType) => {
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row items-center justify-between bg-gray-200 w-72">
                <h1 className="font-bold text-lg px-2 py-2 ">
                    {`${daysNameOfWeek[props.day.getDay() - 1]} ${props.day.getDate()}`}
                </h1>
                <p className="py-2 px-2 font-medium">
                    {`Horas: ${props.hour_cuantity}`}
                </p>
            </div>
        </main>
    );
}

export default HourPanelCard;