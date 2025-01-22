// import './App.css'
import { Route, Routes, } from 'react-router-dom'
import HomePage from './routes/Home'
import GalleryPage from './routes/Gallery'
import WalkPage from './routes/Walk'
import ProfilePage from './routes/Profile'

export default function App() {
  return <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/gallery' element={<GalleryPage />} />
      <Route path='/walk' element={<WalkPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  </>
}

