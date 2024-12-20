DROP DATABASE IF EXISTS phonics_db;
CREATE DATABASE phonics_db;
-- USE phonics_db;

-- CREATE TABLE users(
--   user_id INTEGER(30) AUTO_INCREMENT NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   password VARCHAR(30) NOT NULL,
--   role VARCHAR(15) NOT NULL,
--   token VARCHAR (255) NOT NULL,
--   PRIMARY KEY (user_id)
-- );

-- CREATE TABLE tokens(
--   token_id INTEGER(30) AUTO_INCREMENT NOT NULL,
--   access VARCHAR(255) NOT NULL,
--   refresh VARCHAR(255) NOT NULL,
--   PRIMARY KEY (token_id)
-- );

-- CREATE TABLE products(
--   product_id INTEGER(30) AUTO_INCREMENT NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   value DECIMAL(9, 2) NOT NULL,
--   PRIMARY KEY (product_id)
-- );

/* INSERT INTO users (role, email, password, token) 
VALUES 
  ('admin', 'admin@ymail.com', '$2a$10$45qhN34y2CVGrb62Sip2GON7hDKATbTuHcYmyXAlkBcfHumWhmXXC',), 
  ('hair brush', 'Home & Kitchen', 5.00, 2), 
  ('LG TV', 'Electronics', 1000.00, 10), 
  ('PS4 Red Dead Redemption', 'Toys & Games', 60.00, 30),
  ('OWL Diaries Box Set', 'Books', 20.00, 10),
  ('Lego City Advent Calender', 'Toys & Games', 20.00, 10),
  ('Alexa FireStick Remote', 'Electronics', 40.00, 20),
  ('NOCO Battery Charger', 'Automotive', 30.00, 20),
  ('L.O.L. Surprise! Glam Doll', 'Toys & Games', 10.00, 20),
  ('Crayola LightUp Tracing Pad', 'Toys & Games', 25.00, 20);
 */


/*INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ('PS4 Red Dead Redemption', 'Toys & Games', 60, 30);*/


/* INSERT INTO departments (department_name, over_head_costs) values ('Home & Kitchen', 500.00);
INSERT INTO departments (department_name, over_head_costs) values ('Electronics', 10000.00);
INSERT INTO departments (department_name, over_head_costs) values ('Toys & Games', 1000.00);
INSERT INTO departments (department_name, over_head_costs) values ('Books', 800.00);
INSERT INTO departments (department_name, over_head_costs) values ('Automotive', 500.00); */

-- execute 
-- mysql -u root -p < initDB.sql 