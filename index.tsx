
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { auth, db } from "./firebase";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";

// --- Types ---
interface UserData {
  id: string;
  email: string;
  nickname: string;
  balance: number;
  winProbability: number;
  lastFreeCase?: number;
}

interface Message {
  id: string;
  userId: string;
  nickname: string;
  text: string;
  isAdmin: boolean;
  timestamp: number;
}

interface CaseItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  color: string;
  isFree?: boolean;
}

const ADMIN_EMAIL = "barsik2010@gmail.com";
const ADMIN_PASS = "dilmurod2010";

const CASES_DATA: CaseItem[] = [
  { id: 0, name: 'Tekin Keys', price: 0, icon: '🎁', color: 'from-[#34C759] to-[#248A3D]', isFree: true },
  { id: 1, name: 'Ajdaho', price: 20, icon: '🐉', color: 'from-[#FF3B30] to-[#C42B24]' },
  { id: 2, name: 'Sher', price: 40, icon: '🦁', color: 'from-[#FF9500] to-[#D67D00]' },
  { id: 3, name: 'Lambo', price: 100, icon: '🏎️', color: 'from-[#007AFF] to-[#005BBF]' },
  { id: 4, name: 'Tilla', price: 50, icon: '💰', color: 'from-[#FFCC00] to-[#B28E00]' },
  { id: 5, name: 'Qirol', price: 1000, icon: '👑', color: 'from-[#AF52DE] to-[#7D3AA1]' },
  { id: 6, name: 'Imperator', price: 5000, icon: '🏰', color: 'from-[#1C1C1E] to-[#000000]' },
  { id: 7, name: 'Muzlik', price: 300, icon: '❄️', color: 'from-[#5AC8FA] to-[#4091B3]' },
  { id: 8, name: 'Samuray', price: 250, icon: '👺', color: 'from-[#FF2D55] to-[#B31F3B]' },
  { id: 9, name: 'Kosmos', price: 800, icon: '🛸', color: 'from-[#5856D6] to-[#3E3D96]' }
];

const COIN_PACKS = [
  { amount: 500, price: "10 000 so'm" },
  { amount: 1500, price: "25 000 so'm" },
  { amount: 5000, price: "75 000 so'm" },
  { amount: 12000, price: "150 000 so'm" }
];

const UC_PACKS = [
  { uc: 60, cost: 500 },
  { uc: 325, cost: 2500 },
  { uc: 660, cost: 5000 },
  { uc: 1800, cost: 13000 }
];

const Logo = () => (
  <span className="font-extrabold text-white text-2xl tracking-tight">
    DILERO<span className="text-[#34C759]">P</span><span className="text-[#32D74B]">uz</span>
  </span>
);

const App = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [view, setView] = useState<'home' | 'chat' | 'profile' | 'shop' | 'admin'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<number[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [newPromo, setNewPromo] = useState('');
  const [newPromoAmount, setNewPromoAmount] = useState(100);

  const isActualAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setUser(snap.data() as UserData);
          } else if (firebaseUser.email === ADMIN_EMAIL) {
            const adminData: UserData = {
              id: firebaseUser.uid,
              email: ADMIN_EMAIL,
              nickname: "Admin",
              balance: 999999,
              winProbability: 100
            };
            setUser(adminData);
            setDoc(doc(db, "users", firebaseUser.uid), adminData);
          }
        });
      } else {
        setUser(null);
      }
    });

    const unsubChat = onSnapshot(query(collection(db, "messages"), orderBy("timestamp", "asc"), limit(50)), (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    const unsubAllUsers = onSnapshot(collection(db, "users"), (snap) => {
      setAllUsers(snap.docs.map(d => ({ ...d.data(), id: d.id } as UserData)));
    });

    return () => {
      unsubAuth();
      unsubChat();
      unsubAllUsers();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    try {
      await signInWithEmailAndPassword(auth, (data.get('email') as string).trim().toLowerCase(), data.get('password') as string);
    } catch { alert("Xato!"); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    try {
      const res = await createUserWithEmailAndPassword(auth, data.get('email') as string, data.get('password') as string);
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        email: data.get('email'),
        nickname: data.get('nickname'),
        balance: 10,
        winProbability: 50
      });
    } catch (err: any) { alert(err.message); }
  };

  const handleSpin = async () => {
    if (!activeCase || isSpinning || !user) return;
    if (activeCase.isFree) {
        const diff = Date.now() - (user.lastFreeCase || 0);
        if (diff < 86400000) return alert("Hali vaqt bor!");
    }
    if (!activeCase.isFree && user.balance < activeCase.price) return alert("Yetarli emas!");

    setIsSpinning(true);
    const prob = user.winProbability || 50;
    const items = Array.from({ length: 60 }, () => {
        if(activeCase.isFree) return Math.floor(Math.random() * 15) + 1;
        const isWin = (Math.random() * 100 < prob);
        return isWin ? Math.floor(activeCase.price * (1.2 + Math.random())) : Math.floor(activeCase.price * 0.2);
    });
    setRouletteItems(items);

    setTimeout(async () => {
      const result = items[54];
      await updateDoc(doc(db, "users", user.id), {
        balance: increment(-(activeCase.isFree ? 0 : activeCase.price) + result),
        lastFreeCase: activeCase.isFree ? Date.now() : (user.lastFreeCase || 0)
      });
      setIsSpinning(false);
      alert(`${result} tushdi!`);
      setActiveCase(null);
      setRouletteItems([]);
    }, 4000);
  };

  const usePromo = async () => {
    if (!promoInput.trim() || !user) return;
    const promoRef = doc(db, "promos", promoInput.toUpperCase());
    const promoSnap = await getDoc(promoRef);
    
    if (promoSnap.exists()) {
      const data = promoSnap.data();
      const usedBy = data.usedBy || [];
      if (usedBy.includes(user.id)) return alert("Siz bu promo-koddan foydalangansiz!");
      
      await updateDoc(doc(db, "users", user.id), { balance: increment(data.amount) });
      await updateDoc(promoRef, { usedBy: [...usedBy, user.id] });
      alert(`${data.amount} Coin qo'shildi!`);
      setPromoInput('');
    } else {
      alert("Bunday promo-kod mavjud emas!");
    }
  };

  const createPromo = async () => {
    if (!newPromo.trim() || !isActualAdmin) return;
    await setDoc(doc(db, "promos", newPromo.toUpperCase()), {
      code: newPromo.toUpperCase(),
      amount: newPromoAmount,
      usedBy: []
    });
    alert("Yangi promo-kod yaratildi!");
    setNewPromo('');
  };

  const sendMessage = async (text: string) => {
    if(!text.trim() || !user) return;
    await addDoc(collection(db, "messages"), { userId: user.id, nickname: user.nickname, text, isAdmin: isActualAdmin, timestamp: Date.now() });
  };

  const goToTelegram = () => window.open("https://t.me/dilmurodw", "_blank");
  const goToChannel = () => window.open("https://t.me/DILEROPuz", "_blank");

  if (!user) return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center p-6">
      <div className="ios-card glass p-10 w-full max-w-sm text-center">
        <Logo />
        <div className="mt-8 space-y-4">
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input name="email" required placeholder="Email" className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10 focus:border-[#007AFF]"/>
              <input name="password" type="password" required placeholder="Parol" className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10 focus:border-[#007AFF]"/>
              <button className="w-full bg-[#007AFF] text-white py-4 rounded-2xl font-bold">Kirish</button>
              <button type="button" onClick={() => setAuthMode('register')} className="text-gray-400 text-xs">Hisob ochish</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <input name="nickname" required placeholder="Nickname" className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10 focus:border-[#007AFF]"/>
              <input name="email" required placeholder="Email" className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10 focus:border-[#007AFF]"/>
              <input name="password" type="password" required placeholder="Parol" className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10 focus:border-[#007AFF]"/>
              <button className="w-full bg-[#34C759] text-white py-4 rounded-2xl font-bold">Ro'yxatdan o'tish</button>
              <button type="button" onClick={() => setAuthMode('login')} className="text-gray-400 text-xs">Kirishga qaytish</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const filteredUsers = allUsers.filter(u => u.nickname?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#000814] flex flex-col max-w-2xl mx-auto border-x border-white/5 relative">
      <nav className="glass sticky top-0 z-50 p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <Logo />
          <button onClick={goToChannel} className="text-[10px] text-[#007AFF] font-bold mt-1 text-left">TELEGRAM KANAL <i className="fab fa-telegram ml-1"></i></button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-[#FFD60A]">{user.balance.toLocaleString()} 💰</div>
          <div onClick={() => setView('profile')} className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center font-bold text-white cursor-pointer shadow-lg">
            {user.nickname?.[0]?.toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="flex-grow p-5 z-10 pb-20 no-scrollbar">
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {['home', 'chat', 'shop', 'profile', ...(isActualAdmin ? ['admin'] : [])].map(v => (
            <button key={v} onClick={() => setView(v as any)} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase transition-all ${view === v ? 'bg-[#007AFF] text-white' : 'bg-white/10 text-gray-400'}`}>
              {v === 'home' ? 'Keyslar' : v === 'chat' ? 'Chat' : v === 'shop' ? 'Do\'kon' : v === 'admin' ? 'Boshqaruv' : 'Profil'}
            </button>
          ))}
        </div>

        {view === 'home' && (
          <div className="grid grid-cols-2 gap-4">
            {CASES_DATA.map(c => (
              <div key={c.id} onClick={() => setActiveCase(c)} className={`ios-card p-6 text-center bg-gradient-to-b ${c.color} border border-white/10 active:scale-95 transition-all cursor-pointer`}>
                <div className="text-5xl mb-3">{c.icon}</div>
                <div className="text-[10px] font-bold opacity-70 uppercase mb-1">{c.name}</div>
                <div className="font-bold text-sm">{c.isFree ? 'TEKIN' : `${c.price} 💰`}</div>
              </div>
            ))}
          </div>
        )}

        {view === 'chat' && (
          <div className="flex flex-col h-[500px]">
            <div className="flex-grow overflow-y-auto space-y-4 mb-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.userId === user.id ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl text-sm ${m.isAdmin ? 'bg-[#FF3B30] text-white' : (m.userId === user.id ? 'bg-[#007AFF] text-white' : 'bg-white/10 text-white')}`}>
                        {m.text}
                    </div>
                    <span className="text-[8px] opacity-30 mt-1 uppercase font-bold">{m.nickname}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-3 bg-white/5 rounded-full">
              <input id="chat-input" placeholder="Xabar..." className="flex-grow bg-transparent px-4 outline-none text-sm text-white"/>
              <button onClick={() => { const i = document.getElementById('chat-input') as any; sendMessage(i.value); i.value=''; }} className="bg-[#007AFF] w-10 h-10 rounded-full flex items-center justify-center"><i className="fas fa-arrow-up text-white"></i></button>
            </div>
          </div>
        )}

        {view === 'shop' && (
          <div className="space-y-8 pb-10">
            <div className="ios-card glass p-6 border border-[#007AFF]/20">
              <h2 className="text-[#007AFF] font-bold text-xs uppercase mb-3">Promo-kod kiritish</h2>
              <div className="flex gap-2">
                <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="PROMO-KOD" className="flex-grow bg-white/5 p-3 rounded-xl outline-none text-white text-sm border border-white/10"/>
                <button onClick={usePromo} className="bg-[#007AFF] px-6 rounded-xl font-bold text-xs text-white uppercase">OK</button>
              </div>
            </div>

            <h2 className="text-[#FFD60A] font-bold text-sm uppercase">Coin sotib olish</h2>
            <div className="grid grid-cols-2 gap-4">
              {COIN_PACKS.map(p => (
                <div key={p.amount} onClick={goToTelegram} className="ios-card glass p-6 text-center border border-white/5 active:scale-95 cursor-pointer">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-bold text-white text-lg">{p.amount.toLocaleString()}</div>
                  <div className="text-[9px] text-[#34C759] font-bold">{p.price}</div>
                </div>
              ))}
            </div>

            <h2 className="text-[#5AC8FA] font-bold text-sm uppercase">PUBG UC</h2>
            <div className="space-y-3">
              {UC_PACKS.map(u => (
                <div key={u.uc} onClick={goToTelegram} className="ios-card glass p-5 flex justify-between items-center active:scale-95 cursor-pointer">
                  <div className="font-bold text-white">{u.uc} UC</div>
                  <div className="bg-[#007AFF] px-4 py-2 rounded-xl text-[10px] font-bold">{u.cost} Coin</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && isActualAdmin && (
            <div className="space-y-6">
                <div className="ios-card glass p-6 border border-[#34C759]/20">
                  <h2 className="text-[#34C759] font-bold text-xs uppercase mb-3">Yangi Promo-kod Yaratish</h2>
                  <div className="flex gap-2 mb-2">
                    <input value={newPromo} onChange={e => setNewPromo(e.target.value)} placeholder="KOD NOMI" className="flex-grow bg-white/5 p-3 rounded-xl outline-none text-white text-sm border border-white/10"/>
                    <input type="number" value={newPromoAmount} onChange={e => setNewPromoAmount(Number(e.target.value))} placeholder="Coin miqdori" className="w-24 bg-white/5 p-3 rounded-xl outline-none text-white text-sm border border-white/10"/>
                  </div>
                  <button onClick={createPromo} className="w-full bg-[#34C759] py-3 rounded-xl font-bold text-xs text-white uppercase">YARATISH</button>
                </div>

                <input placeholder="Foydalanuvchi qidirish..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10"/>
                <div className="space-y-3">
                    {filteredUsers.map(u => (
                        <div key={u.id} className="ios-card glass p-4 border border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div><p className="font-bold text-white text-sm">{u.nickname}</p><p className="text-[9px] text-gray-500 uppercase">{u.email}</p></div>
                                <div className="text-right"><p className="text-sm font-bold text-[#FFD60A]">{u.balance} 💰</p><p className="text-[10px] text-[#34C759]">Shans: {u.winProbability}%</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => updateDoc(doc(db,"users",u.id),{balance:increment(100)})} className="flex-1 bg-white/5 py-2 rounded-xl text-[10px] font-bold border border-white/5">+100</button>
                                <button onClick={() => updateDoc(doc(db,"users",u.id),{winProbability:increment(5)})} className="flex-1 bg-white/5 py-2 rounded-xl text-[10px] font-bold border border-white/5">+5%</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {view === 'profile' && user && (
          <div className="ios-card glass p-10 text-center">
              <div className="w-24 h-24 bg-[#007AFF] rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white">{user.nickname?.[0]?.toUpperCase()}</div>
              <h2 className="text-3xl font-bold mb-8">{user.nickname}</h2>
              <div className="bg-white/5 p-6 rounded-3xl mb-8">
                  <p className="text-[10px] opacity-40 uppercase font-bold mb-1">Balans</p>
                  <p className="text-4xl font-bold text-[#FFD60A]">{user.balance?.toLocaleString() || 0} 💰</p>
              </div>
              <button onClick={() => signOut(auth)} className="w-full bg-[#FF3B30] py-4 rounded-2xl font-bold">Chiqish</button>
          </div>
        )}
      </main>

      {activeCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
           <div className="ios-card glass p-8 w-full max-w-xs text-center border-white/20">
              {!isSpinning && !rouletteItems.length ? (
                <>
                  <div className="text-8xl mb-6">{activeCase.icon}</div>
                  <h2 className="text-2xl font-bold mb-6">{activeCase.name}</h2>
                  <button onClick={handleSpin} className="w-full bg-[#007AFF] text-white py-5 rounded-2xl font-bold">
                    OCHISH: {activeCase.isFree ? 'TEKIN' : activeCase.price + ' 💰'}
                  </button>
                  <button onClick={() => setActiveCase(null)} className="mt-4 text-xs text-gray-500 font-bold uppercase">Yopish</button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <h3 className="text-[#FFD60A] font-bold mb-8 animate-pulse italic">AYLANMOQDA...</h3>
                  <div className="w-full relative h-24 overflow-hidden flex items-center bg-white/5 rounded-2xl">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#FF3B30] z-50"></div>
                    <div className="flex animate-spin-custom items-center h-full">
                      {rouletteItems.map((v, i) => (
                        <div key={i} className="min-w-[80px] h-full flex flex-col items-center justify-center font-bold text-[#FFD60A] border-r border-white/5">
                          <span className="text-xl">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
