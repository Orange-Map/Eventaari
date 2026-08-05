-- creating events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  starts_at TIMESTAMP NOT NULL,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- inserting fake data for testing purp
INSERT INTO events (id, name, description, address, starts_at, lat, lng) VALUES
(1, 'Mellakka Festival', 'Some festival with a lot of rappers.', 'Kustaa III:n katu 6, Hämeenlinna', '2026-07-18T18:00', 61.0067, 24.4522),
(2, 'Tori Food Stands', 'Food stalls around the market square.', 'Kauppatori, Hämeenlinna', '2026-07-19T16:00', 60.9959, 24.4643),
(3, 'Aulanko Suunnistus', 'Orientiring event for beginners', 'Aulangontie 93, Hämeenlinna', '2026-07-20T09:00', 61.0197, 24.4372);

-- creating index on coordinates
CREATE INDEX idx_events_coordinates ON events(lat, lng);

-- creating index on start time 
CREATE INDEX idx_events_starts_at ON events(starts_at);
