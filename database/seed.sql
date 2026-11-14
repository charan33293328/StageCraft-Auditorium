
-- StageCraft Auditorium Sample Data

-- Sample technicians
INSERT OR IGNORE INTO technicians (name, email, phone) VALUES
('Arun Kumar', 'arun@example.com', '9876543210'),
('Priya Sharma', 'priya@example.com', '9876543211');

-- Sample speakers
INSERT INTO speakers (name, type) VALUES
('JBL EON615', 'Powered'),
('Yamaha DBR12', 'Powered'),
('Bose S1 Pro', 'Portable');

-- Sample bookings
INSERT INTO bookings (technician_id, speaker_id, booking_date, status) VALUES
(1, 1, '2026-11-15', 'pending'),
(2, 2, '2026-11-16', 'approved');
