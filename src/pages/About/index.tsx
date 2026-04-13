import { Link } from "react-router";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <title>Tentang - Tebak Kabupaten & Kota Indonesia</title>
      <meta name="description" content="Tentang Tebak Kabupaten & Kota Indonesia. Platform kuis geografi interaktif untuk menguji dan meningkatkan pengetahuan tentang kabupaten dan kota di 38 provinsi Indonesia." />

      <header className="bg-white shadow-sm p-4 flex items-center gap-4">
        <Link to="/" className="text-[#00bcff] font-bold no-underline hover:underline">← Beranda</Link>
        <h1 className="text-xl md:text-2xl font-bold m-0">Tentang Tebak Kabupaten & Kota</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 text-left text-sm md:text-base leading-relaxed">

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Apa Itu Tebak Kabupaten?</h2>
          <p className="mb-3">
            Tebak Kabupaten & Kota Indonesia adalah platform kuis geografi interaktif yang dirancang untuk 
            menguji dan meningkatkan pengetahuan Anda tentang pembagian wilayah administratif Indonesia. 
            Dengan menggunakan peta interaktif, pemain dapat mempelajari lokasi lebih dari 500 kabupaten 
            dan kota yang tersebar di 38 provinsi Indonesia.
          </p>
          <p>
            Indonesia, sebagai negara kepulauan terbesar di dunia, memiliki pembagian wilayah yang kompleks 
            dan beragam. Dari Sabang hingga Merauke, setiap provinsi memiliki keunikan tersendiri dengan 
            jumlah kabupaten dan kota yang bervariasi. Tebak Kabupaten hadir sebagai media belajar yang 
            menyenangkan untuk mengenal lebih dalam geografi Indonesia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Mode Permainan</h2>
          <p className="mb-3">Terdapat empat mode permainan yang bisa dipilih sesuai tingkat kemampuan:</p>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="font-semibold text-base md:text-lg">🟢 Kasual</h3>
              <p className="text-gray-600 mt-1">
                Mode santai tanpa batasan waktu atau penalti. Cocok untuk pemula yang ingin belajar 
                letak kabupaten dan kota tanpa tekanan. Setiap jawaban salah tidak akan menghentikan permainan, 
                sehingga Anda bisa terus mencoba sampai semua daerah berhasil ditebak.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
              <h3 className="font-semibold text-base md:text-lg">🔴 Sudden Death</h3>
              <p className="text-gray-600 mt-1">
                Satu kesalahan dan permainan langsung berakhir! Mode ini menguji ketepatan dan kepercayaan 
                diri Anda. Tidak ada ruang untuk salah — Anda harus benar-benar mengetahui lokasi setiap 
                kabupaten dan kota. Cocok untuk pemain yang sudah mahir dan ingin membuktikan kemampuannya.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <h3 className="font-semibold text-base md:text-lg">⏱️ Time Trial</h3>
              <p className="text-gray-600 mt-1">
                Selesaikan secepat mungkin! Waktu terus berjalan, dan setiap jawaban salah akan menambah 
                penalti 10 detik ke total waktu Anda. Mode ini menguji kecepatan dan ketepatan sekaligus. 
                Bandingkan waktu terbaik Anda dengan permainan sebelumnya melalui riwayat bermain.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h3 className="font-semibold text-base md:text-lg">💀 Ultimate Challenge</h3>
              <p className="text-gray-600 mt-1">
                Kombinasi Sudden Death dan Time Trial — mode tersulit! Anda harus cepat dan tepat. 
                Satu kesalahan saja langsung mengakhiri permainan, dan waktu terus berjalan. 
                Hanya untuk pemain yang benar-benar menguasai geografi Indonesia.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Survival Mode</h2>
          <p>
            Selain mode permainan per provinsi, Tebak Kabupaten juga menyediakan Survival Mode — 
            tantangan terbesar untuk menebak seluruh kabupaten dan kota di semua 38 provinsi Indonesia 
            secara berurutan. Dengan aturan Sudden Death, satu kesalahan di provinsi manapun akan 
            mengakhiri seluruh permainan. Mode ini membutuhkan waktu sekitar 10-15 menit dan menguji 
            pengetahuan geografi Indonesia secara menyeluruh.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Fitur Utama</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Peta interaktif:</strong> Menggunakan data OpenStreetMap yang akurat dengan tampilan peta Carto Voyager</li>
            <li><strong>38 provinsi:</strong> Mencakup seluruh provinsi Indonesia dari Aceh hingga Papua</li>
            <li><strong>500+ kabupaten dan kota:</strong> Data lengkap pembagian wilayah administratif Indonesia</li>
            <li><strong>Riwayat bermain:</strong> Setiap permainan tersimpan sehingga Anda bisa melacak perkembangan</li>
            <li><strong>Empat mode permainan:</strong> Dari santai hingga tantangan ultimate</li>
            <li><strong>Responsif:</strong> Dapat dimainkan di desktop, tablet, maupun smartphone</li>
            <li><strong>Tanpa registrasi:</strong> Langsung bermain tanpa perlu membuat akun</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Sumber Data</h2>
          <p className="mb-2">
            Tebak Kabupaten menggunakan data peta dari{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>, 
            yang diekstrak melalui{" "}
            <a href="https://overpass-turbo.eu/" target="_blank" rel="noopener noreferrer">Overpass Turbo</a>. 
            Tampilan peta menggunakan tile dari{" "}
            <a href="https://carto.com/" target="_blank" rel="noopener noreferrer">Carto Voyager (no labels)</a> 
            {" "}untuk memberikan tampilan bersih tanpa label yang bisa menjadi petunjuk.
          </p>
          <p>
            Data batas wilayah kabupaten dan kota diproses dalam format GeoJSON dan dimuat secara 
            dinamis untuk setiap provinsi guna menjaga performa website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Tentang Pengembang</h2>
          <p>
            Tebak Kabupaten dikembangkan oleh{" "}
            <a href="https://github.com/rereard" target="_blank" rel="noopener noreferrer">Rere Ardany</a> 
            {" "}sebagai proyek open-source. Website ini dibangun menggunakan React, TypeScript, Leaflet, 
            dan di-deploy melalui Cloudflare Pages.
          </p>
        </section>

      </main>
    </div>
  );
}
