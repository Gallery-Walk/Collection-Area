import { useState, useContext } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"
import CurrentUserContextTS from "../contexts/currentUser"
import { createUser } from "../adapters/user-adapter"

export default function SignUpPage() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(CurrentUserContextTS)
  const [errorText, setErrorText] = useState<string>('')
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');


  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorText('')
    if (!username || !password) return setErrorText('Missing username or password')

    const [user, error] = await createUser({ username, password })
    if (error) {
      if (error.message.includes("Username already exists")) {
        return setErrorText("That username is already taken. Please try another one.");
      }
      return setErrorText(error.message);
    }


    setCurrentUser(user)
    console.log('navigating to:', `/users/${user.id}`)
    navigate(`/users/${user.id}`)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  return <div>
    <div className="container">
      <section className="signup_section">
        <div className="signup_header">
          <h1 className="">Sign-up!</h1>
        </div>

        <div>
          <form action="" className="signup_form" onSubmit={handleSubmit} onChange={handleChange}>
            <h1 className="" id="create-heading">Create New User</h1>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              autoComplete="off"
              name="username"
              onChange={handleChange}
              value={username}
            />

            <label htmlFor="password">Password</label>
            <input
              autoComplete="off"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
            />

            <div className="m">
              <button className="button">
                Sign-up!
              </button>
            </div>

          </form>
          {!!errorText && <p>{errorText}</p>}
        </div>
        <div className="already_container">
          <p className="body">Already have an account with us? <Link className="body" to="/login">Log in!</Link></p>
        </div>
      </section>
    </div>
  </div>
}