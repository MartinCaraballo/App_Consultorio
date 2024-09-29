export interface ReserveDTO {
    name: string;
    lastName: string;
    roomId: number,
    startTime: number[];
    endTime: number[];
    reserveDate: number[];
    canCancel: boolean;
}