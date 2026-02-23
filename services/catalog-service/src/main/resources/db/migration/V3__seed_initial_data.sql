-- Seed initial events
INSERT INTO events (name, artist, venue, date, description, status, image_url)
VALUES 
('Rock in Rio', 'Various Artists', 'Olympic Park', '2026-09-13 20:00:00', 'The biggest music festival in the world.', 'AVAILABLE', 'https://example.com/images/rockinrio.jpg'),
('Afterlife Madrid', 'Tale of Us', 'IFEMA', '2025-10-25 22:00:00', 'An immersive experience with the best melodic techno.', 'AVAILABLE', 'https://example.com/images/afterlife.jpg'),
('Coldplay - Music of the Spheres', 'Coldplay', 'Estadio Metropolitano', '2025-06-15 21:00:00', 'World tour with a focus on sustainability.', 'AVAILABLE', 'https://example.com/images/coldplay.jpg');

-- Seed ticket types for Rock in Rio (Event ID 2, assuming sequence starts correctly, but let's use a more robust way if possible)
-- Actually, since we have V1 and V2, let's just insert and let the database handle it. 
-- In a clean DB, "Rock in Rio" will be ID 1 (if no previous data).

-- Inserting ticket types for Rock in Rio (Assuming ID 1)
INSERT INTO ticket_types (event_id, name, price, capacity)
VALUES 
((SELECT id FROM events WHERE name = 'Rock in Rio'), 'General', 150.00, 50000),
((SELECT id FROM events WHERE name = 'Rock in Rio'), 'VIP', 450.00, 5000);

-- Inserting ticket types for Afterlife (Assuming ID 2)
INSERT INTO ticket_types (event_id, name, price, capacity)
VALUES 
((SELECT id FROM events WHERE name = 'Afterlife Madrid'), 'General Entry', 80.00, 15000),
((SELECT id FROM events WHERE name = 'Afterlife Madrid'), 'Backstage VIP', 250.00, 500);

-- Inserting ticket types for Coldplay (Assuming ID 3)
INSERT INTO ticket_types (event_id, name, price, capacity)
VALUES 
((SELECT id FROM events WHERE name = 'Coldplay - Music of the Spheres'), 'Pista', 95.00, 20000),
((SELECT id FROM events WHERE name = 'Coldplay - Music of the Spheres'), 'Grada Baja', 120.00, 15000),
((SELECT id FROM events WHERE name = 'Coldplay - Music of the Spheres'), 'VIP Package', 350.00, 2000);
