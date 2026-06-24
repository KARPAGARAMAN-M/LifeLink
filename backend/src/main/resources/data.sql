-- LifeLink Sample Data
-- This file runs automatically in dev profile

-- Admin User (password: admin123)
INSERT IGNORE INTO users (id, name, email, password, role, is_blocked, created_at) VALUES
(1, 'Admin User', 'admin@lifelink.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', false, NOW());

-- Sample Users (password: password123)
INSERT IGNORE INTO users (id, name, email, password, role, is_blocked, created_at) VALUES
(2, 'Rahul Kumar', 'rahul@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', false, NOW()),
(3, 'Priya Sharma', 'priya@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', false, NOW()),
(4, 'Amit Patel', 'amit@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', false, NOW()),
(5, 'Sneha Reddy', 'sneha@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', false, NOW()),
(6, 'Vikram Singh', 'vikram@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', false, NOW());

-- Sample Donors
INSERT IGNORE INTO donors (id, user_id, blood_group, city, state, phone, availability, last_donation_date, created_at) VALUES
(1, 2, 'O_POSITIVE', 'Chennai', 'Tamil Nadu', '9876543210', true, '2024-03-15', NOW()),
(2, 3, 'A_POSITIVE', 'Mumbai', 'Maharashtra', '9876543211', true, '2024-05-20', NOW()),
(3, 4, 'B_POSITIVE', 'Bangalore', 'Karnataka', '9876543212', true, '2024-04-10', NOW()),
(4, 5, 'AB_NEGATIVE', 'Hyderabad', 'Telangana', '9876543213', false, '2024-01-05', NOW()),
(5, 6, 'O_NEGATIVE', 'Delhi', 'Delhi', '9876543214', true, '2024-06-01', NOW());

-- Sample Blood Requests
INSERT IGNORE INTO blood_requests (id, requester_id, donor_id, blood_group, hospital_name, city, urgency, status, message, created_at) VALUES
(1, 3, 1, 'O_POSITIVE', 'Apollo Hospital', 'Chennai', 'URGENT', 'COMPLETED', 'Need O+ blood urgently for surgery', NOW()),
(2, 2, 2, 'A_POSITIVE', 'Fortis Hospital', 'Mumbai', 'NORMAL', 'ACCEPTED', 'Required for scheduled transfusion', NOW()),
(3, 5, 5, 'O_NEGATIVE', 'AIIMS', 'Delhi', 'CRITICAL', 'PENDING', 'Emergency accident case - need O- blood ASAP', NOW());
