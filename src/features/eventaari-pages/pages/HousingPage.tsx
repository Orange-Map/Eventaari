import { Link } from "react-router-dom";

export default function HousingPage() {
  return (
    <main className="page-content inner-page">
      <section className="page-hero housing-hero">
        <div>
          <p className="eyebrow">Housing</p>
          <h1>Find student housing and useful living options around the area.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className="button-row hero-buttons">
            <a href="#housing-listings" className="button button-primary">Browse housing</a>
            <a href="#housing-info" className="button button-secondary">Read info</a>
          </div>
        </div>
        <div className="hero-side-card housing-side-card">
          <span className="small-label">Housing status</span>
          <h2>4 example listings</h2>
          <p>These are placeholder cards to show how the page could work visually.</p>
        </div>
      </section>

      <section className="filter-panel">
        <div>
          <label>Search</label>
          <input type="text" placeholder="Search by city, campus or street" />
        </div>
        <div>
          <label>Type</label>
          <select defaultValue="Any type">
            <option>Any type</option>
            <option>Studio</option>
            <option>Shared apartment</option>
            <option>Temporary room</option>
          </select>
        </div>
        <div>
          <label>Price</label>
          <select defaultValue="Any price">
            <option>Any price</option>
            <option>Under 500 €</option>
            <option>500–700 €</option>
            <option>700 € +</option>
          </select>
        </div>
        <button className="button button-primary" type="button">Search</button>
      </section>

      <section id="housing-listings" className="content-section">
        <div className="section-title-row">
          <h2>Housing examples</h2>
          <a href="#">View map →</a>
        </div>
        <div className="housing-layout">
          <div className="housing-grid">
            <HousingCard
              imageClass="studio-image"
              label="Studio"
              title="Small studio near campus"
              location="Hämeenlinna centre"
              detail="Available from August"
              tags={["1 room", "Student friendly", "520 € / month"]}
            />
            <HousingCard
              imageClass="shared-image"
              label="Shared"
              title="Shared apartment room"
              location="Close to bus route"
              detail="Suitable for exchange students"
              tags={["Room", "Shared kitchen", "390 € / month"]}
            />
            <HousingCard
              imageClass="temporary-image"
              label="Temporary"
              title="Temporary room option"
              location="Near city services"
              detail="Short-term placeholder listing"
              tags={["Short stay", "Flexible", "Ask price"]}
            />
            <HousingCard
              imageClass="service-image"
              label="Service"
              title="Student housing queue"
              location="Online service"
              detail="Information card for official housing services"
              tags={["Info", "Application", "External link"]}
            />
          </div>

          <aside className="map-card">
            <div className="small-map-preview" />
            <h3>Housing map placeholder</h3>
            <p>
              The housing page could also connect listings to the same map
              system as events and places.
            </p>
            <Link to="/#map" className="button button-secondary">Open map</Link>
          </aside>
        </div>
      </section>

      <section id="housing-info" className="split-section">
        <div className="text-panel">
          <p className="eyebrow">Housing information</p>
          <h2>Keep housing cards clear and safe.</h2>
          <p>
            Housing content should focus on useful details like location, price
            range, availability, room type and trusted contact information. The
            page should avoid feeling like a random marketplace.
          </p>
        </div>
        <div className="check-list-panel">
          <h3>Useful details</h3>
          <ul>
            <li>Price and availability</li>
            <li>Distance to campus or transport</li>
            <li>Room type and basic features</li>
            <li>Clear contact or application link</li>
            <li>Safety note for user trust</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function HousingCard({
  imageClass,
  label,
  title,
  location,
  detail,
  tags,
}: {
  imageClass: string;
  label: string;
  title: string;
  location: string;
  detail: string;
  tags: string[];
}) {
  return (
    <article className="housing-card">
      <div className={`housing-image ${imageClass}`}><span>{label}</span></div>
      <div className="housing-info">
        <h3>{title}</h3>
        <p>📍 {location}</p>
        <p>{detail}</p>
        <div className="tag-row">
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </article>
  );
}
