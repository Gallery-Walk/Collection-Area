import GalleryImages from "../components/GalleryImages";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion"
import { Search } from "lucide-react"


export default function GalleryPage() {

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/gallery/search?q=${encodeURIComponent(searchQuery)}`)
    }
    console.log(searchQuery)
  }

  return (
    <div className="main_container">
      <div className="search_gallery_container">
        <section className="searchbar_container">
          <form onSubmit={handleSearch} className="search_form">
            <motion.div
              initial={{
                width: "20%"
              }}
              animate={{
                width: isFocused ? "70%" : "20%"
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <MotionConfig
                transition={{
                  duration: "0.25",
                  ease: "linear"
                }}
              >
                <motion.input
                  type="text"
                  placeholder="Search by title or artist"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.25 }}
                />
              </MotionConfig>
            </motion.div>
            <MotionConfig
              transition={{
                duration: "0.25",
                ease: "linear"
              }}
            >
              <motion.button
                type="submit"
                className="search_button"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <Search className="icon" />
              </motion.button>
            </MotionConfig>

          </form>
        </section>
        <GalleryImages />
      </div>
    </div >
  )

}