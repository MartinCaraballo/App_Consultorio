CREATE DATABASE IF NOT EXISTS app_reservas;

USE app_reservas;

CREATE TABLE IF NOT EXISTS Rooms(
  room_id INT NOT NULL,
  PRIMARY KEY (room_id)
);

CREATE TABLE IF NOT EXISTS Users(
  email VARCHAR(64) NOT NULL,
  phone_number INT NOT NULL,
  name VARCHAR(32) NOT NULL,
  last_name VARCHAR(32) NOT NULL,
  is_admin BOOLEAN NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS Reserves(
  room_id INT NOT NULL,
  user_email VARCHAR(64) NOT NULL,
  reserve_date DATE NOT NULL,
  start_time TIME NOT NULL,
  PRIMARY KEY (room_id, user_email),
  FOREIGN KEY (room_id) REFERENCES Rooms(room_id),
  FOREIGN KEY (user_email) REFERENCES Users(email)
);

CREATE TABLE IF NOT EXISTS Login(
  email VARCHAR(64) NOT NULL,
  password VARCHAR(256) NOT NULL,
  authorized BOOLEAN NOT NULL,
  PRIMARY KEY (email),
  FOREIGN KEY (email) REFERENCES Users(email)
);

CREATE TABLE IF NOT EXISTS Prices(
  hours INT NOT NULL,
  price_per_hour INT NOT NULL,
  PRIMARY KEY (hours)
);
