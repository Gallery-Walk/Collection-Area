import GalleryImages from "../components/GalleryImages";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function GalleryPage() {

  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/gallery/search?q=${encodeURIComponent(searchQuery)}`)
    }
    console.log(searchQuery)
  }

  return (
    <div className="\">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title or artist"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Browse</button>
      </form>
      <GalleryImages />
    </div >
  )

}