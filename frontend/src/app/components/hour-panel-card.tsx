type propsType = {
    day: Date,
    hourCuantity: number
}

const HourPanelCard = (props: propsType) => {
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-950 rounded-lg flex flex-row items-center justify-between bg-gray-700 text-white w-72 md:w-96 md:text-2xl">
                <h1 className="font-bold text-lg px-2 py-2 md:text-3xl">
                    {`${daysNameOfWeek[props.day.getDay() - 1]} ${props.day.getDate()}`}
                </h1>
                <p className="py-2 px-2 font-medium">
                    {`Horas: ${props.hourCuantity}`}
                </p>
            </div>
        </main>
    );
}

export default HourPanelCard;