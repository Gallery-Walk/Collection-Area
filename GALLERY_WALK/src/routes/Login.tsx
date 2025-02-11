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
    if (error) return setErrorText(error.message); //<--- replace with alert from toast

    setCurrentUser(user);
    navigate(`/users/${user.id}`);
  }

  return <div className="main_container">
    <section className="signup_section">
      <div className="signup_header">
        <h1 className="">LOGIN</h1>
      </div>

      <div>
        <form action="" className="signup_form" onSubmit={handleSubmit}>
          <div className="create_heading_container">
            <h1 className="" id="create-heading">Welcome Back</h1>
            <p>Continue Creating</p>
          </div>
          <div className="signup_input_container">
            <input
              type="text"
              autoComplete="username"
              name="username"
              id="username"
              className="signup_input"
              placeholder="Username"
            />
          </div>


          <div className="signup_input_container">
            <input
              autoComplete="current-password"
              type="password"
              name="password"
              id="password"
              className="signup_input"
              placeholder="Password"
            />
          </div>


          <div className="signup_button_container">
            <button className="signup_button">
              LOGIN
            </button>
          </div>

        </form>
        {!!errorText && <p>{errorText}</p>}
      </div>
    </section>
  </div>

}