interface ReserveDTO {
    name: string;
    lastName: string;
    roomId: number,
    startTime: number[];
    endTime: number[];
    reserveDate: number[];
    dayIndex: number,
    canCancel: boolean;
    isMonthly: boolean;
}