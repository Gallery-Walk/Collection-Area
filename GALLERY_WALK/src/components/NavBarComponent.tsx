import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { CircleUser } from "lucide-react"


export default function NavBar() {
  const { currentUser } = useContext(CurrentUserContext) || {};

  return (
    <header>
      <nav className="nav_container">
        <ul className="nav_menu">
          <li className="nav_li_home">
            <NavLink className="nav_link_home" style={({ isActive }) => ({
              borderStyle: isActive ? "none none solid none" : "none",
              color: isActive ? "#5a0404" : "5a0404"
            })} to="/">
              GW
            </NavLink>
          </li>
          <li className="nav_li_gallery">
            <NavLink to="/gallery" style={({ isActive }) => ({
              backgroundColor: isActive ? "#fafaea" : "#5a0404",
              color: isActive ? "#5a0404" : "#fffff4"
            })}>Gallery</NavLink>
          </li>
          {currentUser ? (
            <li className="nav_li_walk">
              <NavLink className="nav_link_walk" style={({ isActive }) => ({
                backgroundColor: isActive ? "#fafaea" : "#5a0404",
                color: isActive ? "#5a0404" : "#fffff4"
              })} to="/walk">Walk</NavLink>
            </li>
          ) : (
            <li className="nav_li_walk">
              <NavLink className="nav_link_walk" to="/login">Walk</NavLink>
            </li>
          )}
          {currentUser ? (
            <li className="nav_li_profile">
              <NavLink to={`/users/${currentUser.id}`}><CircleUser className="icon" /></NavLink>
            </li>
          ) : (
            <li className="nav_li_signup">
              <NavLink to="/sign-up"><CircleUser className="icon" /></NavLink> {/* ✅ Fixed placeholder */}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
