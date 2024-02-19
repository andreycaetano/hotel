import { Prisma } from "@prisma/client";

export interface ICreateHotel {
    name: string;
    star: number;
    description: {
        comment: string;
        destination: string;
        accommodation: string;
        activities: string;
    };
    address: {
        countryId: number;
        stateId: number;
    };
    facilitesIds: number[];
}

export interface ICreatedHotel {
    id: number;
    name: string;
    description: Prisma.JsonValue;
    star: number;
    images: string[];
    address: Prisma.JsonValue;
    facilities: {
        id: number;
        name: string;
        icon: string;
    }[];
}

export interface HotelData {
    id: number;
    name: string;
    descriptionId: number;
    star: number;
    images: string[];
    address: Prisma.JsonValue;
  }
  
  interface HotelWithFacilities extends HotelData {
    facilities: {
      id: number;
      name: string;
      icon: string;
    }[];
  }
  
  export type NullableHotel = HotelWithFacilities | null;