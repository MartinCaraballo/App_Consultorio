const UserDataPage = ({
    searchParams,
}: {
    searchParams: { userEmail: string };
}) => {
    const reservations: ReserveDTO[] = [
        {
            name: "John",
            lastName: "Doe",
            roomId: 101,
            startTime: [14, 0], // 14:00
            endTime: [15, 0], // 15:00
            reserveDate: [2024, 11, 20], // 20 de noviembre de 2024
            canCancel: true,
        },
        {
            name: "Jane",
            lastName: "Smith",
            roomId: 102,
            startTime: [9, 30], // 9:30
            endTime: [10, 30], // 10:30
            reserveDate: [2024, 11, 21], // 21 de noviembre de 2024
            canCancel: false,
        },
        {
            name: "Carlos",
            lastName: "Gonzalez",
            roomId: 103,
            startTime: [11, 0], // 11:00
            endTime: [12, 30], // 12:30
            reserveDate: [2024, 11, 22], // 22 de noviembre de 2024
            canCancel: true,
        },
        {
            name: "Maria",
            lastName: "Lopez",
            roomId: 104,
            startTime: [16, 0], // 16:00
            endTime: [18, 0], // 18:00
            reserveDate: [2024, 11, 23], // 23 de noviembre de 2024
            canCancel: false,
        },
        {
            name: "Pedro",
            lastName: "Martinez",
            roomId: 105,
            startTime: [10, 0], // 10:00
            endTime: [11, 30], // 11:30
            reserveDate: [2024, 11, 24], // 24 de noviembre de 2024
            canCancel: true,
        },
    ];

    return (
        <main className="h-screen bg-gray-600 px-4 pb-[9.5rem]">
            <h1 className="py-4 font-bold text-2xl text-white sm:text-3xl">
                Información de:
            </h1>
            <div>
                <input
                    type="date"
                    className="rounded-lg absolute top-9 right-4"
                />
            </div>
            <div className="rounded-lg bg-white h-full overflow-y-auto"></div>
        </main>
    );
};
export default UserDataPage;
