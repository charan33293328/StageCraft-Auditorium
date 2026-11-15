
const db = require("../config/database");

// CREATE booking
const createBooking = (req, res) => {
    const { technician_id, speaker_id, booking_date } = req.body;

    if (
        !Number.isInteger(technician_id) || technician_id <= 0 ||
        !Number.isInteger(speaker_id) || speaker_id <= 0 ||
        typeof booking_date !== "string" || !booking_date.trim()
    ) {
        return res.status(400).json({
            error: "Valid technician_id, speaker_id and booking_date are required"
        });
    }

    db.run(
        `INSERT INTO bookings (technician_id, speaker_id, booking_date)
         VALUES (?, ?, ?)`,
        [technician_id, speaker_id, booking_date.trim()],
        function (err) {
            if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(400).json({
                        error: "Invalid technician_id or speaker_id"
                    });
                }

                return res.status(500).json({
                    error: "Failed to create booking"
                });
            }

            res.status(201).json({
                message: "Booking created successfully",
                booking: {
                    id: this.lastID,
                    technician_id,
                    speaker_id,
                    booking_date: booking_date.trim(),
                    status: "pending"
                }
            });
        }
    );
};

// GET all bookings with technician and speaker names
const getAllBookings = (req, res) => {
    const sql = `
        SELECT
            b.id,
            b.technician_id,
            t.name AS technician_name,
            b.speaker_id,
            s.name AS speaker_name,
            b.booking_date,
            b.status
        FROM bookings b
        JOIN technicians t ON b.technician_id = t.id
        JOIN speakers s ON b.speaker_id = s.id
        ORDER BY b.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve bookings"
            });
        }

        res.status(200).json(rows);
    });
};

// GET booking by ID with technician and speaker names
const getBookingById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

    const sql = `
        SELECT
            b.id,
            b.technician_id,
            t.name AS technician_name,
            b.speaker_id,
            s.name AS speaker_name,
            b.booking_date,
            b.status
        FROM bookings b
        JOIN technicians t ON b.technician_id = t.id
        JOIN speakers s ON b.speaker_id = s.id
        WHERE b.id = ?
    `;

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve booking"
            });
        }

        if (!row) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        res.status(200).json(row);
    });
};

// UPDATE booking details
const updateBooking = (req, res) => {
    const id = Number(req.params.id);
    const { technician_id, speaker_id, booking_date } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

    if (
        !Number.isInteger(technician_id) || technician_id <= 0 ||
        !Number.isInteger(speaker_id) || speaker_id <= 0 ||
        typeof booking_date !== "string" || !booking_date.trim()
    ) {
        return res.status(400).json({
            error: "Valid technician_id, speaker_id and booking_date are required"
        });
    }

    db.run(
        `UPDATE bookings
         SET technician_id = ?, speaker_id = ?, booking_date = ?
         WHERE id = ?`,
        [technician_id, speaker_id, booking_date.trim(), id],
        function (err) {
            if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(400).json({
                        error: "Invalid technician_id or speaker_id"
                    });
                }

                return res.status(500).json({
                    error: "Failed to update booking"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Booking not found"
                });
            }

            res.status(200).json({
                message: "Booking updated successfully"
            });
        }
    );
};

// DELETE booking
const deleteBooking = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

    db.run(
        "DELETE FROM bookings WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Failed to delete booking"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Booking not found"
                });
            }

            res.status(200).json({
                message: "Booking deleted successfully"
            });
        }
    );
};

// UPDATE booking status with sequential validation
const updateBookingStatus = (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }

    if (!["approved", "done"].includes(status)) {
        return res.status(400).json({
            error: "Invalid status change"
        });
    }

    db.get(
        "SELECT status FROM bookings WHERE id = ?",
        [id],
        (err, booking) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to retrieve booking"
                });
            }

            if (!booking) {
                return res.status(404).json({
                    error: "Booking not found"
                });
            }

            const validTransition =
                (booking.status === "pending" && status === "approved") ||
                (booking.status === "approved" && status === "done");

            if (!validTransition) {
                return res.status(400).json({
                    error: "Invalid status change"
                });
            }

            db.run(
                "UPDATE bookings SET status = ? WHERE id = ?",
                [status, id],
                function (updateErr) {
                    if (updateErr) {
                        return res.status(500).json({
                            error: "Failed to update booking status"
                        });
                    }

                    res.status(200).json({
                        message: "Booking status updated successfully",
                        status
                    });
                }
            );
        }
    );
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    updateBookingStatus
};
