import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/currentUser-context-provider';
import { basicFetchOptions, fetchHandler } from '../utils/fetchData';
import { motion, MotionConfig } from "framer-motion"
export default function WalkPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [publishedImages, setPublishedImages] = useState([]);

  const fetchUsersGalleryPublish = async () => {
    const [data, error] = await fetchHandler(`/api/images`, basicFetchOptions);
    if (error) {
      console.error('Error fetching published gallery:', error);
      return;
    }

    setPublishedImages(data);
  };

  useEffect(() => {
    fetchUsersGalleryPublish();
  }, []);

  const handleGalleryDismiss = async () => {
    const res = await fetchHandler(`/api/delete/${currentUser.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res) {
      setPublishedImages(prevImages => prevImages.filter(img => img.userId !== currentUser.id));
    } else {
      console.error('Failed to delete user gallery');
    }
  };

  return (
    <div className="main_container">
      <div className='walk_move_container'>
        <section>
          {publishedImages.some(img => img.userId === currentUser.id) && (
            <MotionConfig
              transition={{
                duration: "0.25",
                ease: "easeInOut"
              }}
            >
              <motion.button
                className="move_button"
                onClick={handleGalleryDismiss}
                whileHover={{ scale: 1.05, cursor: "pointer" }}
                whileTap={{ scale: 0.95, rotate: '3deg' }}
              >
                Move My Gallery Back
              </motion.button>
            </MotionConfig>
          )}
        </section>
        <section className='walk_container'>
          <ul className='walk_list'>
            {publishedImages.length > 0 ? (
              publishedImages.map((gallery, idx) => (

                <li key={idx} className='walk_item'>
                  <p className='walk_username'>{gallery.username}'s Gallery Walk</p>
                  {gallery.imageUrl.map((url, imgIdx) => (

                    <img
                      key={imgIdx}
                      src={url}
                      alt={`moved-art-${imgIdx}`}
                      className='walk_artwork' />
                  ))}
                </li>


              ))
            ) : (
              <div className='logo_container_walk'>
                <p className='logo'>GW</p>
                <p>No Collections Published</p>
              </div>
            )}
          </ul>
        </section>

      </div>

    </div>
  );
}
