export default function FooterSection(){
  return(
    <footer className='flex text-xs md:text-sm lg:text-base p-5 bg-gray-800 text-white flex-col items-start gap-y-2 mt-10'>
      <p className='text-left'>Created by <a href="https://github.com/rereard" target='_blank'>rereard</a> | Project's repo <a href='https://github.com/rereard/tebakkabupaten' target='_blank'>here</a></p>
      <p className='text-justify'>
        Website ini menggunakan data <a className='hover:underline text-blue-400' href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> (extracted via <a href="https://overpass-turbo.eu/" target="_blank">Overpass Turbo</a>) 
        dan menggunakan map tiles <a href="https://carto.com/" target="_blank">Carto Voyager (no labels)</a>.
      </p>
      <p className='self-center'>Work in Progress~</p>
    </footer>
  )
}