export interface ICreateHotel {
    name: string;
    description: any;
    ratingId: number;
    images?: string[];
    cityId: number;
    facilitiesIds: any;
    conditionIds: any;
    travelTimeIds: any;
    sportsIds: any;
}