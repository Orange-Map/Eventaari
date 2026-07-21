const API_URL = import.meta.env.VITE_API_URL;
const ANON_KEY = import.meta.env.VITE_ANON_KEY;

export async function getEvents()
{
    try
    {
        const response = await fetch(`${API_URL}/events`, { headers: {'apikey': ANON_KEY}});

        if (!response.ok) { throw new Error(`api error: ${response.status}`);}
    
        const events = await response.json();
        return events;
    }
    catch (error)
    {
        console.error('failed to fetch events: ', error);
        return [];
    }
}
