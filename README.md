# Admin — Toko Game QRIS

Dashboard internal untuk mengelola toko. Terhubung ke Firestore
project **toko-qris** yang sama dengan app PWA-Kasir, jadi order
yang masuk dari Kasir langsung terlihat di sini.

## Fitur
- Login admin (Firebase Auth — Email/Password)
- CRUD produk (tambah/hapus, atur nominal & harga)
- Upload gambar QRIS & atur nomor WhatsApp
- Kelola banner promo
- Lihat laporan order & tandai status "Lunas"

**Tidak ada** halaman publik/katalog produk di project ini — murni dashboard admin.

## Setup

1. `npm install`
2. Salin `.env.example` jadi `.env`, isi dengan config Firebase project **toko-qris**
   — HARUS SAMA PERSIS dengan yang dipakai di project PWA-Kasir.
3. Buat akun admin lewat Firebase Console > Authentication > Users > Add user
   (Email/Password), karena project ini tidak punya form "daftar admin baru".
4. `npm run dev` untuk coba lokal.

## Deploy ke Netlify

1. Push folder ini ke repo Git terpisah dari project Kasir, atau drag-drop ke Netlify.
   Sebaiknya pakai subdomain berbeda, misal `admin-tokogame.netlify.app`, dan JANGAN
   diberi tahu ke publik / jangan di-link dari app Kasir.
2. Build command: `npm run build`, publish directory: `dist` (sudah diatur di `netlify.toml`).
3. Di Netlify: **Site settings > Environment variables**, tambahkan semua variabel
   dari `.env.example` dengan nilai project `toko-qris` (sama seperti di project Kasir).
4. Deploy.

## Firestore Rules

Terapkan `../firestore.rules` di Firebase Console > Firestore Database > Rules
supaya hanya admin yang login yang bisa ubah produk/QRIS/order.
