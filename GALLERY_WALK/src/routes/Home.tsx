
import { ArrowDown } from "lucide-react"

export default function HomePage() {


  return (
    <div className="main_container">
      <div className="home_container">
        <section className="home1">
          <div className="home_content_container">
            <section className="home1_images_section">
              <h1>images here</h1>
            </section>
            <section className="home1_content_section">
              <h1>hello</h1>
            </section>
          </div>
          <div className="home_arrow">
            <ArrowDown />
          </div>
        </section>
        <section className="home2">
          <h1>hello2</h1>
        </section>
        <section className="home3">
          <h1>hello3</h1>
        </section>
      </div>
    </div>
  )
}