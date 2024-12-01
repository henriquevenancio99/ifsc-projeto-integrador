export interface ISalonService {
  id: string;
  name: string;
  price: number;
  priceFormatted?: string;
  serviceTypes: Record<string, string>;
  selectedSalonServiceTypes: string[];
  serviceTime: string;
  description: string;
}

export interface ICreateSalonService {
  name: string;
  price: number;
  serviceTypes: Record<string, string>;
  selectedSalonServiceTypes: string[];
  serviceTime: string;
  description: string;
}

export interface ISalonServiceState {
  salonServiceId: string;
  salonServiceName: string;
  salonServicePrice: number;
  salonServicePriceFormatted: string;
  salonServiceTypes: Record<string, string>;
  salonServiceTime: string;
  salonServiceDescription: string;
  selectedSalonServiceTypes: string[];
}
