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
VALUES('sword of a thousand truths','mythic',999.99,1),
('leeroys path of fury','rare',49.99,20),
('recursive bow','common',19.99,50),
('unstoppable force','rare',60.00,10),
('zulian tiger','mythic',400.00,2),
('Path to Coding','legendary',200.00,15),
('MYSQL for dummies','common',100.00,100),
('tome of knowledge','legendary',125.00,5),
('great feast','rare',75.00,30),
('needlessly large rod','legendary',250.00,35);