import { useNavigate, Navigate } from "react-router-dom"
import { useState, useContext } from "react"
import { logUserIn } from "../adapters/auth.adapter"
import { CurrentUserContext } from "../contexts/currentUser-context-provider"

export default function LoginPage() {
  const navigate = useNavigate()
  const [errorText, setErrorText] = useState<string>('');
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext) || {};

  console.log("CurrentUserContext value:", useContext(CurrentUserContext));

  if (!setCurrentUser) {
    console.error("setCurrentUser is undefined! Check if CurrentUserProvider is wrapping your app.");
  }

  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorText('');
    const formData = new FormData(e.target);
    const [user, error] = await logUserIn(Object.fromEntries(formData));
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    navigate(`/users/${user.id}`);
  }

  return <div>
    <div className="container">
      <section className="signup_section">
        <div className="signup_header">
          {/* <h1 className=""></h1> */}
        </div>

        <div>
          <form action="" className="signup_form" onSubmit={handleSubmit}>
            <h1 className="" id="create-heading">Log back in</h1>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              autoComplete="username"
              name="username"
              id="username"
            />

            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              type="password"
              name="password"
              id="password"
            />

            <div className="m">
              <button className="button">
                Login!
              </button>
            </div>

          </form>
          {!!errorText && <p>{errorText}</p>}
        </div>
      </section>
    </div>
  </div>
}