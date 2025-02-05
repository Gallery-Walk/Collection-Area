import { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { checkForLoggedInUser } from "../adapters/auth.adapter";

interface User {
  id: string;
  username: string;
}

interface CurrentUserContextType {
  currentUser: User | null; // Use `null` instead of `undefined`
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
}


export const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any | undefined>(undefined); // ✅ undefined = "loading"

  useEffect(() => {
    async function restoreSession() {
      const user = await checkForLoggedInUser();
      console.log("✅ Restoring session:", user);
      if (user) {
        setCurrentUser(user); // ✅ Set to user object
      } else {
        setCurrentUser(null); // ✅ Only set `null` if we're sure the user isn't logged in
      }
    }

    restoreSession();
  }, []); // Runs once when the app loads

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
