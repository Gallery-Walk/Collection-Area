import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logUserOut, checkForLoggedInUser } from "../adapters/auth.adapter";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";

export default function DisplayUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (currentUser === undefined) { // ✅ Only fetch if `undefined` (loading)
        const user = await checkForLoggedInUser();
        if (user) {
          setCurrentUser(user);
        } else {
          navigate("/login"); // ❌ Only redirect if we're SURE user isn't logged in
        }
      }
      setLoading(false);
    }

    verifyUser();
  }, [currentUser, setCurrentUser, navigate]);

  if (loading || currentUser === undefined) return <p>Loading...</p>; // ✅ Prevent early redirects

  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);

  const handleLogOut = async () => {
    await logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="username_logout_container">
      <h1>"{currentUser.username}"</h1>
      {!!isCurrentUserProfile && (
        <button className="profile_button" onClick={handleLogOut}>
          logout
        </button>
      )}
    </div>
  );
}
