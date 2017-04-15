CREATE DATABASE bamazon_DB;
USE bamazon_DB;

CREATE TABLE products
(
	`item_id` INT NOT NULL AUTO_INCREMENT,
	`product_name` VARCHAR(256) NULL,
	`department_name` VARCHAR(256) NULL,
	`price` DECIMAL(10,2) NULL,
	`stock_quantity` INT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT products (product_name, department_name, price, stock_quantity) VALUES ("a sock", "clothing", 10.00, 20);

INSERT products (product_name, department_name, price, stock_quantity) VALUES ("a ring", "jewelry", 30.00, 20),
("a shoe", "footwear", 50.00, 30), ("a cup", "kitchenware", 5.50, 25), ("a pencil", "stationary", 1.00, 99), ("a jacket", "clothing", 30.00, 10),
("a candle", "decorations", 30.00, 20), ("a basketball", "sports", 20.00, 80), ("a book", "books", 60.00, 20), ("a cellphone", "electronics", 60.00, 50);
