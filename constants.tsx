
import { Prize } from './types';

export const PRIZES: Prize[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    image: 'https://picsum.photos/seed/iphone/600/400',
    price: 15000,
    totalTickets: 1000,
    soldTickets: 654,
    category: 'Texnika',
    description: 'Eng soʻnggi modeldagi iPhone 15 Pro Max. 256GB xotira bilan.'
  },
  {
    id: '2',
    title: 'Chevrolet Tracker 2',
    image: 'https://picsum.photos/seed/car/600/400',
    price: 50000,
    totalTickets: 5000,
    soldTickets: 2100,
    category: 'Avto',
    description: 'Yangi Chevrolet Tracker 2. Redline komplektatsiya.'
  },
  {
    id: '3',
    title: 'MacBook Pro M3',
    image: 'https://picsum.photos/seed/mac/600/400',
    price: 25000,
    totalTickets: 1500,
    soldTickets: 1420,
    category: 'Texnika',
    description: 'MacBook Pro 14" M3 Chip bilan. Professionallar uchun.'
  },
  {
    id: '4',
    title: '10,000,000 Soʻm Naqd',
    image: 'https://picsum.photos/seed/cash/600/400',
    price: 5000,
    totalTickets: 2000,
    soldTickets: 1980,
    category: 'Pul mukofoti',
    description: 'Kartangizga 10 million soʻm oʻtkazib beriladi.'
  }
];
