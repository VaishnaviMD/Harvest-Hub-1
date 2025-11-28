-- Seed Test Users for HarvestHub
-- IMPORTANT: This script requires BCrypt hashed passwords
-- 
-- RECOMMENDED: Use the automatic DataSeeder instead (runs on backend startup)
-- The DataSeeder automatically creates test users with properly hashed passwords
--
-- If you need to run this manually, you must generate BCrypt hashes first.
-- You can use an online BCrypt generator or run this Java code:
--   BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
--   String hash = encoder.encode("password123");
--
-- Run this script in MySQL Workbench after creating the database

USE harvesthub_db;

-- WARNING: The hashes below are examples. You need to generate real BCrypt hashes.
-- For now, use the automatic DataSeeder which handles this correctly.

-- Test Customer User
-- Email: customer@test.com
-- Password: password123
INSERT INTO users (email, password, name, type, ph_no, location, register_date) 
VALUES (
    'customer@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password123
    'Test Customer',
    'Customer',
    '1234567890',
    'Test City',
    NOW()
) ON DUPLICATE KEY UPDATE email=email;

-- Test Farmer User
-- Email: farmer@test.com
-- Password: password123
INSERT INTO users (email, password, name, type, ph_no, location, register_date) 
VALUES (
    'farmer@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password123
    'Test Farmer',
    'Farmer',
    '9876543210',
    'Farm Location',
    NOW()
) ON DUPLICATE KEY UPDATE email=email;

-- Admin User
-- Email: admin@test.com
-- Password: admin123
INSERT INTO users (email, password, name, type, ph_no, location, register_date) 
VALUES (
    'admin@test.com',
    '$2a$10$rOzJqZqN9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZd', -- admin123
    'Admin User',
    'Customer',
    '5555555555',
    'Admin City',
    NOW()
) ON DUPLICATE KEY UPDATE email=email;

-- Verify users were created
SELECT user_id, email, name, type, register_date FROM users WHERE email LIKE '%@test.com';

