import "./EventCard.css";

// helper func to convert date into string
function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function EventCard({ event }) {
    return (
        <article className="event-card">
            <h3 className="event-card-title">{event.name}</h3>

            <p className="event-card-meta">
                <time dateTime={event.starts_at}>{formatDate(event.starts_at)}</time>
            </p>

            <p className="event-card-meta event-card-address">{event.address}</p>

            <p className="event-card-description">{event.description}</p>

            <button type="button" className="event-card-button">View event</button>
        </article>
    );
}

