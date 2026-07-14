import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        Hämeenlinna Events
      </Link>

      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        YoButt
      </button>

      <nav className={menuOpen ? "nav open" : "nav"}>
        <NavLink to="/" onClick={() => setMenuOpen(false)} end>
          Home
        </NavLink>
        <NavLink to="/map" onClick={() => setMenuOpen(false)}>
          Map
        </NavLink>
        <NavLink to="/events" onClick={() => setMenuOpen(false)}>
          Events
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
