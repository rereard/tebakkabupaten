import './App.css'
import "leaflet/dist/leaflet.css";
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Province from './pages/Province';
// import Survival from './pages/Survival';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const historyVer = localStorage.getItem('ver')
    if(!historyVer && historyVer !== '0.5'){
      localStorage.clear()
      localStorage.setItem('ver', '0.5')
    }
  }, []);

  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:provinceName' element={<Province />} />
      {/* <Route path='/survival' element={<Survival />} /> */}
    </Routes>
  )
}

export default App
