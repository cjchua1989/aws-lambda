import { LogisticPaymentType, LogisticType } from '../LogisticFactory';

export interface LogisticBookRequest {
    merchant_id: string;
    sender: Information;
    recipient: Information;
    payment_method: LogisticPaymentType;
    channel: LogisticType;
    packages: Package[];
    origin: Geolocation;
    destination: Geolocation;
}

export interface LogisticRequest {
    channel: LogisticType;
    packages: Package[];
    origin: Geolocation;
    destination: Geolocation;
    cash_on_delivery: number;
}

interface Package {
    code: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    dimensions: {
        height: number;
        width: number;
        depth: number;
        weight: number;
    };
}

interface Geolocation {
    address: {
        address1: string;
        address2: string;
        barangay: string;
        city_municipality: string;
        province: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface Information {
    mobile: string;
    last_name: string;
    first_name: string;
    email: string;
}
