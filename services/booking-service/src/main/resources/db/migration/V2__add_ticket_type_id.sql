ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_type_id BIGINT;

-- Default value for existing bookings if any (pointing to a generic ticket type)
UPDATE bookings SET ticket_type_id = 1 WHERE ticket_type_id IS NULL;

-- Make it non-nullable for future entries
ALTER TABLE bookings ALTER COLUMN ticket_type_id SET NOT NULL;
