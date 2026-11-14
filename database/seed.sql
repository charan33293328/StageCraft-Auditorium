
-- StageCraft Auditorium Sample Data

-- 1. Insert sample technicians if they do not exist
INSERT OR IGNORE INTO technicians (name, email, phone) VALUES
('Arun Kumar', 'arun@example.com', '9876543210'),
('Priya Sharma', 'priya@example.com', '9876543211');

-- 2. Insert sample speakers only if they do not exist
INSERT INTO speakers (name, type)
SELECT 'JBL EON615', 'Powered'
WHERE NOT EXISTS (
    SELECT 1 FROM speakers
    WHERE name = 'JBL EON615' AND type = 'Powered'
);

INSERT INTO speakers (name, type)
SELECT 'Yamaha DBR12', 'Powered'
WHERE NOT EXISTS (
    SELECT 1 FROM speakers
    WHERE name = 'Yamaha DBR12' AND type = 'Powered'
);

INSERT INTO speakers (name, type)
SELECT 'Bose S1 Pro', 'Portable'
WHERE NOT EXISTS (
    SELECT 1 FROM speakers
    WHERE name = 'Bose S1 Pro' AND type = 'Portable'
);

-- 3. Insert sample bookings only if they do not exist
INSERT INTO bookings (technician_id, speaker_id, booking_date, status)
SELECT t.id, s.id, '2026-11-15', 'pending'
FROM technicians t
JOIN speakers s ON s.name = 'JBL EON615'
WHERE t.email = 'arun@example.com'
AND s.type = 'Powered'
AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.technician_id = t.id
    AND b.speaker_id = s.id
    AND b.booking_date = '2026-11-15'
);

INSERT INTO bookings (technician_id, speaker_id, booking_date, status)
SELECT t.id, s.id, '2026-11-16', 'approved'
FROM technicians t
JOIN speakers s ON s.name = 'Yamaha DBR12'
WHERE t.email = 'priya@example.com'
AND s.type = 'Powered'
AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.technician_id = t.id
    AND b.speaker_id = s.id
    AND b.booking_date = '2026-11-16'
);
