
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="bg-amber-500 p-2 rounded-xl">
          <i className="fas fa-gem text-white text-xl"></i>
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic gradient-text">BULDIROP</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-amber-500 transition-colors">Bosh sahifa</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Yutuqlar</a>
        <a href="#" className="hover:text-amber-500 transition-colors">G'oliblar</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Yordam</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Balans</p>
            <p className="text-sm font-bold text-amber-500">{user.balance.toLocaleString()} so'm</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
            <i className="fas fa-plus text-xs text-white"></i>
          </button>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
          <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-amber-500" />
          <span className="text-sm font-bold hidden sm:inline">{user.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
