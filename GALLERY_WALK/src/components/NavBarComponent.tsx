import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";

export default function NavBar() {
  const { currentUser } = useContext(CurrentUserContext) || {};

  return (
    <header>
      <nav className="nav_container">
        <ul className="nav_menu">
          <li className="nav_li_home">
            <NavLink className="nav_link_home" to="/">GW</NavLink>
          </li>
          <li className="nav_li_gallery">
            <NavLink to="/gallery">Gallery</NavLink>
          </li>
          <li className="nav_li_walk">
            <NavLink className="nav_link_walk" to="/walk">Walk</NavLink>
          </li>
          {currentUser ? (
            <li>
              <NavLink to={`/users/${currentUser.id}`}>PROFILE</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/sign-up">Sign Up</NavLink> {/* ✅ Fixed placeholder */}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
