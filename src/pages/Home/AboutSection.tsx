export default function AboutSection(){
  return(
    <section className='flex justify-center mt-10 px-10 text-sm md:text-base'>
      <div className='w-full lg:w-1/2 flex flex-col items-baseline text-left'>
        <h1 className='text-xl md:text-2xl lg:text-3xl border-l-4 border-[#00bcff] pl-2 mb-4 font-medium'>Tentang</h1>
        <p>Tebak Kabupaten & Kota Indonesia adalah website interaktif yang menguji pengetahuanmu tentang letak geografis kabupaten dan kota di Indonesia. Pilih salah satu dari 38 provinsi Indonesia lalu tebak lokasi daerah yang benar. Setiap bermain akan disimpan dalam riwayat sehingga kamu bisa melihat perkembanganmu dari waktu ke waktu. Selamat bermain dan uji seberapa baik kamu mengenal peta Indonesia!</p>
        <p className='mt-2'>Fitur:</p>
        <ul className='list-disc list-inside'>
          <li>Semua kabupaten dan kota di seluruh 38 Provinsi Indonesia</li>
          <li>Empat mode permainan (Kasual, Sudden Death, Time Trial, Ultimate Challenge)</li>
          <li>Riwayat bermain</li>
        </ul>
      </div>
    </section>
  )
}