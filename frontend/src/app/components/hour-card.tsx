type propsType = {
    start_date: Date,
    end_date: Date,
    client?: string
}

const HourCard = (props: propsType) => {
    return (
        <main className="py-1">
            <div
                className="border-2 border-gray-600 rounded-lg flex flex-row justify-evenly items-center bg-gray-200 w-72 sm:w-[26rem] lg:w-96">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg px-2 py-2 2xl:text-3xl">
                        {`${props.start_date.getHours()} : ${props.start_date.getMinutes()} - ${props.end_date.getHours()} : ${props.end_date.getMinutes()}`}
                    </h1>
                    <p className="py-2 px-2 font-medium text-xs w-52 sm:text-sm sm:w-60">
                        {props.client ? `Reservado por ${props.client}` : 'Libre para reservar'}
                    </p>
                </div>
                <button
                    className={`border-2 h-10 text-sm text-white px-1 rounded-xl 2xl:text-lg ${props.client ? 'bg-red-600 border-red-800' : 'bg-black'}`}>
                    {props.client ? 'Cancelar' : 'Reservar'}
                </button>
            </div>
        </main>
    );
}

export default HourCard;