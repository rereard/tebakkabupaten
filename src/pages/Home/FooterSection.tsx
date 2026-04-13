import { Link } from "react-router";

export default function FooterSection() {
  return (
    <footer className='bg-gray-800 text-white mt-10'>
      <div className='mx-auto p-6 md:p-8'>
        <div className='flex flex-col md:flex-row gap-8 md:gap-16 text-sm md:text-base mb-6'>
          {/* Site info */}
          <div className='flex-1'>
            <h3 className='font-semibold text-base md:text-lg mb-2 text-left'>Tebak Kabupaten & Kota</h3>
            <p className='text-gray-300 text-left'>
              Platform kuis geografi interaktif untuk menguji dan meningkatkan 
              pengetahuan tentang kabupaten dan kota di 38 provinsi Indonesia.
            </p>
          </div>

          {/* Navigation links */}
          <div className='flex-1'>
            <h3 className='font-semibold text-base md:text-lg mb-2 text-left'>Navigasi</h3>
            <ul className='space-y-1 text-left'>
              <li><Link to="/" className='text-gray-300 hover:text-white hover:underline'>Beranda</Link></li>
              <li><Link to="/tentang" className='text-gray-300 hover:text-white hover:underline'>Tentang</Link></li>
              <li><Link to="/cara-bermain" className='text-gray-300 hover:text-white hover:underline'>Cara Bermain</Link></li>
              <li><Link to="/survival" className='text-gray-300 hover:text-white hover:underline'>Survival Mode</Link></li>
              <li><Link to="/kebijakan-privasi" className='text-gray-300 hover:text-white hover:underline'>Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Credits */}
          <div className='flex-1'>
            <h3 className='font-semibold text-base md:text-lg mb-2 text-left'>Sumber Data</h3>
            <ul className='space-y-1 text-left'>
              <li><a className='text-gray-300 hover:text-white hover:underline' href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></li>
              <li><a className='text-gray-300 hover:text-white hover:underline' href="https://overpass-turbo.eu/" target="_blank" rel="noopener noreferrer">Overpass Turbo</a></li>
              <li><a className='text-gray-300 hover:text-white hover:underline' href="https://carto.com/" target="_blank" rel="noopener noreferrer">Carto Voyager</a></li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-600 pt-4 text-xs md:text-sm text-gray-400 flex flex-col md:flex-row justify-between gap-2'>
          <p>© 2025 Tebak Kabupaten & Kota Indonesia. Created by <a href="https://github.com/rereard" target='_blank' rel="noopener noreferrer" className='text-gray-300 hover:text-white hover:underline'>rereard</a></p>
          <Link to="/kebijakan-privasi" className='text-gray-300 hover:text-white hover:underline'>Kebijakan Privasi</Link>
        </div>
      </div>
    </footer>
  )
}
