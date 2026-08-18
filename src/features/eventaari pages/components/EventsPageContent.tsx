"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  baseEvents,
  STORAGE_KEYS,
  type EventItem,
} from "../data/demoData";
import EventCard from "./EventCard";

const categories = ["All", "Music", "Culture", "Sports", "Food", "Community"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getEventDateKey(event: EventItem) {
  return event.calendarDate || event.date || "";
}

function getEventMonthKey(event: EventItem) {
  return getEventDateKey(event).slice(0, 7);
}

function dateForEventMonth(event: EventItem) {
  const match = getEventDateKey(event).match(/^(\d{4})-(\d{2})-/);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : null;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function filterEventList(
  events: EventItem[],
  activeFilter: string,
  search: string,
) {
  const query = search.trim().toLowerCase();
  return events.filter((event) => {
    const matchesFilter =
      activeFilter === "All" || event.category === activeFilter;
    const searchableText = `${event.title} ${event.category} ${event.location} ${event.description}`.toLowerCase();
    return matchesFilter && (!query || searchableText.includes(query));
  });
}

function synchronizeCalendarDate(currentDate: Date, events: EventItem[]) {
  if (!events.length) return currentDate;
  const currentMonthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}`;
  if (events.some((event) => getEventMonthKey(event) === currentMonthKey)) {
    return currentDate;
  }

  const firstEvent = [...events]
    .filter((event) => getEventDateKey(event))
    .sort((a, b) => getEventDateKey(a).localeCompare(getEventDateKey(b)))[0];
  return (firstEvent && dateForEventMonth(firstEvent)) || currentDate;
}

export default function EventsPageContent() {
  const [customEvents, setCustomEvents] = useState<EventItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [calendarDate, setCalendarDate] = useState(new Date(1984, 8, 1));
  const [eventModalOpen, setEventModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEYS.customEvents);
        if (saved) setCustomEvents(JSON.parse(saved));
      } catch {
        // The in-memory demo still works when storage is unavailable.
      }
      setStorageLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.customEvents,
        JSON.stringify(customEvents),
      );
    } catch {
      // The in-memory demo still works when storage is unavailable.
    }
  }, [customEvents, storageLoaded]);

  const allEvents = useMemo(
    () => [...baseEvents, ...customEvents],
    [customEvents],
  );

  const filteredEvents = useMemo(() => {
    return filterEventList(allEvents, activeFilter, search);
  }, [activeFilter, allEvents, search]);

  const monthJumpEvents = useMemo(() => {
    const months = new Map<string, EventItem>();
    [...filteredEvents]
      .filter((event) => getEventDateKey(event))
      .sort((a, b) => getEventDateKey(a).localeCompare(getEventDateKey(b)))
      .forEach((event) => {
        const monthKey = getEventMonthKey(event);
        if (!months.has(monthKey)) months.set(monthKey, event);
      });
    return [...months.entries()];
  }, [filteredEvents]);

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const date = String(data.get("date") || "");

    const newEvent: EventItem = {
      id: `custom-${Date.now()}`,
      title: String(data.get("title") || ""),
      category: String(data.get("category") || "Community"),
      date,
      calendarDate: date,
      time: String(data.get("time") || ""),
      location: String(data.get("location") || ""),
      description:
        String(data.get("description") || "") ||
        "User-created offline test event.",
    };
    const nextCustomEvents = [...customEvents, newEvent];
    const nextFilteredEvents = filterEventList(
      [...baseEvents, ...nextCustomEvents],
      activeFilter,
      search,
    );
    setCustomEvents(nextCustomEvents);
    setCalendarDate((current) =>
      synchronizeCalendarDate(current, nextFilteredEvents),
    );
    form.reset();
    setEventModalOpen(false);
  }

  return (
    <>
      <main className="page-content events-page-content">
        <section className="event-search-panel">
          <div className="search-header-row">
            <div>
              <p className="eyebrow">Events page</p>
              <h1>Search events</h1>
            </div>
            <div className="matching-counter">
              <strong>{filteredEvents.length}</strong>
              <span>matching events</span>
            </div>
          </div>

          <label className="input-label" htmlFor="event-search">
            Search by name, category or location
          </label>
          <input
            id="event-search"
            className="search-input"
            type="search"
            placeholder="Try Music, Isengard or Space Food"
            value={search}
            onChange={(event) => {
              const nextSearch = event.target.value;
              setSearch(nextSearch);
              setCalendarDate((current) =>
                synchronizeCalendarDate(
                  current,
                  filterEventList(allEvents, activeFilter, nextSearch),
                ),
              );
            }}
          />

          <div className="filter-row" aria-label="Event category filters">
            {categories.map((category) => (
              <button
                className={`filter-pill ${activeFilter === category ? "active" : ""}`}
                type="button"
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  setCalendarDate((current) =>
                    synchronizeCalendarDate(
                      current,
                      filterEventList(allEvents, category, search),
                    ),
                  );
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="events-section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Browse</p>
              <h2>Event cards</h2>
            </div>
            <button
              className="button button-primary small-button"
              type="button"
              onClick={() => setEventModalOpen(true)}
            >
              Create event
            </button>
          </div>

          <div className="event-grid full-event-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <p className="empty-message">
              No events match your search. Try another category or search word.
            </p>
          )}
        </section>

        <EventCalendar
          calendarDate={calendarDate}
          events={filteredEvents}
          monthJumpEvents={monthJumpEvents}
          onCalendarDateChange={setCalendarDate}
        />
      </main>

      {eventModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEventModalOpen(false);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2 id="event-modal-title">Create test event</h2>
              <button
                className="close-button"
                aria-label="Close form"
                type="button"
                onClick={() => setEventModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="event-form" onSubmit={handleCreateEvent}>
              <label>Event name<input required name="title" type="text" placeholder="Example event" /></label>
              <label>
                Category
                <select name="category" required defaultValue="Music">
                  <option>Music</option>
                  <option>Culture</option>
                  <option>Sports</option>
                  <option>Food</option>
                  <option>Community</option>
                </select>
              </label>
              <label>Date<input required name="date" type="date" /></label>
              <label>Time<input required name="time" type="time" /></label>
              <label>Location<input required name="location" type="text" placeholder="Location name" /></label>
              <label className="full-width">
                Short description
                <textarea name="description" rows={4} placeholder="What is this event about?" />
              </label>
              <button className="button button-primary full-width" type="submit">
                Add event
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function EventCalendar({
  calendarDate,
  events,
  monthJumpEvents,
  onCalendarDateChange,
}: {
  calendarDate: Date;
  events: EventItem[];
  monthJumpEvents: [string, EventItem][];
  onCalendarDateChange: (date: Date) => void;
}) {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const startDate = new Date(year, month, 1 - startDay);
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const title = calendarDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });

  function changeMonth(amount: number) {
    onCalendarDateChange(new Date(year, month + amount, 1));
  }

  return (
    <section className="calendar-panel" aria-label="Event calendar">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2>Example calendar</h2>
        </div>
        <div className="calendar-controls">
          <button className="icon-button" type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <strong>{title}</strong>
          <button className="icon-button" type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
      </div>

      <div className="calendar-jump-row" aria-label="Jump to event month">
        {monthJumpEvents.map(([monthKey, event]) => {
          const date = dateForEventMonth(event);
          if (!date) return null;
          return (
            <button
              className={`calendar-jump-pill ${monthKey === currentMonthKey ? "active" : ""}`}
              type="button"
              key={monthKey}
              onClick={() => onCalendarDateChange(date)}
            >
              {date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </button>
          );
        })}
      </div>

      <div className="calendar-grid">
        {weekdays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
        {cells.map((date) => {
          const dateKey = getLocalDateKey(date);
          const dayEvents = events.filter(
            (event) => getEventDateKey(event) === dateKey,
          );
          return (
            <div
              className={`calendar-day ${date.getMonth() !== month ? "is-muted" : ""}`}
              key={dateKey}
            >
              <span className="calendar-day-number">{date.getDate()}</span>
              {dayEvents.map((event) => (
                <span className="calendar-event-chip" key={event.id}>{event.title}</span>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
