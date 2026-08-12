const API_URL = import.meta.env.VITE_API_URL;
const ANON_KEY = import.meta.env.VITE_ANON_KEY;

const HEADERS = {
    'apikey': ANON_KEY,
    'Content-Type': 'application/json',
};

export async function getEvents()
{
    try
    {
        const response = await fetch(`${API_URL}/events`, { headers: { 'apikey': ANON_KEY } });

        if (!response.ok) { throw new Error(`api error: ${response.status}`); }

        const events = await response.json();
        return events;
    }
    catch (error)
    {
        console.error('failed to fetch events: ', error);
        return [];
    }
}

export async function createEvent(event)
{
    try
    {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { ...HEADERS, 'Prefer': 'return=representation' },
            body: JSON.stringify(event),
        });

        if (!response.ok) { throw new Error(`api error: ${response.status}`); }

        const [created] = await response.json();
        return created;
    }
    catch (error)
    {
        console.error('failed to create event: ', error);
        return null;
    }
}

export async function updateEvent(id, updates)
{
    try
    {
        const response = await fetch(`${API_URL}/events?id=eq.${id}`, {
            method: 'PATCH',
            headers: { ...HEADERS, 'Prefer': 'return=representation' },
            body: JSON.stringify(updates),
        });

        if (!response.ok) { throw new Error(`api error: ${response.status}`); }

        const [updated] = await response.json();
        return updated;
    }
    catch (error)
    {
        console.error('failed to update event: ', error);
        return null;
    }
}

export async function deleteEvent(id)
{
    try
    {
        const response = await fetch(`${API_URL}/events?id=eq.${id}`, {
            method: 'DELETE',
            headers: HEADERS,
        });

        if (!response.ok) { throw new Error(`api error: ${response.status}`); }

        return true;
    }
    catch (error)
    {
        console.error('failed to delete event: ', error);
        return false;
    }
}
