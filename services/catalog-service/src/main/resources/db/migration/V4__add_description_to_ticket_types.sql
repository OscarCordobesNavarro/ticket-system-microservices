-- Add description column to ticket_types
ALTER TABLE ticket_types ADD COLUMN IF NOT EXISTS description VARCHAR(500);

-- Update default descriptions
UPDATE ticket_types SET description = 'Entrada estándar con acceso al recinto.' WHERE name = 'General' OR name = 'General Entry' OR name = 'Pista';

-- Update specific descriptions for Rock in Rio
UPDATE ticket_types SET description = 'Acceso exclusivo al VIP Lounge con barra libre y vistas privilegiadas.' 
WHERE event_id = (SELECT id FROM events WHERE name = 'Rock in Rio') AND name = 'VIP';

-- Update specific descriptions for Afterlife
UPDATE ticket_types SET description = 'Primera línea detrás del DJ, acceso rápido y bar privado.' 
WHERE event_id = (SELECT id FROM events WHERE name = 'Afterlife Madrid') AND name = 'Backstage VIP';

-- Update specific descriptions for Coldplay
UPDATE ticket_types SET description = 'Visibilidad panorámica del escenario, asiento reservado y kit de merchandising oficial.' 
WHERE event_id = (SELECT id FROM events WHERE name = 'Coldplay - Music of the Spheres') AND name = 'Grada Baja';

UPDATE ticket_types SET description = 'El mejor pack: Meet & Greet, acceso privilegiado y hospitality premium.' 
WHERE event_id = (SELECT id FROM events WHERE name = 'Coldplay - Music of the Spheres') AND name = 'VIP Package';
