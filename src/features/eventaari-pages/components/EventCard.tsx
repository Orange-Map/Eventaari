import type { EventItem } from "../data/demoData";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({
  event,
  showDescription = true,
}: {
  event: EventItem;
  showDescription?: boolean;
}) {
  const dateText = event.displayDate || formatDate(event.date);
  const categoryClass = `${event.category.toLowerCase()}-image`;

  return (
    <article className="event-card" data-event-id={event.id}>
      <div className={`event-image ${categoryClass}`}>
        <span>{event.category}</span>
      </div>
      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{dateText} · {event.time}</p>
        <p>📍 {event.location}</p>
        {showDescription && (
          <p className="event-description">{event.description}</p>
        )}
      </div>
    </article>
  );
}
