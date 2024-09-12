export interface ReserveDTO {
    name: string;
    lastName: string;
    roomId: number,
    startTime: number[];
    reserveDate: Date;
    canCancel: boolean;
}