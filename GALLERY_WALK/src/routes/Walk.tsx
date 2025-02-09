import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/currentUser-context-provider';
import { basicFetchOptions, fetchHandler } from '../utils/fetchData';

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

    setPublishedImages(data);  // Show all published galleries with username
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
      <h1>HELLO THIS IS THE WALK PAGE</h1>
      <section>
        <ul>
          {publishedImages.length > 0 ? (
            publishedImages.map((gallery, idx) => (
              <li key={idx}>
                {/* Display each image */}
                {gallery.imageUrl.map((url, imgIdx) => (
                  <img key={imgIdx} src={url} alt={`moved-art-${imgIdx}`} />
                ))}
                {/* Display the username instead of userId */}
                <p>Published by: {gallery.username}</p>
              </li>
            ))
          ) : (
            <p>No moved images found.</p>
          )}
        </ul>
      </section>

      {/* Only delete current user's gallery */}
      {publishedImages.some(img => img.userId === currentUser.id) && (
        <button onClick={handleGalleryDismiss}>Move My Gallery Back</button>
      )}

      {/* <section>
        <button onClick={() => navigate(`/users/${currentUser.id}`)}>Return to Profile</button>
      </section> */}
    </div>
  );
}
