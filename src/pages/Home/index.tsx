import { useState } from 'react'
import { useLocation } from 'react-router';
import FooterSection from './FooterSection';
import AboutSection from './AboutSection';
import MainSection from './MainSection';
import GameHistorySection from './GameHistorySection';

function Home() {
  const location = useLocation()
  const fromProvince: boolean = location.state ? location.state?.scrollable : true;
  const [scrollable, setScrollable] = useState<boolean>(fromProvince)


  return (
    <div className={`${scrollable ? 'overflow-y-visible': 'overflow-y-hidden'} w-full h-screen`}>
      <MainSection 
        scrollable={scrollable}
        setScrollable={setScrollable}
      />
      <AboutSection />
      <GameHistorySection />
      <FooterSection />
    </div>
  )
}

export default Home
