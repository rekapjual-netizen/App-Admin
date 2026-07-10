export type Category = 'TOP UP' | 'VOUCHER GAME' | 'PULSA';
export type OrderStatus = 'Menunggu' | 'Lunas';

export interface Nominal {
  nama: string;
  harga: number;
}

export interface Product {
  id: string;
  nama_game: string;
  kategori: Category;
  url_gambar: string;
  nominal_list: Nominal[];
  is_popular?: boolean;
  popular_rank?: number;
}

export interface Order {
  id: string;
  nama_game: string;
  nominal: string;
  id_game: string;
  wa: string;
  total: number;
  status: OrderStatus;
  tanggal: string;
}

export interface Banner {
  id: string;
  url_gambar: string;
}

export interface SettingQRIS {
  kode_qris_static?: string;
  url_gambar_qris: string;
  wa_number: string;
}
