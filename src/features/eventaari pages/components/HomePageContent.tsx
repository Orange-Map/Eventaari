"use client";

import { Link } from "react-router-dom";
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { baseEvents } from "../data/demoData";
import EventCard from "./EventCard";

export default function HomePageContent() {
  return (
    <main className="page-content">
      <section id="map" className="hero-map-section">
        <MapPreview />
        <button className="map-slider" aria-label="Open full map" type="button" />
        <p className="map-slider-text">Open full map</p>
      </section>

      <section className="welcome-card">
        <div>
          <h1>Welcome to <span>Eventaari</span></h1>
          <p>
            Eventaari helps students and local communities discover events,
            places, activities, housing options and shared experiences around
            them.
          </p>
        </div>
        <div className="button-row">
          <a href="#map" className="button button-primary">Explore the map</a>
          <Link to="/events" className="button button-secondary">Browse events</Link>
          <Link to="/housing" className="button button-secondary">Housing</Link>
        </div>
      </section>

      <section id="events" className="events-section">
        <div className="section-title-row">
          <h2>Popular around you</h2>
          <Link to="/events">View all →</Link>
        </div>
        <div className="carousel-layout">
          <button className="carousel-arrow" aria-label="Previous events" type="button">‹</button>
          <div className="event-grid home-event-grid">
            {baseEvents.map((event) => (
              <EventCard key={event.id} event={event} showDescription={false} />
            ))}
          </div>
          <button className="carousel-arrow" aria-label="Next events" type="button">›</button>
        </div>
      </section>

      <section className="steps-section">
        <h2>How to use Eventaari</h2>
        <div className="steps-grid">
          {[
            ["1", "Explore the map", "See events, places and useful locations around you."],
            ["2", "Choose a place", "Open an event or location card that interests you."],
            ["3", "Check details", "Read the time, location, category and basic information."],
            ["4", "Join or save", "Plan your visit and collect experience and rewards through activities."],
          ].map(([number, title, description]) => (
            <article className="step-card" key={number}>
              <div className="step-number">{number}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="housing" className="text-panel housing-section">
        <div>
          <p className="eyebrow">Future feature</p>
          <h2>Housing and useful places</h2>
          <p>
            Later, Eventaari could also show useful student housing information
            and practical local places through the same map-based idea.
          </p>
        </div>
        <a href="#map" className="button button-secondary">Back to map</a>
      </section>

      <section id="partners" className="partner-section">
        <div>
          <h2>For business partners</h2>
          <p>
            Businesses and organisations can use Eventaari for sponsored pins,
            promoted events and collaboration opportunities. This feature is
            currently in development and will be available in the future.
          </p>
        </div>
        <Link className="button button-primary" to="/partners">Partner with us</Link>
      </section>
    </main>
  );
}

function MapPreview() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(115);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const deltaX = ((event.clientX - dragStart.current.x) / rect.width) * 100;
    const deltaY = ((event.clientY - dragStart.current.y) / rect.height) * 100;

    setPosition((current) => ({
      x: Math.max(0, Math.min(100, current.x - deltaX)),
      y: Math.max(0, Math.min(100, current.y - deltaY)),
    }));
    dragStart.current = { x: event.clientX, y: event.clientY };
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoom((current) =>
      Math.max(105, Math.min(180, current + (event.deltaY < 0 ? 8 : -8))),
    );
  }

  return (
    <div
      className={`map-preview is-draggable-map ${dragging ? "is-dragging" : ""}`}
      title="Drag to move the map image. Use mouse wheel to zoom."
      style={{
        backgroundSize: `${zoom}%`,
        backgroundPosition: `${position.x}% ${position.y}%`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onWheel={handleWheel}
    >
      <span className="map-label">Map placeholder image</span>
    </div>
  );
}
