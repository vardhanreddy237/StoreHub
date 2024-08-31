CREATE DATABASE stores;

USE stores;

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    contact_number VARCHAR(20),
    available_products TEXT,
    website VARCHAR(255),
    open_at TIME,
    close_at TIME,
    image VARCHAR(255) 
);

/*
INSERT INTO stores (name, location, contact_number, available_products, website, open_at, close_at, image) VALUES
('Croma', 'HiTech-city', '123-456-7890', 'Laptops, Desktops, Accessories', 'http://croma.com', '09:00:00', '18:00:00', 'images/croma.jpeg'),
('universal book store', 'Library Lane', '234-567-8901', 'Books, Magazines, Stationery', 'https://universalbook.in/', '10:00:00', '20:00:00', 'images/universal.jpeg'),
('Zudio', 'AS Rao Nagar', '345-678-9012', 'Clothing, Shoes, Accessories', 'http://zudio.com', '10:00:00', '22:00:00', 'images/zudio.jpeg'),
('Dmart', 'Kushiguda', '456-789-0123', 'Fresh Produce, Snacks, Beverages', 'https://www.dmart.in/', '07:00:00', '23:00:00', 'images/dmart.jpeg'),
('Decatholn', 'Uppal', '567-890-1234', 'Video Games, Consoles, Merchandise', 'https://www.decathlon.in/', '11:00:00', '21:00:00', 'images/decathlon.jpeg');
*/

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
