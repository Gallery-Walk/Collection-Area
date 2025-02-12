// import './App.css'
import { Route, Routes, } from 'react-router-dom'
import HomePage from './routes/Home'
import SignUpPage from './routes/Signup'
import GalleryPage from './routes/Gallery'
import WalkPage from './routes/Walk'
import ProfilePage from './routes/Profile'
import SearchResultPage from './routes/SearchGallery'
import LoginPage from './routes/Login'
// import ProfileEditPage from './routes/ProfileEditPage'
import NavBar from './components/NavBarComponent'
import NotFoundPage from './routes/NotFountPage'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return <>
    <NavBar />
    <ScrollToTop />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/gallery' element={<GalleryPage />} />
      <Route path="/gallery/search" element={<SearchResultPage />} />
      <Route path='/walk' element={<WalkPage />} />
      <Route path='/users/:id' element={<ProfilePage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </>
}

