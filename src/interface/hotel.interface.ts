export interface IHotel {
  id: number;
  name: string;
  address: any;
  description: string;
  facilities: any;
  star: number;
  images: string[];
}

export interface ICreatedHotel {
  name: string;
  address: any;
  description: string;
  facilitesIds: any;
  star: number
}