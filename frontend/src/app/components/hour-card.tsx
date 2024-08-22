type propsType = {
    start_date: Date,
    end_date: Date,
    client?: string
}

const HourCard = (props: propsType) => {
    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row justify-evenly items-center bg-gray-300 w-80 2xl:w-96">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg px-2 py-2 lg:text-3xl">
                        {`${props.start_date.getHours()} : ${props.start_date.getMinutes()} - ${props.end_date.getHours()} : ${props.end_date.getMinutes()}`}
                    </h1>
                    <p className="py-2 px-2 font-medium">
                        {props.client ? `Reservado por ${props.client}` : 'Libre para reservar'}
                    </p>
                </div>
                <button
                    className={`border-2 h-12 text-lg text-white px-2 rounded-xl ${props.client ? 'bg-red-600 border-red-800' : 'bg-black'}`}>
                    {props.client ? 'Cancelar' : 'Reservar'}
                </button>
            </div>
        </main>
    );
}

export default HourCard;