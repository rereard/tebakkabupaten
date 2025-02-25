import './App.css'
import "leaflet/dist/leaflet.css";
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Province from './pages/Province';

function App() {
  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:provinceName' element={<Province />} />
    </Routes>
  )
}

export default App
