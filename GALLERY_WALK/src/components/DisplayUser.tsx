import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logUserOut, checkForLoggedInUser } from "../adapters/auth.adapter";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { motion, MotionConfig } from "framer-motion"

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
      <MotionConfig>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          "{currentUser.username}"
        </motion.h1>
      </MotionConfig>

      {!!isCurrentUserProfile && (
        <MotionConfig
          transition={{
            duration: "0.25",
            ease: "easeInOut"
          }}
        >
          <motion.button
            className="profile_button"
            onClick={handleLogOut}
            variants={{
              hidden: { opacity: 0, y: 75 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            logout
          </motion.button>
        </MotionConfig>

      )}
    </div>
  );
}
