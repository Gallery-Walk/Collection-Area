// import './App.css'
import { Route, Routes, } from 'react-router-dom'
import HomePage from './routes/Home'
import GalleryPage from './routes/Gallery'
import WalkPage from './routes/Walk'
import ProfilePage from './routes/Profile'
import SearchResultPage from './routes/SearchGallery'

export default function App() {
  return <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/gallery' element={<GalleryPage />} />
      <Route path="/gallery/search" element={<SearchResultPage />} />
      <Route path='/walk' element={<WalkPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  </>
}

