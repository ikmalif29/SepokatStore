# 👟 Sepokat Store

Selamat datang di **Sepokat Store**, sebuah website e-commerce modern yang menyediakan berbagai **sepatu**, **baju**, dan **aksesoris** fashion kekinian. Website ini dibuat dengan tujuan untuk memberikan pengalaman berbelanja online yang mudah, cepat, dan aman.

---

## 🔗 Live Preview
> [Kunjungi Website Sepokat Store](#) *(Tambahkan link deploy di sini jika sudah tersedia)*

---

## 📦 Fitur Website

### 👤 Untuk Pengguna (User)
Website ini dirancang untuk memberikan pengalaman belanja yang menyenangkan dan interaktif:

#### 🏠 Homepage
- Menampilkan produk unggulan dan terbaru.
- Navigasi cepat ke halaman lain (Product, About, Profile, Cart).
- Tersedia fitur search dan cart icon yang dinamis.

#### 🛍️ Product Page
- Menampilkan seluruh daftar produk lengkap dengan gambar, nama, harga.
- Fitur **search real-time** untuk memudahkan pencarian produk.
- Setiap produk memiliki dua gambar (image 1 & image 2) yang berubah saat hover.

#### 🧺 Selected Cart Page
- Menampilkan produk-produk yang sudah ditambahkan ke keranjang.
- Pengguna bisa menambah/mengurangi jumlah produk.
- Tombol untuk menghapus produk yang dipilih.

#### 💳 Checkout Page
- Menampilkan detail pesanan yang akan dibayar.
- Pengguna memilih metode pembayaran dan mengisi alamat pengiriman.
- Jika pembayaran non-COD, akan muncul popup konfirmasi dengan countdown 20 menit dan fitur upload bukti pembayaran.

#### 📜 Order History
- Menampilkan daftar pesanan yang telah dilakukan oleh user.
- Tersedia status pesanan dan rincian order.

#### 👤 Profile Page
- Update informasi akun (nama, email, password).
- Logout button dan riwayat pesanan.
- Tampilan menarik dengan kartu profil.

#### ℹ️ About Page
- Menjelaskan tentang **Sepokat Store**, misi dan nilai-nilai brand.
- Menampilkan foto admin/owner website.

---

### 🛠️ Untuk Admin
Admin memiliki akses ke halaman backend untuk mengelola data pengguna, produk, dan pesanan:

#### 📦 Product Controller
- CRUD produk: tambah, edit, hapus, dan lihat detail produk.
- Mengelola stok dan harga produk.
- Tampilan produk dengan gambar dan informasi lengkap.

#### 📬 Order Controller
- Melihat semua pesanan dari user.
- Update status pesanan (diproses, dikirim, selesai).
- Verifikasi bukti pembayaran dari user.

#### 📊 Dashboard Admin
- Menampilkan statistik seperti total user, total produk, dan total pesanan.
- Grafik donut chart untuk perbandingan role user & admin.
- Bar chart penjualan dari Januari–Desember.

#### 📄 Detail Pemesanan
- Melihat detail lengkap satu pesanan termasuk nama pembeli, produk yang dipesan, bukti pembayaran, dan status order.

---

## 💻 Teknologi yang Digunakan

- **Frontend**: HTML, CSS, JavaScript (Native) / React.js *(Jika menggunakan React)*
- **Styling**: Tailwind CSS / Custom CSS
- **Data Management**: LocalStorage & API Backend
- **Charting**: Chart.js / Recharts untuk grafik admin
- **Authentication**: Sistem login/logout sederhana

---

## 📸 Preview Halaman

### 🖼️ Homepage
![Homepage](./screenshots/homepage.png)

### 🖼️ Product Page
![Product Page](./screenshots/productpage.png)

### 🖼️ Checkout & Payment
![Checkout](./screenshots/checkout.png)

### 🖼️ Order History
![Order History](./screenshots/orderhistory.png)

### 🖼️ Profile Page
![Profile Page](./screenshots/profile.png)

### 🖼️ Admin Dashboard
![Admin Dashboard](./screenshots/admin_dashboard.png)

---

## 🚀 Cara Menjalankan Proyek

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/sepokat-store.git
   cd sepokat-store
