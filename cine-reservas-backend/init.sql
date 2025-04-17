drop database if exists cinema_reservations;

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cinema_reservations;
USE cinema_reservations;

-- Crear la tabla Users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Crear la tabla Rooms
CREATE TABLE Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    movie_title VARCHAR(100) NOT NULL,
    movie_poster VARCHAR(255),
    seat_rows INT NOT NULL,
    seat_columns INT NOT NULL
);

-- Crear la tabla Reservations
CREATE TABLE Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    seat_row INT NOT NULL,
    seat_column INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE,
    UNIQUE (room_id, seat_row, seat_column, date)
);

-- Insertar datos iniciales
INSERT INTO Users (username, password, role, is_active)
VALUES 
    ('admin', '$2a$10$z5X8p3Q8g7z3X9Y2W8Z8u.J8X9Y2W8Z8u.J8X9Y2W8Z8u.J8X9Y2W', 'admin', TRUE),
    ('client1', '$2a$10$z5X8p3Q8g7z3X9Y2W8Z8u.J8X9Y2W8Z8u.J8X9Y2W8Z8u.J8X9Y2W', 'client', TRUE);

INSERT INTO Rooms (name, movie_title, movie_poster, seat_rows, seat_columns)
VALUES 
    ('Sala 1', 'Avengers: Endgame', 'https://via.placeholder.com/150', 10, 10),
    ('Sala 2', 'The Matrix', 'https://via.placeholder.com/150', 8, 12);

INSERT INTO Reservations (user_id, room_id, seat_row, seat_column, date)
VALUES 
    (2, 1, 1, 1, '2025-04-18'),
    (2, 1, 1, 2, '2025-04-18');

-- Índices
CREATE INDEX idx_reservations_room_date ON Reservations (room_id, date);
CREATE INDEX idx_users_username ON Users (username);