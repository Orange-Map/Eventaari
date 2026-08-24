"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import EventMap from "../../../Map.jsx";
import { getEvents } from "../../../api.js";

function toCardEvent(e: any) {
  const when = new Date(e.starts_at);
  return {
    id: String(e.id),
    title: e.name,
    category: e.category ?? "Community",
    location: e.locations?.address,
    description: e.description,
    displayDate: when.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: when.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function HomePageContent() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <main className="page-content">
      <section id="map" className="hero-map-section">
        <EventMap events={events} />
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
            {events.map((e) => (
              <EventCard key={e.id} event={toCardEvent(e)} showDescription={false} />
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