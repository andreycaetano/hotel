export interface ICreateHotel {
    name: string;
    description: any;
    star: number;
    images?: string[];
    facilitiesIds: any;
    cityId: number;
    conditionId: number;
    travelTimeId: number;
    sportsIds: any;
}