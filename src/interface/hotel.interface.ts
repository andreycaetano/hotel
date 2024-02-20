export interface ICreateHotel {
    name: string;
    description: any;
    star: number;
    images?: string[];
    facilities: any;
    cityId: number
}