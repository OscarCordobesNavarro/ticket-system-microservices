-- Crear la tabla con los nuevos campos
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(50) NOT NULL
);

-- Poblar con datos iniciales (los de tu frontend)
INSERT INTO events (name, artist, venue, date, description, price, image_url, status) VALUES
('Gira Future Nostalgia', 'Dua Lipa', 'Madison Square Garden, NYC', '2024-10-24 20:00:00', 'Experiencia pop inolvidable', 125.00, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', 'AVAILABLE'),
('Finales NBA: Juego 4', 'Lakers vs. Celtics', 'Crypto.com Arena, LA', '2024-11-02 19:30:00', 'El espectáculo del baloncesto', 450.00, 'https://images.unsplash.com/photo-1504450758481-7338eba7524a', 'LOW_STOCK'),
('Musical de Broadway', 'Hamilton', 'Richard Rodgers Theatre, NY', '2024-12-15 14:00:00', 'El musical que cambió la historia', 190.00, 'https://images.unsplash.com/photo-1503095396549-8072ea8c5934', 'SOLD_OUT');