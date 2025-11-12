-- Harvest Hub MySQL schema (minimal)

CREATE TABLE IF NOT EXISTS product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL, -- INR, integer rupees (or store paise in INT for precision)
  category VARCHAR(100),
  image VARCHAR(512),
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(255) NOT NULL,
  address VARCHAR(1000) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  total INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NULL,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Sample data
INSERT INTO product (name, price, category, image, description) VALUES
('Organic Tomatoes', 99, 'Vegetables', '/category-vegetables.jpg', 'Juicy & fresh'),
('Fresh Strawberries', 149, 'Fruits', '/category-fruits.jpg', 'Sweet and seasonal')
ON DUPLICATE KEY UPDATE name = VALUES(name);


