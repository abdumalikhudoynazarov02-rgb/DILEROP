
import React from 'react';
import { Prize } from '../types';

interface PrizeCardProps {
  prize: Prize;
  onSelect: (prize: Prize) => void;
}

const PrizeCard: React.FC<PrizeCardProps> = ({ prize, onSelect }) => {
  const progress = (prize.soldTickets / prize.totalTickets) * 100;

  return (
    <div className="glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={prize.image} 
          alt={prize.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {prize.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{prize.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prize.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-300">Sotildi: {prize.soldTickets} / {prize.totalTickets}</span>
            <span className="text-sm font-bold text-amber-500">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-5">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Chipta narxi</p>
              <p className="text-lg font-extrabold text-white">{prize.price.toLocaleString()} so'm</p>
            </div>
            <button 
              onClick={() => onSelect(prize)}
              className="btn-primary flex-1 py-3 px-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
            >
              <i className="fas fa-ticket-alt"></i>
              Olish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeCard;
