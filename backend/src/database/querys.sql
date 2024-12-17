-- Active: 1734282380920@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

SELECT * FROM users;

CREATE TABLE events (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    description TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    creator_id TEXT NOT NULL,
    is_all_day INT NOT NULL,
    invited_users TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

SELECT * FROM events;

CREATE TABLE guests (
    id INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    invited_at DATETIME NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM guests;
