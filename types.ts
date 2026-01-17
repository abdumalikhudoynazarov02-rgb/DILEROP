
export interface Prize {
  id: string;
  title: string;
  image: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  category: string;
  description: string;
}

export interface User {
  name: string;
  balance: number;
  avatar: string;
}

export enum Category {
  TECH = 'Texnika',
  AUTO = 'Avto',
  CASH = 'Pul mukofoti',
  LUXURY = 'Hashamat',
}
