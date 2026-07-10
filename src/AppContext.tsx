import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Banner, SettingQRIS } from './types';
import { db } from './lib/db';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextType {
  products: Product[];
  orders: Order[];
  banners: Banner[];
  settings: SettingQRIS;
  currentAdmin: string | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SettingQRIS>({
    kode_qris_static: '',
    url_gambar_qris: '',
    wa_number: '',
  });
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    const [p, o, b, s] = await Promise.all([
      db.products.getAll(),
      db.orders.getAll(),
      db.banners.getAll(),
      db.settings.getQRIS(),
    ]);
    setProducts(p);
    setOrders(o);
    setBanners(b);
    setSettings(s);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();

    const unsubscribe = auth
      ? onAuthStateChanged(auth, (user) => {
          setCurrentAdmin(user ? user.email : null);
          if (user) refreshData();
        })
      : () => {};

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{ products, orders, banners, settings, currentAdmin, isLoading, refreshData }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
