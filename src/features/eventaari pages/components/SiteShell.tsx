"use client";

import { Link, useLocation } from "react-router-dom";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { badges, USER_PROGRESS } from "../data/demoData";
import {
  UserProgressProvider,
  useUserProgress,
} from "./UserProgressContext";

export type ProfileView = "profile" | "badges" | "signin";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <UserProgressProvider>
      <SiteShellContent>{children}</SiteShellContent>
    </UserProgressProvider>
  );
}

function SiteShellContent({ children }: { children: ReactNode }) {
  const [profileView, setProfileView] = useState<ProfileView | null>(null);

  return (
    <>
      <SiteHeader onOpenProfile={setProfileView} />
      {children}
      <SiteFooter onOpenProfile={setProfileView} />
      <ProfileModal
        view={profileView}
        onClose={() => setProfileView(null)}
        onChangeView={setProfileView}
      />
    </>
  );
}

function SiteHeader({
  onOpenProfile,
}: {
  onOpenProfile: (view: ProfileView) => void;
}) {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileAreaRef = useRef<HTMLDivElement>(null);
  const { progress } = useUserProgress();

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (
        profileAreaRef.current &&
        !profileAreaRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setNavOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/events", label: "Events", active: pathname === "/events" },
    {
      href: "/community",
      label: "Community",
      active: pathname === "/community",
    },
    { href: "/#map", label: "Map", active: false },
    { href: "/housing", label: "Housing", active: pathname === "/housing" },
    {
      href: "/partners",
      label: "Partners",
      active: pathname === "/partners",
    },
  ];

  function openProfile(view: ProfileView) {
    setProfileMenuOpen(false);
    onOpenProfile(view);
  }

  return (
    <header className="site-header">
      <div className="header-left">
        <Link className="brand" to="/" onClick={() => setNavOpen(false)}>
          <img src="/assets/eventaari-logo.png" alt="Eventaari logo" />
          <span>Eventaari</span>
        </Link>

        <button
          className="hamburger-button"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="main-navigation"
          type="button"
          onClick={() => setNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          className={`main-nav ${navOpen ? "nav-open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              className={link.active ? "active" : undefined}
              to={link.href}
              key={link.label}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={`profile-area ${profileMenuOpen ? "menu-open" : ""}`}
        ref={profileAreaRef}
      >
        <div className="xp-box">
          <div className="xp-top">
            <strong>Level {progress.level}</strong>
            <span>
              {progress.currentLevelXP} / {USER_PROGRESS.xpPerLevel} XP
            </span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>

        <button
          className="avatar-button"
          aria-label="Open profile menu"
          aria-expanded={profileMenuOpen}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setProfileMenuOpen((open) => !open);
          }}
        >
          <img src="/assets/profile-picture.png" alt="Profile picture" />
        </button>

        <div className="profile-menu" aria-label="Profile actions">
          <button type="button" onClick={() => openProfile("profile")}>
            Profile
          </button>
          <button type="button" onClick={() => openProfile("badges")}>
            Badges / achievements
          </button>
          <button type="button" onClick={() => openProfile("signin")}>
            Sign in / Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function ProfileModal({
  view,
  onClose,
  onChangeView,
}: {
  view: ProfileView | null;
  onClose: () => void;
  onChangeView: (view: ProfileView) => void;
}) {
  const { completedChallengeIds, progress } = useUserProgress();

  useEffect(() => {
    if (!view) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, view]);

  if (!view) return null;

  const title =
    view === "badges"
      ? "Badges / achievements"
      : view === "signin"
        ? "Account"
        : "Profile";

  return (
    <div
      id="profile-popup"
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className="modal-card profile-popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-popup-title"
      >
        <div className="modal-header">
          <h2 id="profile-popup-title">{title}</h2>
          <button
            className="close-button"
            type="button"
            aria-label="Close profile popup"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="profile-popup-top">
          <div className="profile-popup-avatar">
            <img
              src="/assets/profile-picture.png"
              alt="Demo user profile picture"
            />
          </div>
          <div>
            <h3 className="profile-popup-name">Demo User</h3>
            <p className="profile-popup-meta">
              Level {progress.level} {progress.levelName} ·{" "}
              {progress.currentLevelXP} / {USER_PROGRESS.xpPerLevel} XP
            </p>
            <div className="xp-bar large" aria-label="Profile XP progress">
              <div
                className="xp-fill"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {view === "profile" && (
          <>
            <div className="profile-popup-grid">
              <div className="profile-popup-stat">
                <strong>Current level</strong>
                {progress.levelLabel}
              </div>
              <div className="profile-popup-stat">
                <strong>Next level</strong>
                {progress.neededXP} XP needed
              </div>
              <div className="profile-popup-stat">
                <strong>Completed challenges</strong>
                {completedChallengeIds.length}
              </div>
              <div className="profile-popup-stat">
                <strong>Profile idea</strong>
                Saved events and badges can be moved here later.
              </div>
            </div>
            <div className="profile-popup-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => onChangeView("badges")}
              >
                View badges
              </button>
              <Link className="button button-secondary" to="/community" onClick={onClose}>
                Open Community page
              </Link>
            </div>
          </>
        )}

        {view === "badges" && (
          <>
            <p className="profile-popup-meta">
              Student overall patch style badges. The goals are example rules
              for the future profile page.
            </p>
            <div className="profile-popup-badges">
              {badges.map((badge) => {
                const unlocked =
                  completedChallengeIds.length >= badge.requirement;
                return (
                  <div
                    className={`profile-popup-badge ${unlocked ? "" : "locked"}`}
                    key={badge.title}
                  >
                    <span>{badge.icon}</span>
                    <strong>{badge.title}</strong>
                    <small>{badge.goal}</small>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === "signin" && (
          <div className="profile-popup-stat">
            <strong>Offline demo</strong>
            Login is only a placeholder in this offline version. Later this
            could connect to real authentication.
          </div>
        )}
      </article>
    </div>
  );
}

function SiteFooter({
  onOpenProfile,
}: {
  onOpenProfile: (view: ProfileView) => void;
}) {
  const { pathname } = useLocation();
  const isEvents = pathname === "/events";
  const isCommunity = pathname === "/community";
  const isHome = pathname === "/";
  const showProfileButton = isHome || isEvents || isCommunity;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/assets/eventaari-logo.png" alt="Eventaari logo" />
            <strong>Eventaari</strong>
          </div>
          <p>
            {isHome || isEvents || isCommunity
              ? "Discover events and places..."
              : "Discover events and places around your area."}
          </p>
          {showProfileButton && (
            <button
              className="footer-popup-button"
              type="button"
              onClick={() => onOpenProfile("profile")}
            >
              Open profile popup
            </button>
          )}
          {!isEvents && !isCommunity && (
            <div className="social-icons">
              <span>◎</span>
              <span>f</span>
              <span>x</span>
              <span>in</span>
            </div>
          )}
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            <li><Link to="/#map">Map</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/housing">Housing</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
        </div>

        {isEvents ? (
          <div>
            <h3>Event tools</h3>
            <ul>
              <li><a href="#">Search</a></li>
              <li><a href="#">Filters</a></li>
              <li><a href="#">Calendar</a></li>
            </ul>
          </div>
        ) : isCommunity ? (
          <div>
            <h3>Community</h3>
            <ul>
              <li><a href="#badges">Badges</a></li>
              <li><a href="#">Challenges</a></li>
              <li><a href="#">Leaderboard</a></li>
            </ul>
          </div>
        ) : (
          <div>
            <h3>Support</h3>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Feedback</a></li>
            </ul>
          </div>
        )}

        <div>
          <h3>Business</h3>
          <ul>
            <li><Link to="/partners">For partners</Link></li>
            {isEvents || isCommunity ? (
              <li><Link to="/events">Create event</Link></li>
            ) : (
              <li><Link to="/partners#sponsored-pins">Sponsored pins</Link></li>
            )}
            <li><Link to="/partners#collaboration">Collaboration</Link></li>
          </ul>
        </div>

        <div>
          {isEvents ? (
            <>
              <h3>Offline demo</h3>
              <p>No external libraries or internet connection required.</p>
            </>
          ) : isCommunity ? (
            <>
              <h3>Offline demo</h3>
              <p>Challenge progress is stored only in this browser.</p>
            </>
          ) : (
            <>
              <h3>Find us on Mobile!</h3>
              <p>For best experience, download our app!</p>
              <div className="store-badges">
                <span>App Store</span>
                <span>Google Play</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Eventaari</span>
        <a href="#">Privacy policy</a>
        <a href="#">Terms of use</a>
      </div>
    </footer>
  );
}
