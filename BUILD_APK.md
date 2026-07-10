# Build APK — Admin Toko QRIS

Project ini sudah disiapkan dengan **Capacitor**, yaitu tool yang membungkus
web app (React/Vite) jadi app Android asli. Karena build APK butuh Android
SDK + Gradle (tidak bisa dijalankan di sandbox chat ini), langkah build harus
dilakukan di komputer kamu sendiri. Ikuti langkah ini:

## Yang perlu diinstall dulu (sekali saja)

1. **Node.js** (v18 ke atas) — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
   (saat instalasi, biarkan default termasuk Android SDK & Emulator)
3. Buka Android Studio sekali, biar SDK-nya kedownload otomatis.

## Langkah build APK

Buka terminal di folder project ini, lalu jalankan urut:

```bash
# 1. Install semua dependency (termasuk Capacitor)
npm install

# 2. Build web app-nya jadi folder dist/
npm run build

# 3. Tambahkan platform Android (cuma sekali, bikin folder android/)
npx cap add android

# 4. Sync hasil build ke project Android
npx cap sync android

# 5. Buka project Android-nya di Android Studio
npx cap open android
```

Setelah Android Studio terbuka:

1. Tunggu proses "Gradle Sync" selesai (bisa beberapa menit di awal).
2. Klik menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Setelah selesai, klik notifikasi "locate" atau cari file APK di:
   `android/app/build/outputs/apk/debug/app-debug.apk`
4. File `.apk` itu yang bisa kamu install langsung ke HP Android
   (aktifkan dulu "Install from unknown sources" di HP).

## Kalau mau update tampilan/kode nanti

Setiap kali kamu ubah kode di `src/`, ulangi dari langkah 2:

```bash
npm run build
npx cap sync android
npx cap open android
```

lalu build ulang APK-nya di Android Studio.

## Kalau mau APK untuk dibagikan/publish (rilis, bukan debug)

APK debug di atas cukup untuk testing/install manual. Untuk rilis ke Play
Store atau dibagikan resmi, perlu di-sign:

1. Di Android Studio: **Build > Generate Signed Bundle / APK**
2. Pilih **APK**, buat *keystore* baru (simpan file & password-nya baik-baik,
   karena dibutuhkan lagi setiap update app).
3. Pilih build type **release**, lalu Finish.

## Catatan penting

- Project ini adalah **Admin Dashboard**, isinya login + kelola produk/order.
  Pastikan `.env` sudah diisi config Firebase project **toko-qris** sebelum
  `npm run build` (lihat `.env.example`), supaya app di HP bisa login & baca data.
- Karena app Android ini murni WebView yang memuat file lokal (folder `dist/`),
  koneksi internet HP tetap diperlukan untuk hubungi Firebase.
- Kalau tidak mau install Android Studio, alternatif lain: pakai layanan
  cloud build seperti **Ionic Appflow** atau **GitHub Actions** dengan
  `android-actions/setup-android`, tapi itu perlu setup CI terpisah.
