import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { useContext, useEffect, useState } from "react";
import { basicFetchOptions, fetchHandler, deleteOptions, getPostOptions } from "../utils/fetchData";
import { useNavigate } from "react-router-dom";


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
      <h1>Your Walks</h1>
      <section className="publish_container">
        {likes.length > 0 && (
          <button className="publish_button" onClick={handleMove}>Publish</button>
        )}
      </section>
      <section className="card_container">
        <ul className="card_list">
          {likes.length === 0 ? (
            <li>
              <p>Your Gallery does not exist yet.</p>
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
                <img src={expandArt} alt="" />
                <button onClick={() => handleDelete(expandArt)}>delete</button>
              </div>
            </div>
          </div>
        )}
      </section>


    </div>
  );
}
