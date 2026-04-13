import { Link } from "react-router";

export default function AboutSection(){
  return(
    <section className='flex justify-center mt-10 px-6 md:px-10 text-sm md:text-base'>
      <div className='w-full lg:w-1/2 flex flex-col items-baseline text-left'>
        <h2 className='text-xl md:text-2xl lg:text-3xl border-l-4 border-[#00bcff] pl-2 mb-4 font-medium'>Tentang Tebak Kabupaten</h2>
        <p className='mb-3'>
          Tebak Kabupaten & Kota Indonesia adalah website kuis geografi interaktif yang menguji 
          pengetahuanmu tentang letak geografis kabupaten dan kota di Indonesia. Pilih salah satu 
          dari 38 provinsi Indonesia lalu tebak lokasi daerah yang benar di peta interaktif.
        </p>
        <p className='mb-3'>
          Indonesia memiliki lebih dari 500 kabupaten dan kota yang tersebar di seluruh kepulauan 
          Nusantara. Dari Pulau Sumatera di barat hingga Papua di timur, setiap provinsi memiliki 
          pembagian wilayah yang unik. Tebak Kabupaten membantu Anda mengenal dan menghapal letak 
          setiap wilayah dengan cara yang menyenangkan.
        </p>
        <p className='mb-3'>
          Setiap permainan akan disimpan dalam riwayat sehingga kamu bisa melihat perkembanganmu 
          dari waktu ke waktu. Tersedia empat mode permainan untuk berbagai tingkat kesulitan.
        </p>
        <h3 className='text-lg md:text-xl font-medium mt-4 mb-2'>Fitur Utama</h3>
        <ul className='list-disc list-inside space-y-1 mb-4'>
          <li>Semua kabupaten dan kota di seluruh <strong>38 Provinsi Indonesia</strong></li>
          <li>Empat mode permainan: <strong>Kasual, Sudden Death, Time Trial, dan Ultimate Challenge</strong></li>
          <li><strong>Survival Mode</strong>: tebak seluruh Indonesia tanpa kesalahan</li>
          <li>Riwayat bermain otomatis tersimpan untuk melacak progres</li>
          <li>Peta interaktif dengan data dari OpenStreetMap</li>
        </ul>
        <div className='flex gap-3 mt-2 flex-wrap'>
          <Link to="/tentang" className='text-[#00bcff] font-medium hover:underline'>
            Selengkapnya →
          </Link>
          <Link to="/cara-bermain" className='text-[#00bcff] font-medium hover:underline'>
            Cara Bermain →
          </Link>
        </div>
      </div>
    </section>
  )
}