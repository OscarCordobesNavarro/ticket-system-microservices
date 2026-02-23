-- Seed initial events with premium data and working image URLs
INSERT INTO events (name, artist, venue, date, description, status, image_url)
VALUES 
('The Eras Tour', 'Taylor Swift', 'Estadio Santiago Bernabéu, Madrid', '2025-05-30 20:00:00', 'Una demostración magistral de pop que recorre todas las etapas de la carrera de Taylor Swift. Tres horas de espectáculo visual y musical.', 'AVAILABLE', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'),

('Formula 1 Spanish GP 2025', 'F1 Racing', 'Circuit de Barcelona-Catalunya', '2025-06-01 14:00:00', 'Siente la adrenalina del Gran Premio de España. La máxima categoría del automovilismo mundial aterriza en Barcelona para un fin de semana épico.', 'AVAILABLE', 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1000'),

('Tomorrowland Belgium', 'Dimitri Vegas & Like Mike', 'Boom, Bélgica', '2025-07-18 12:00:00', 'El festival de música electrónica más grande y místico del planeta. Vive el cuento de hadas con pirotecnia y los mejores DJs del mundo.', 'AVAILABLE', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000'),

('Afterlife: The Great Beyond', 'Tale Of Us', 'Zamna, Tulum', '2025-01-10 22:00:00', 'Una experiencia inmersiva de techno melódico bajo las estrellas. Visuales de vanguardia y sonido hipnótico en el corazón de la jungla.', 'LOW_STOCK', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000'),

('Final Champions League 2025', 'UEFA', 'Fußball Arena München, Múnich', '2025-05-31 21:00:00', 'El partido más importante del año en el fútbol europeo. Dos gigantes luchando por la gloria eterna en el espectacular estadio de Múnich.', 'SOLD_OUT', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000');

-- The Eras Tour
INSERT INTO ticket_types (event_id, name, price, capacity, description)
VALUES 
((SELECT id FROM events WHERE name = 'The Eras Tour'), 'General Pista', 145.00, 25000, 'Entrada estándar de pie en la zona de pista. Acceso a servicios de restauración y merchandising.'),
((SELECT id FROM events WHERE name = 'The Eras Tour'), 'Grada Preferente', 210.00, 15000, 'Asiento reservado en grada lateral con excelentes vistas panorámicas del escenario.'),
((SELECT id FROM events WHERE name = 'The Eras Tour'), 'VIP - Karma is my Boyfriend', 480.00, 2000, 'Pack VIP con acceso exclusivo, merchandising oficial y zona de hospitality.');

-- Formula 1
INSERT INTO ticket_types (event_id, name, price, capacity, description)
VALUES 
((SELECT id FROM events WHERE name = 'Formula 1 Spanish GP 2025'), 'Pelouse (3 Días)', 180.00, 40000, 'Acceso a las zonas de césped del circuito durante todo el fin de semana de carreras.'),
((SELECT id FROM events WHERE name = 'Formula 1 Spanish GP 2025'), 'Tribuna Principal', 550.00, 10000, 'Asiento cubierto frente a boxes con pantallas gigantes para no perder detalle de la carrera.'),
((SELECT id FROM events WHERE name = 'Formula 1 Spanish GP 2025'), 'Paddock Club VIP', 5200.00, 500, 'La experiencia definitiva de F1: pit-lane walk, gourmet catering y las mejores vistas.');

-- Tomorrowland
INSERT INTO ticket_types (event_id, name, price, capacity, description)
VALUES 
((SELECT id FROM events WHERE name = 'Tomorrowland Belgium'), 'Full Madness Pass', 355.00, 60000, 'Abono general para los tres días del festival en el mágico mundo de Tomorrowland.'),
((SELECT id FROM events WHERE name = 'Tomorrowland Belgium'), 'Comfort Pass (VIP)', 580.00, 5000, 'Acceso VIP a plataformas elevadas, bar privado y servicios premium en el festival.');

-- Afterlife
INSERT INTO ticket_types (event_id, name, price, capacity, description)
VALUES 
((SELECT id FROM events WHERE name = 'Afterlife: The Great Beyond'), 'General Entry', 120.00, 4000, 'Entrada estándar para la noche inmersiva con Tale Of Us en Tulum.'),
((SELECT id FROM events WHERE name = 'Afterlife: The Great Beyond'), 'Backstage Access', 450.00, 200, 'Acceso exclusivo detrás del escenario para vivir la experiencia Afterlife de cerca.');

-- Champions League Final
INSERT INTO ticket_types (event_id, name, price, capacity, description)
VALUES 
((SELECT id FROM events WHERE name = 'Final Champions League 2025'), 'Categoría 3', 70.00, 10000, 'Asientos situados en los niveles superiores detrás de las porterías.'),
((SELECT id FROM events WHERE name = 'Final Champions League 2025'), 'Categoría 1', 690.00, 15000, 'Ubicaciones preferentes en las tribunas laterales inferiores, cercanía máxima al césped.'),
((SELECT id FROM events WHERE name = 'Final Champions League 2025'), 'Skybox Premium', 4500.00, 300, 'Caja privada de lujo con trato VIP, catering exclusivo y las mejores butacas del estadio.');
