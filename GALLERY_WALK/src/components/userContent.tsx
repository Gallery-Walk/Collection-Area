import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { useContext, useEffect, useState } from "react";
import { basicFetchOptions, fetchHandler, deleteOptions, getPostOptions } from "../utils/fetchData";
import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion"


export default function UserContent() {
  const { currentUser } = useContext(CurrentUserContext);
  const [likes, setLikes] = useState([]);
  const [expandArt, setExpandArt] = useState<null>(null);
  const navigate = useNavigate()


  const getUsersLikes = async (id: string) => {
    const [likesData, error] = await fetchHandler(`/api/users/${id}/liked-pictures`, basicFetchOptions);
    if (error) throw new Error('No liked Artwork.');
    return likesData;
  };

  const fetchUsersLikes = async () => {
    const data = await getUsersLikes(currentUser.id);
    if (data && Array.isArray(data.liked_pictures)) {
      setLikes(data.liked_pictures);
    } else {
      setLikes([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsersLikes();
    }
  }, [currentUser]);

  const handleDelete = async (imageUrl: string) => {

    const res = await fetchHandler(`/api/users/${currentUser.id}/liked-pictures`, {
      ...deleteOptions,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    })

    console.log('Sending delete request for image:', imageUrl)

    if (res) fetchUsersLikes();
    else console.error('Failed to delete image');

  }

  const handleMove = async () => {
    try {
      const response = await fetchHandler('/api/publish', getPostOptions({
        userId: currentUser.id,
        imageUrls: likes
      }));

      if (response.error && response.error === 'Gallery already published by this user.') {
        alert('You have already published your gallery!');
      } else {
        console.log('Gallery published successfully:', response);
        navigate('/walk', { state: { images: likes } });
      }
    } catch (error) {
      console.error('Error publishing images:', error);
    }
  };




  return (
    <div className="userContent_container">
      <MotionConfig
        transition={{
          duration: "0.25",
          ease: "easeInOut"
        }}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Your Walks
        </motion.h1>
      </MotionConfig>

      <section className="publish_container">
        {likes.length > 0 && (
          <MotionConfig
            transition={{
              duration: "0.25",
              ease: "linear"
            }}
          >
            <motion.button
              className="publish_button"
              onClick={handleMove}
              variants={{
                hidden: { opacity: 0, y: 75 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ scale: 1.10, cursor: "pointer" }}
              whileTap={{ scale: 0.95, rotate: '3deg' }}
            >
              Publish
            </motion.button>
          </MotionConfig>

        )}
      </section>
      <section className="card_container">
        <ul className="card_list">
          {likes.length === 0 ? (
            <li>
              <p></p>
            </li>
          ) : (
            likes.map((like, indx) => (
              <li key={indx}>
                <div className="img_card">
                  <img src={like}
                    alt="liked-artwork"
                    onClick={() => setExpandArt(like)}
                    className="artwork_img"
                  />
                </div>
              </li>
            ))
          )}

        </ul>
        {expandArt && (
          <div className="artwork_modal_overlay" onClick={() => setExpandArt(null)}>
            <div className="artwork_modal_content" onClick={(e) => e.stopPropagation}>
              <div className="modal_img_container">
                <img src={expandArt} alt="" className="modal_artwork" />
                <MotionConfig
                  transition={{
                    duration: "0.25",
                    ease: "linear"
                  }}
                >
                  <motion.button className="artwork_button"
                    onClick={() => handleDelete(expandArt)}
                    whileHover={{ scale: 1.05, cursor: "pointer" }}
                    whileTap={{ scale: 0.95, rotate: '3deg' }}
                  >
                    delete
                  </motion.button>
                </MotionConfig>

              </div>
            </div>
          </div>
        )}
      </section>


    </div>
  );
}
