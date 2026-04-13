import './App.css'
import "leaflet/dist/leaflet.css";
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Province from './pages/Province';
import Survival from './pages/Survival';
import { useEffect } from 'react';
import About from './pages/About';
import HowToPlay from './pages/HowToPlay';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {

  useEffect(() => {
    const historyVer = localStorage.getItem('ver')
    if(!historyVer || historyVer !== '1'){
      localStorage.clear()
      localStorage.setItem('ver', '1')
    }
  }, []);

  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/survival' element={<Survival />} />
      <Route path='/tentang' element={<About />} />
      <Route path='/cara-bermain' element={<HowToPlay />} />
      <Route path='/kebijakan-privasi' element={<PrivacyPolicy />} />
      <Route path='/:provinceName' element={<Province />} />
    </Routes>
  )
}

export default App
