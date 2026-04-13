import { Link } from "react-router";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <title>Kebijakan Privasi - Tebak Kabupaten & Kota Indonesia</title>
      <meta name="description" content="Kebijakan privasi website Tebak Kabupaten & Kota Indonesia. Informasi tentang pengumpulan data, cookies, dan penggunaan Google AdSense." />

      <header className="bg-white shadow-sm p-4 flex items-center gap-4">
        <Link to="/" className="text-[#00bcff] font-bold no-underline hover:underline">← Beranda</Link>
        <h1 className="text-xl md:text-2xl font-bold m-0">Kebijakan Privasi</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 text-left text-sm md:text-base leading-relaxed">
        <p className="text-gray-500 mb-6">Terakhir diperbarui: April 2026</p>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">1. Pendahuluan</h2>
          <p>
            Selamat datang di Tebak Kabupaten & Kota Indonesia ("kami", "website ini"). 
            Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi 
            informasi Anda saat menggunakan website kami di{" "}
            <a href="https://tebakkabupaten.pages.dev" target="_blank" rel="noopener noreferrer">
              tebakkabupaten.pages.dev
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">2. Data yang Kami Kumpulkan</h2>
          <p className="mb-3">Website ini adalah platform kuis geografi interaktif. Kami mengumpulkan data minimal:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Data Penyimpanan Lokal (Local Storage):</strong> Riwayat permainan Anda disimpan 
              secara lokal di browser Anda. Data ini tidak dikirim ke server manapun dan sepenuhnya 
              berada di perangkat Anda.
            </li>
            <li>
              <strong>Data Analitik:</strong> Kami mungkin menggunakan layanan analitik pihak ketiga 
              untuk memahami bagaimana pengunjung menggunakan website ini, termasuk halaman yang dikunjungi 
              dan durasi kunjungan.
            </li>
          </ul>
        </section>

        {/* <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">3. Google AdSense dan Cookies</h2>
          <p className="mb-3">
            Website ini menggunakan Google AdSense untuk menampilkan iklan. Google AdSense menggunakan cookies 
            untuk menayangkan iklan berdasarkan kunjungan pengguna ke website ini dan website lain di internet.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Google menggunakan cookie DART untuk menayangkan iklan kepada pengguna berdasarkan kunjungan 
              mereka ke website ini dan website lain di internet.
            </li>
            <li>
              Pengguna dapat menonaktifkan penggunaan cookie DART dengan mengunjungi{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                halaman pengaturan iklan Google
              </a>.
            </li>
            <li>
              Vendor pihak ketiga, termasuk Google, menggunakan cookies untuk menayangkan iklan berdasarkan 
              kunjungan pengguna sebelumnya ke website ini atau website lain.
            </li>
          </ul>
          <p className="mt-3">
            Untuk informasi lebih lanjut tentang bagaimana Google menggunakan data, silakan kunjungi{" "}
            <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer">
              Bagaimana Google menggunakan data saat Anda menggunakan situs atau aplikasi mitra kami
            </a>.
          </p>
        </section> */}

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">3. Penggunaan Data</h2>
          <p>Data yang dikumpulkan digunakan untuk:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Menyediakan dan memelihara layanan permainan kuis geografi</li>
            <li>Menyimpan riwayat dan progres permainan Anda secara lokal</li>
            {/* <li>Menampilkan iklan yang relevan melalui Google AdSense</li> */}
            <li>Menganalisis penggunaan website untuk peningkatan layanan</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">4. Keamanan Data</h2>
          <p>
            Kami berkomitmen untuk melindungi informasi Anda. Riwayat permainan disimpan dalam format 
            terenkripsi di penyimpanan lokal browser Anda. Kami tidak mengumpulkan informasi pribadi 
            yang dapat mengidentifikasi Anda secara langsung.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">5. Hak Pengguna</h2>
          <p>Anda memiliki hak untuk:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Menghapus riwayat permainan Anda kapan saja dengan membersihkan data browser</li>
            <li>Menonaktifkan cookies melalui pengaturan browser Anda</li>
            {/* <li>Menggunakan pemblokir iklan jika Anda tidak ingin melihat iklan personalisasi</li> */}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">6. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diposting 
            di halaman ini dengan tanggal pembaruan terbaru.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">7. Kontak</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui{" "}
            <a href="https://github.com/rereard" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>.
          </p>
        </section>
      </main>
    </div>
  );
}
