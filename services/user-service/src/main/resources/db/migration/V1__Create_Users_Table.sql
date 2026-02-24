CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Usuario de prueba (password: password)
INSERT INTO users (username, email, password, role) 
VALUES ('oscar', 'oscar@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uySeZTCmqCl0Hm69pyf26pNRXkUvjT6C', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
