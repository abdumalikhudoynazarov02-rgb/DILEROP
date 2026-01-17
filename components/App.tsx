
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PrizeCard from './components/PrizeCard';
import { PRIZES } from './constants';
import { User, Prize } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: 'Azizbek',
    balance: 125000,
    avatar: 'https://picsum.photos/seed/user/100/100'
  });

  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  const handleBuyTicket = (prize: Prize) => {
    if (user.balance >= prize.price) {
      setUser(prev => ({ ...prev, balance: prev.balance - prize.price }));
      alert(`Tabriklaymiz! "${prize.title}" uchun chipta muvaffaqiyatli sotib olindi.`);
      setSelectedPrize(null);
    } else {
      alert('Balansingizda mablag\' yetarli emas. Iltimos, hisobingizni to\'ldiring.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 p-12 flex flex-col md:flex-row items-center justify-between border border-white/10">
          <div className="z-10 text-center md:text-left md:max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              O'z Omadingni <br />
              <span className="gradient-text">Sinab Ko'r!</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 font-medium">
              Eng so'nggi gadjetlar, avtomobillar va naqd pul mukofotlarini juda arzon narxda yutib olish imkoniyatini qo'ldan boy bermang!
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="btn-primary px-8 py-4 rounded-2xl font-bold text-white shadow-xl">
                O'yinlarga o'tish
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-white transition-all backdrop-blur-md">
                Qanday o'ynash kerak?
              </button>
            </div>
          </div>
          <div className="mt-12 md:mt-0 relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-[120px] rounded-full"></div>
            <img 
              src="https://picsum.photos/seed/gift/600/600" 
              alt="Main Gift" 
              className="relative w-80 h-80 object-cover rounded-3xl rotate-3 shadow-2xl border-4 border-white/10"
            />
          </div>
        </section>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <button className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold whitespace-nowrap shadow-lg">Barchasi</button>
          <button className="glass text-gray-300 hover:text-white px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-none">Texnika</button>
          <button className="glass text-gray-300 hover:text-white px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-none">Avtomobillar</button>
          <button className="glass text-gray-300 hover:text-white px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-none">Pul mukofotlari</button>
          <button className="glass text-gray-300 hover:text-white px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-none">Aksiya</button>
        </div>

        {/* Prize Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {PRIZES.map(prize => (
            <PrizeCard key={prize.id} prize={prize} onSelect={setSelectedPrize} />
          ))}
        </div>
      </main>

      {/* Purchase Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-[2.5rem] p-8 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedPrize(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">Chipta Harid Qilish</h2>
              <p className="text-gray-400 font-medium">Tanlangan: <span className="text-white">{selectedPrize.title}</span></p>
            </div>

            <div className="flex items-center justify-between p-4 glass rounded-2xl mb-8 border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2 rounded-xl">
                  <i className="fas fa-ticket-alt text-amber-500"></i>
                </div>
                <span className="font-bold">1 dona chipta</span>
              </div>
              <span className="font-black text-xl">{selectedPrize.price.toLocaleString()} so'm</span>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleBuyTicket(selectedPrize)}
                className="btn-primary w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl"
              >
                Tasdiqlash
              </button>
              <button 
                onClick={() => setSelectedPrize(null)}
                className="w-full py-4 text-gray-400 font-bold hover:text-white transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-6">
              <div className="bg-amber-500 p-2 rounded-xl">
                <i className="fas fa-gem text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic gradient-text">BULDIROP</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed font-medium">
              Buldirop.club - O'zbekistondagi eng yirik va shaffof onlayn tanlovlar platformasi. Biz bilan orzularingizga erishish yanada oson!
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Platforma</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li><a href="#" className="hover:text-amber-500">Qanday ishlaydi?</a></li>
              <li><a href="#" className="hover:text-amber-500">Ommaviy oferta</a></li>
              <li><a href="#" className="hover:text-amber-500">Maxfiylik siyosati</a></li>
              <li><a href="#" className="hover:text-amber-500">Kontaktlar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Ijtimoiy Tarmoqlar</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 glass flex items-center justify-center rounded-2xl hover:bg-amber-500 transition-all text-white">
                <i className="fab fa-telegram-plane text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 glass flex items-center justify-center rounded-2xl hover:bg-amber-500 transition-all text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 glass flex items-center justify-center rounded-2xl hover:bg-amber-500 transition-all text-white">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
          &copy; 2024 BULDIROP.CLUB | Barcha huquqlar himoyalangan
        </div>
      </footer>
    </div>
  );
};

export default App;
