import DisplayUser from "../components/DisplayUser"
import UserContent from "../components/userContent"

export default function ProfilePage() {
  return (
    <div className="main_container">
      <div className="display_content_container">
        <DisplayUser />
        <UserContent />
      </div>
    </div>
  )
}