-- Create ticket_types table
CREATE TABLE IF NOT EXISTS ticket_types (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Migrate current prices to a default "General" ticket type
-- We assume a default capacity of 100 for existing events
INSERT INTO ticket_types (event_id, name, price, capacity)
SELECT id, 'General', price, 100 FROM events;

-- Remove the price column from events table as it is now in ticket_types
ALTER TABLE events DROP COLUMN price;
