DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NULL,
    department_name VARCHAR(30) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(11),
    PRIMARY KEY(id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES('Sword of a Thousand Truths','Mythic',999.99,1),
('Leeroys Path of Fury','Rare',49.99,20),
('Recursive Bow','Common',19.99,50),
('Unstoppable Force','Rare',60.00,10),
('Zulian Tiger','Mythic',400.00,2),
('Path to Coding','Legendary',200.00,15),
('MYSQL for dummies','Common',100.00,100),
('Tome of Knowledge','Legendary',125.00,5),
('Great Feast','Rare',75.00,30),
('Needlessly Large Rod','Legendary',250.00,35);