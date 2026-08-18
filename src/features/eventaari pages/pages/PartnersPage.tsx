export default function PartnersPage() {
  return (
    <main className="page-content inner-page">
      <section className="page-hero partners-hero">
        <div>
          <p className="eyebrow">For partners</p>
          <h1>Reach students and local communities through Eventaari.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget
            ultricies nunc nisl eget nunc.
          </p>
          <div className="button-row hero-buttons">
            <a href="#partner-request" className="button button-primary">Partner with us</a>
            <a href="#partner-options" className="button button-secondary">See options</a>
          </div>
        </div>
        <div className="hero-side-card">
          <span className="small-label">Example visibility</span>
          <h2>Sponsored map pin</h2>
          <p>
            Promote a place, event or student offer directly where users are
            already exploring.
          </p>
        </div>
      </section>

      <section id="partner-options" className="content-section">
        <div className="section-title-row">
          <h2>Partner options</h2>
          <a href="#partner-request">Request info →</a>
        </div>
        <div className="feature-grid four-columns">
          <PartnerFeature
            id="sponsored-pins"
            icon="📍"
            title="Sponsored pins"
            description="Show partner locations or offers on the map so users can discover them while browsing nearby places."
          />
          <PartnerFeature
            icon="🎟️"
            title="Promoted events"
            description="Give important events more visibility on the landing page, event carousel or event listings."
          />
          <PartnerFeature
            icon="🏷️"
            title="Student offers"
            description="Add discounts, campaigns or simple student-friendly benefits that fit the Eventaari audience."
          />
          <PartnerFeature
            id="collaboration"
            icon="🤝"
            title="Collaboration"
            description="Create campaigns together with local organisations, campuses, student groups or event organisers."
          />
        </div>
      </section>

      <section className="split-section">
        <div className="text-panel">
          <p className="eyebrow">Why it matters</p>
          <h2>Better visibility for your services and products.</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget
            ultricies nunc nisl eget nunc.
          </p>
        </div>
        <div className="check-list-panel">
          <h3>Possible incentives</h3>
          <ul>
            <li>Visibility on the map</li>
            <li>Promoted event placement</li>
            <li>Sponsored pins for local places</li>
            <li>Campaigns aimed at students</li>
            <li>Partner page listing</li>
          </ul>
        </div>
      </section>

      <section id="partner-request" className="form-section">
        <div>
          <p className="eyebrow">Contact placeholder</p>
          <h2>Partner request</h2>
          <p>
            This form is only a visual placeholder for now. Later it could send
            the request to the team or open an email draft.
          </p>
        </div>
        <form className="mock-form">
          <label>
            Organisation name
            <input type="text" placeholder="Example organisation" />
          </label>
          <label>
            Contact email
            <input type="email" placeholder="contact@example.com" />
          </label>
          <label>
            Interested in
            <select defaultValue="Sponsored pins">
              <option>Sponsored pins</option>
              <option>Promoted events</option>
              <option>Student offers</option>
              <option>Other collaboration</option>
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Write short details here" />
          </label>
          <button className="button button-primary" type="button">Send request</button>
        </form>
      </section>
    </main>
  );
}

function PartnerFeature({
  id,
  icon,
  title,
  description,
}: {
  id?: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="feature-card" id={id}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
