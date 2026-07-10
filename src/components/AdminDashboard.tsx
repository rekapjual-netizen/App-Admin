import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { db } from '../lib/db';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { LayoutDashboard, Gamepad2, Image as ImageIcon, Settings, LogOut, Plus, Trash2, CheckCircle, Clock, Upload } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Category, Product, SettingQRIS } from '../types';

function ImageUpload({ 
  value, 
  onChange, 
  label, 
  height = '100px', 
  width = '100px',
  buttonLabel = 'PILIH GAMBAR',
  clickable = false
}: { 
  value: string; 
  onChange: (base64: string) => void; 
  label: string;
  height?: string;
  width?: string;
  buttonLabel?: string;
  clickable?: boolean;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (clickable) {
    return (
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-text uppercase tracking-widest ml-1">{label}</label>
        <label className="block cursor-pointer group">
          <div 
            className="w-full border border-accent-green/30 hover:border-accent-green rounded-lg bg-bg-main overflow-hidden flex flex-col items-center justify-center transition-all group-hover:bg-accent-green/5"
            style={{ height }}
          >
            {value ? (
              <img src={value} className="w-full h-full object-contain" alt="QRIS" />
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <Upload size={32} className="text-accent-green" />
                <span className="text-[11px] font-bold text-accent-green uppercase tracking-widest">Klik untuk pilih gambar QRIS</span>
              </div>
            )}
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-text uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-center gap-4">
        <div 
          className="border border-accent-green/30 rounded-lg bg-bg-main overflow-hidden flex items-center justify-center shrink-0"
          style={{ width, height }}
        >
          {value ? (
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <ImageIcon className="text-slate-text opacity-30" size={width === '100%' ? 40 : 24} />
          )}
        </div>
        <label className="h-10 px-4 bg-accent-green text-bg-main font-bold rounded-lg text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-green/10">
          <Upload size={16} />
          {buttonLabel}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { products, orders, banners, settings, currentAdmin, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PRODUK' | 'BANNER' | 'SETTINGS'>('DASHBOARD');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#1A1A1A] rounded-lg p-4 border border-accent-green/20 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-accent-green/10 rounded-lg flex items-center justify-center mx-auto mb-3 border border-accent-green/30">
              <Settings size={28} className="text-accent-green" />
            </div>
            <h1 className="text-[18px] font-black text-white uppercase italic tracking-tighter">ADMIN <span className="text-accent-green">ACCESS</span></h1>
            <p className="text-slate-text text-[11px] mt-1 uppercase font-bold tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-text uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="Email Admin"
                className="w-full bg-bg-main border border-white/5 rounded-lg px-3 h-[42px] text-[13px] font-bold text-white focus:outline-none focus:border-accent-green transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-text uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-bg-main border border-white/5 rounded-lg px-3 h-[42px] text-[13px] font-bold text-white focus:outline-none focus:border-accent-green transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              onClick={async () => {
                if (!email || !password) return alert('Email dan Password harus diisi!');
                if (!auth) return alert('Firebase belum dikonfigurasi. Silakan hubungi developer.');
                setIsLoading(true);
                try {
                  await signInWithEmailAndPassword(auth, email, password);
                  refreshData();
                } catch (error: any) {
                  alert('Login Gagal: ' + (error.message || 'Cek kembali email & password'));
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full h-[42px] bg-accent-green text-black font-black rounded-lg shadow-lg shadow-accent-green/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-[13px] mt-2 disabled:opacity-50"
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOG IN SYSTEM'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const revenue = orders
    .filter(o => o.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar Desktop / Bottom Nav Admin Mobile */}
      <nav className="md:w-64 bg-card-main border-r md:border-white/5 fixed bottom-0 md:static left-0 right-0 z-50 flex md:flex-col justify-around md:justify-start p-3 gap-2 border-t md:border-t-0 shadow-2xl">
        <div className="hidden md:block p-4 mb-4">
          <h1 className="font-black text-white text-[16px]">ADMIN <span className="text-accent-green">DASHBOARD</span></h1>
        </div>
        { [
          { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Beranda' },
          { id: 'PRODUK', icon: Gamepad2, label: 'Produk' },
          { id: 'BANNER', icon: ImageIcon, label: 'Banner' },
          { id: 'SETTINGS', icon: Settings, label: 'Settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg transition-all",
              activeTab === item.id ? "bg-accent-green text-bg-main font-bold" : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={18} />
            <span className="hidden md:block text-[13px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-3 overflow-y-auto">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold text-white uppercase tracking-tight ml-1">RINGKASAN</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-accent-green/5 border border-accent-green/30 rounded-lg p-3">
                <p className="text-[9px] font-bold text-accent-green uppercase tracking-widest">Omzet</p>
                <h2 className="text-[16px] font-black text-white mt-1">{formatCurrency(revenue)}</h2>
              </div>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-3">
                <p className="text-[9px] font-bold text-slate-text uppercase tracking-widest">Order</p>
                <h2 className="text-[16px] font-black text-white mt-1">{orders.length}</h2>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-white/5">
                <h3 className="font-bold text-white uppercase text-[10px] tracking-widest">Order Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[9px] font-bold text-slate-text uppercase">
                      <th className="px-3 py-2 font-normal">Game</th>
                      <th className="px-3 py-2 font-normal">Item</th>
                      <th className="px-3 py-2 font-normal">ID</th>
                      <th className="px-3 py-2 font-normal">Total</th>
                      <th className="px-3 py-2 font-normal">Status</th>
                      <th className="px-3 py-2 font-normal">Cek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o.id} className="text-[10px] text-white">
                        <td className="px-3 py-2 truncate max-w-[80px]">{o.nama_game}</td>
                        <td className="px-3 py-2 truncate max-w-[80px]">{o.nominal}</td>
                        <td className="px-3 py-2 truncate max-w-[60px]">{o.id_game}</td>
                        <td className="px-3 py-2 font-bold text-accent-green">{formatCurrency(o.total)}</td>
                        <td className="px-3 py-2">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                            o.status === 'Lunas' ? "bg-accent-green/10 text-accent-green" : "bg-yellow-500/10 text-yellow-500"
                          )}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {o.status === 'Menunggu' && (
                            <button
                              onClick={async () => { await db.orders.updateStatus(o.id, 'Lunas'); refreshData(); }}
                              className="p-1 bg-accent-green text-bg-main rounded hover:scale-110 transition-transform"
                            >
                              <CheckCircle size={12} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PRODUK' && <ProductManager />}
        {activeTab === 'BANNER' && <BannerManager />}
        {activeTab === 'SETTINGS' && <SettingsManager />}
      </main>
    </div>
  );
}

function ProductManager() {
  const { products, refreshData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    nama_game: '',
    kategori: 'TOP UP' as Category,
    url_gambar: '',
    is_popular: false,
    popular_rank: 0,
    nominal_list: [{ nama: '', harga: 0 }]
  });

  const handleAddNominal = () => {
    setForm({ ...form, nominal_list: [...form.nominal_list, { nama: '', harga: 0 }] });
  };

  const handleSave = async () => {
    if (!form.nama_game) return;
    await db.products.add({ ...form, id: crypto.randomUUID() } as Product);
    refreshData();
    setIsAdding(false);
    setForm({ nama_game: '', kategori: 'TOP UP' as Category, url_gambar: '', is_popular: false, popular_rank: 0, nominal_list: [{ nama: '', harga: 0 }] });
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[16px] font-bold text-white uppercase tracking-tight">KELOLA PRODUK</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 h-10 px-4 bg-accent-green text-bg-main font-bold rounded-lg text-[13px] w-auto"
        >
          <Plus size={16} />
          {isAdding ? 'BATAL' : 'PRODUK'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-[10px] space-y-2 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Nama Game"
              className="bg-bg-main border border-white/5 rounded-lg px-3 h-[42px] text-[13px] text-white focus:outline-none focus:border-accent-green"
              value={form.nama_game}
              onChange={(e) => setForm({...form, nama_game: e.target.value})}
            />
            <select
              className="bg-bg-main border border-white/5 rounded-lg px-2 h-[42px] text-[13px] text-white focus:outline-none focus:border-accent-green"
              value={form.kategori}
              onChange={(e) => setForm({...form, kategori: e.target.value as any})}
            >
              <option value="TOP UP">TOP UP</option>
              <option value="VOUCHER GAME">VOUCHER</option>
              <option value="PULSA">PULSA</option>
            </select>
          </div>
          <ImageUpload 
            label="GAMBAR PRODUK" 
            value={form.url_gambar} 
            onChange={(val) => setForm({...form, url_gambar: val})}
            width="100px"
            height="100px"
            clickable={true}
          />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-3 h-3 accent-accent-green scale-[0.8]" 
                checked={form.is_popular} 
                onChange={(e) => setForm({...form, is_popular: e.target.checked})} 
              />
              <span className="text-[11px] opacity-70">Produk Populer</span>
            </label>
            {form.is_popular && (
              <input
                type="number"
                placeholder="Rank"
                className="bg-bg-main border border-white/5 rounded-lg px-2 h-[30px] text-[11px] text-white w-16 focus:outline-none focus:border-accent-green"
                value={form.popular_rank}
                onChange={(e) => setForm({...form, popular_rank: parseInt(e.target.value)})}
              />
            )}
          </div>

          <div className="pt-1">
            <p className="text-[11px] font-bold text-slate-text uppercase mt-1 mb-1.5">DAFTAR NOMINAL & HARGA</p>
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-hide">
              {form.nominal_list.map((nom, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Nama Nominal"
                    className="flex-1 bg-bg-main border border-white/5 rounded-lg px-2 h-[38px] text-[12px] text-white"
                    value={nom.nama}
                    onChange={(e) => {
                      const newList = [...form.nominal_list];
                      newList[i].nama = e.target.value;
                      setForm({...form, nominal_list: newList});
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    className="w-[100px] bg-bg-main border border-white/5 rounded-lg px-2 h-[38px] text-[12px] text-white"
                    value={nom.harga}
                    onChange={(e) => {
                      const newList = [...form.nominal_list];
                      newList[i].harga = parseInt(e.target.value);
                      setForm({...form, nominal_list: newList});
                    }}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleAddNominal} className="text-[11px] text-accent-green font-bold mt-2 uppercase">+ TAMBAH NOMINAL</button>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={handleSave}
              className="h-10 px-4 bg-accent-green text-bg-main font-bold rounded-lg text-[13px] w-auto shadow-lg shadow-accent-green/20"
            >
              SIMPAN PRODUK
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {products.map((p) => (
          <div key={p.id} className="bg-[#1A1A1A] rounded-lg p-2 flex items-center gap-3 border border-white/5">
            <img src={p.url_gambar} className="w-10 h-10 rounded-md object-cover bg-bg-main" alt="" />
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-white truncate uppercase">{p.nama_game}</h4>
              <p className="text-[10px] text-slate-text uppercase">{p.kategori} • {p.nominal_list.length} Item</p>
            </div>
            <button 
              onClick={async () => { await db.products.delete(p.id!); refreshData(); }}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerManager() {
  const { banners, refreshData } = useApp();
  const [url, setUrl] = useState('');

  const handleAdd = async () => {
    if (!url) return;
    await db.banners.add(url);
    refreshData();
    setUrl('');
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-[16px] font-bold text-white uppercase tracking-tight">KELOLA BANNER</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-4 space-y-3">
        <ImageUpload 
          label="BANNER BARU" 
          value={url} 
          onChange={(val) => setUrl(val)}
          width="100%"
          height="120px"
          clickable={true}
        />
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={handleAdd} 
            className="h-[42px] px-6 bg-accent-green text-bg-main font-bold rounded-lg text-[13px] w-auto shadow-lg shadow-accent-green/20"
          >
            SIMPAN BANNER
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {banners.map((b) => (
          <div key={b.id} className="relative group rounded-lg overflow-hidden h-32 border border-white/5">
            <img src={b.url_gambar} className="w-full h-full object-cover" />
            <button
              onClick={async () => { await db.banners.delete(b.id); refreshData(); }}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsManager() {
  const { settings, refreshData } = useApp();
  const [form, setForm] = useState(settings);

  const handleSave = async () => {
    await db.settings.saveQRIS(form);
    refreshData();
    alert('Settings disimpan');
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-[16px] font-bold text-white uppercase tracking-tight">SETTINGS QRIS</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-text uppercase tracking-widest ml-1">NOMOR WHATSAPP ADMIN</label>
          <input
            placeholder="628123456789"
            className="w-full h-[42px] bg-bg-main border border-white/5 rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent-green"
            value={form.wa_number}
            onChange={(e) => setForm({...form, wa_number: e.target.value})}
          />
        </div>
        <ImageUpload 
          label="GAMBAR QRIS" 
          value={form.url_gambar_qris} 
          onChange={(val) => setForm({...form, url_gambar_qris: val})}
          height="200px"
          clickable={true}
        />
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="h-[42px] flex-1 bg-accent-green text-bg-main font-bold rounded-lg text-[13px] shadow-lg shadow-accent-green/20"
          >
            SIMPAN SETTINGS
          </button>
          <button
            onClick={async () => {
              if (!auth) return;
              try {
                await signOut(auth);
                refreshData();
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            className="h-[42px] flex-1 bg-[#FF3333] text-white font-bold rounded-lg text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
