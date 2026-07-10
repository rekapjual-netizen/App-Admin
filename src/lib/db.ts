// Data layer backed by Firebase Firestore (project: toko-qris).
// Both the Kasir (PWA) app and the Admin app read/write the SAME
// Firestore collections, so this file must stay identical in both projects.
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db as firestore } from './firebase';
import { Product, Order, Banner, SettingQRIS } from '../types';

const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  BANNERS: 'banners',
  SETTINGS: 'settings',
};

const SETTINGS_DOC_ID = 'qris';

const EMPTY_SETTINGS: SettingQRIS = {
  kode_qris_static: '',
  url_gambar_qris: '',
  wa_number: '',
};

function requireDb() {
  if (!firestore) {
    console.warn('Firestore belum terkonfigurasi. Cek variabel VITE_FIREBASE_* di .env');
    return null;
  }
  return firestore;
}

export const db = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const fs = requireDb();
      if (!fs) return [];
      const snap = await getDocs(collection(fs, COLLECTIONS.PRODUCTS));
      return snap.docs.map((d) => ({ ...(d.data() as Omit<Product, 'id'>), id: d.id }));
    },
    add: async (product: Product) => {
      const fs = requireDb();
      if (!fs) return;
      const { id, ...rest } = product;
      await addDoc(collection(fs, COLLECTIONS.PRODUCTS), rest);
    },
    update: async (product: Product) => {
      const fs = requireDb();
      if (!fs || !product.id) return;
      const { id, ...rest } = product;
      await updateDoc(doc(fs, COLLECTIONS.PRODUCTS, id), rest as Record<string, unknown>);
    },
    delete: async (id: string) => {
      const fs = requireDb();
      if (!fs) return;
      await deleteDoc(doc(fs, COLLECTIONS.PRODUCTS, id));
    },
  },
  orders: {
    getAll: async (): Promise<Order[]> => {
      const fs = requireDb();
      if (!fs) return [];
      const snap = await getDocs(collection(fs, COLLECTIONS.ORDERS));
      return snap.docs
        .map((d) => ({ ...(d.data() as Omit<Order, 'id'>), id: d.id }))
        .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    },
    getById: async (id: string): Promise<Order | null> => {
      const fs = requireDb();
      if (!fs) return null;
      const snap = await getDoc(doc(fs, COLLECTIONS.ORDERS, id));
      return snap.exists() ? ({ ...(snap.data() as Omit<Order, 'id'>), id: snap.id }) : null;
    },
    add: async (order: Order) => {
      const fs = requireDb();
      if (!fs) return;
      const { id, ...rest } = order;
      // Use setDoc with the client-generated id so the Kasir app can
      // navigate straight to /checkout/:id without waiting on a round-trip.
      await setDoc(doc(fs, COLLECTIONS.ORDERS, id), rest);
    },
    updateStatus: async (id: string, status: 'Menunggu' | 'Lunas') => {
      const fs = requireDb();
      if (!fs) return;
      await updateDoc(doc(fs, COLLECTIONS.ORDERS, id), { status });
    },
  },
  banners: {
    getAll: async (): Promise<Banner[]> => {
      const fs = requireDb();
      if (!fs) return [];
      const snap = await getDocs(collection(fs, COLLECTIONS.BANNERS));
      return snap.docs.map((d) => ({ id: d.id, url_gambar: (d.data() as any).url_gambar }));
    },
    add: async (url: string) => {
      const fs = requireDb();
      if (!fs) return;
      await addDoc(collection(fs, COLLECTIONS.BANNERS), { url_gambar: url });
    },
    delete: async (id: string) => {
      const fs = requireDb();
      if (!fs) return;
      await deleteDoc(doc(fs, COLLECTIONS.BANNERS, id));
    },
  },
  settings: {
    getQRIS: async (): Promise<SettingQRIS> => {
      const fs = requireDb();
      if (!fs) return EMPTY_SETTINGS;
      const snap = await getDoc(doc(fs, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID));
      return snap.exists() ? (snap.data() as SettingQRIS) : EMPTY_SETTINGS;
    },
    saveQRIS: async (data: SettingQRIS) => {
      const fs = requireDb();
      if (!fs) return;
      await setDoc(doc(fs, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID), data);
    },
  },
};
