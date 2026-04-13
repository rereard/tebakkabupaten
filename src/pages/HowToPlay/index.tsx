import { Link } from "react-router";

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <title>Cara Bermain - Tebak Kabupaten & Kota Indonesia</title>
      <meta name="description" content="Panduan lengkap cara bermain Tebak Kabupaten & Kota Indonesia. Pelajari aturan permainan, mode bermain, tips dan trik untuk menebak lokasi kabupaten dan kota di peta Indonesia." />

      <header className="bg-white shadow-sm p-4 flex items-center gap-4">
        <Link to="/" className="text-[#00bcff] font-bold no-underline hover:underline">← Beranda</Link>
        <h1 className="text-xl md:text-2xl font-bold m-0">Cara Bermain</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 text-left text-sm md:text-base leading-relaxed">

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Langkah-Langkah Bermain</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="bg-[#00bcff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
              <div>
                <h3 className="font-semibold">Buka Website dan Klik "Mulai Main!"</h3>
                <p className="text-gray-600">
                  Di halaman utama, Anda akan melihat peta Indonesia dengan semua batas provinsi. 
                  Klik tombol "Mulai Main!" untuk masuk ke mode pemilihan provinsi.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="bg-[#00bcff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
              <div>
                <h3 className="font-semibold">Pilih Provinsi</h3>
                <p className="text-gray-600">
                  Klik salah satu dari 38 provinsi di peta Indonesia. Arahkan kursor ke area peta 
                  untuk melihat batas provinsi yang di-highlight. Klik untuk memilih provinsi tersebut.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="bg-[#00bcff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
              <div>
                <h3 className="font-semibold">Pilih Mode Permainan</h3>
                <p className="text-gray-600">
                  Setelah memilih provinsi, sebuah modal akan muncul menampilkan daftar kabupaten dan kota 
                  di provinsi tersebut. Pilih mode permainan: Kasual, Sudden Death, Time Trial, atau 
                  Ultimate Challenge (kombinasi Sudden Death + Time Trial).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="bg-[#00bcff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</span>
              <div>
                <h3 className="font-semibold">Tebak Lokasi di Peta</h3>
                <p className="text-gray-600">
                  Nama kabupaten atau kota akan ditampilkan di bagian bawah layar diikuti tanda tanya (?). 
                  Tugas Anda adalah mengklik area yang benar di peta. Jika benar, area tersebut akan 
                  berwarna hijau. Jika salah, area akan berwarna merah.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="bg-[#00bcff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">5</span>
              <div>
                <h3 className="font-semibold">Lihat Hasil dan Riwayat</h3>
                <p className="text-gray-600">
                  Setelah semua kabupaten dan kota berhasil ditebak (atau permainan berakhir karena 
                  Sudden Death), Anda akan melihat hasil permainan. Hasil ini tersimpan secara otomatis 
                  dan bisa dilihat kembali di tab "Riwayat" atau di halaman utama.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Tips dan Trik</h2>
          <ul className="list-disc list-inside space-y-3 ml-4">
            <li>
              <strong>Mulai dari provinsi yang Anda kenal:</strong> Coba bermain di provinsi tempat 
              tinggal Anda atau provinsi yang pernah Anda kunjungi untuk membangun kepercayaan diri sebelum 
              mencoba provinsi yang kurang dikenal.
            </li>
            <li>
              <strong>Gunakan mode Kasual untuk belajar:</strong> Tidak ada penalti di mode Kasual, 
              jadi manfaatkan untuk mempelajari letak setiap kabupaten dan kota tanpa tekanan.
            </li>
            <li>
              <strong>Perhatikan bentuk wilayah:</strong> Setiap kabupaten memiliki bentuk batas yang 
              unik. Dengan bermain berulang kali, Anda akan mulai mengenali pola dan bentuk wilayah.
            </li>
            <li>
              <strong>Zoom in untuk area kecil:</strong> Beberapa kota (kotamadya) memiliki area yang 
              sangat kecil di peta. Gunakan fitur zoom untuk melihat dan mengklik area kecil ini dengan lebih tepat.
            </li>
            <li>
              <strong>Cek riwayat untuk perbaikan:</strong> Setelah bermain, lihat area mana yang salah 
              (ditandai merah). Fokuskan latihan pada area-area yang sering salah.
            </li>
            <li>
              <strong>Manfaatkan navigasi peta:</strong> Anda bisa meng-drag peta dan menggunakan 
              scroll wheel atau tombol +/- untuk zoom in dan zoom out selama permainan berlangsung.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Tentang Survival Mode</h2>
          <p className="mb-3">
            Survival Mode adalah tantangan tertinggi di Tebak Kabupaten. Dalam mode ini, Anda harus 
            menebak seluruh kabupaten dan kota di semua 38 provinsi Indonesia secara berurutan. 
            Berikut aturannya:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provinsi disajikan secara acak, satu per satu</li>
            <li>Satu kesalahan di provinsi manapun langsung mengakhiri seluruh permainan</li>
            <li>Tidak ada kesempatan kedua — game over berarti mengulang dari awal</li>
            <li>Waktu total akan dihitung dari awal hingga akhir</li>
            <li>Perkiraan waktu yang dibutuhkan: 10-15 menit untuk menyelesaikan semua provinsi</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Pertanyaan yang Sering Ditanyakan (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Apakah riwayat bermain saya aman?</h3>
              <p className="text-gray-600">
                Ya, riwayat permainan disimpan secara lokal di browser Anda dalam format terenkripsi. 
                Data tidak dikirimkan ke server manapun. Namun, jika Anda menghapus data browser, 
                riwayat permainan juga akan terhapus.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Berapa banyak permainan yang tersimpan?</h3>
              <p className="text-gray-600">
                Maksimal 5 permainan terakhir per provinsi yang disimpan dalam riwayat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Apakah saya perlu membuat akun?</h3>
              <p className="text-gray-600">
                Tidak, Anda bisa langsung bermain tanpa registrasi atau login. 
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Apakah data peta akurat?</h3>
              <p className="text-gray-600">
                Data batas wilayah bersumber dari OpenStreetMap, yang merupakan proyek peta dunia 
                kolaboratif yang terus diperbarui oleh komunitas pengguna di seluruh dunia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Mengapa ada kabupaten yang tidak muncul?</h3>
              <p className="text-gray-600">
                Data batas wilayah bergantung pada ketersediaan data di OpenStreetMap. Beberapa wilayah 
                baru yang dimekarkan mungkin belum tersedia di sumber data.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
