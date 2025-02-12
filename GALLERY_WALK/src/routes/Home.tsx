
import { ArrowDown } from "lucide-react"
import { motion, MotionConfig } from "framer-motion"
import sadclown from "../images/emil_bacik_--sad_clown_720.jpg"
import solider from "../images/cartolina_d_epoca_-_regimentale_coloniale_-_zaptie__libico_-_tafuri_720.jpg"
import martyrdom from "../images/leon_joseph_florentin_bonnat_-_the_martyrdom_of_st_denis__mural__-__meisterdrucke-90283__720.jpg"
import statue from "../images/screenshot_2022-11-22_at_21-56-05_home___twitter_720.png"
import ron from "../images/ron_hicks_720.jpg"
import jester from "../images/jan_matejko_-_sta__czyk_-_google_art_project_720.jpg"
import { useNavigate } from "react-router-dom"


export default function HomePage() {
  const navigate = useNavigate();


  const handleBegin = () => {
    navigate('/gallery')
  }

  return (
    <div className="main_container">
      <div className="home_container">
        <section className="home1">
          <div className="home_content_container">
            <section className="home1_images_section">

              <motion.div
                className="img1_container"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <MotionConfig
                  transition={{
                    duration: "0.25",
                    ease: "linear"
                  }}
                >
                  <motion.img
                    src={sadclown}
                    alt=""
                    className="home1_imgs"
                    whileHover={{ height: "37%", zIndex: "3" }}
                  />
                </MotionConfig>
              </motion.div>

              <motion.div
                className="img2_container"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <MotionConfig
                  transition={{
                    duration: "0.25",
                    ease: "linear"
                  }}
                >
                  <motion.img
                    src={martyrdom}
                    alt=""
                    className="home2_imgs"
                    whileHover={{ height: "37%" }}
                  />
                </MotionConfig>
              </motion.div>

              <motion.div
                className="img3_container"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <MotionConfig
                  transition={{
                    duration: "0.25",
                    ease: "linear"
                  }}
                >
                  <motion.img
                    src={solider}
                    alt=""
                    className="home3_imgs"
                    whileHover={{ height: "37%", zIndex: "3" }}
                  />
                </MotionConfig>
              </motion.div>
            </section>
            <section className="home1_content_section">
              <motion.h1
                className="home1_prompt"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <span><p className="TITLE_home">GALLEY WALK</p></span>
                Find your FAVORITE Pieces
              </motion.h1>
            </section>
          </div>
          <div className="home_arrow">
            <ArrowDown />
          </div>
        </section>
        <section className="home2">

          <div className="blur_overlay"></div>

          <div className="create_content">
            <h1 className="create_story">Create your story using <span><p className="thousands">THOUSANDS</p></span> of historical Art </h1>
            <MotionConfig
              transition={{
                duration: "0.25",
                ease: "easeInOut"
              }}
            >
              <motion.button
                className="BEGIN"
                onClick={handleBegin}
                whileHover={{ scale: 1.05, cursor: "pointer" }}
                whileTap={{ scale: 0.95, rotate: '3deg' }}
              >
                BEGIN
              </motion.button>
            </MotionConfig>

          </div>

          <div className="create_img_container">
            <img src={statue} alt="" className="create_img" />
            <img src={ron} alt="" className="create_img" />
            <img src={jester} alt="" className="create_img" />
          </div>

        </section>
      </div>
    </div>
  )
}