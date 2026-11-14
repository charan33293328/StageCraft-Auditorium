
const db = require("../config/database");

// GET /technicians
// Get all technicians
exports.getAllTechnicians = (req, res) => {
    db.all("SELECT * FROM technicians", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to retrieve technicians",
                error: err.message
            });
        }

        res.status(200).json(rows);
    });
};

// GET /technicians/:id
// Get one technician
exports.getTechnicianById = (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT * FROM technicians WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to retrieve technician",
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Technician not found"
                });
            }

            res.status(200).json(row);
        }
    );
};

// POST /technicians
// Add a new technician
exports.createTechnician = (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    const sql = `
        INSERT INTO technicians (name, email, phone)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [name.trim(), email.trim(), phone.trim()], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({
                    message: "Technician email already exists"
                });
            }

            return res.status(500).json({
                message: "Failed to create technician",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Technician created successfully",
            technician: {
                id: this.lastID,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim()
            }
        });
    });
};

// PUT /technicians/:id
// Update an existing technician
exports.updateTechnician = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    const sql = `
        UPDATE technicians
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
    `;

    db.run(sql, [name.trim(), email.trim(), phone.trim(), id], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({
                    message: "Technician email already exists"
                });
            }

            return res.status(500).json({
                message: "Failed to update technician",
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        res.status(200).json({
            message: "Technician updated successfully"
        });
    });
};

// DELETE /technicians/:id
// Delete a technician
exports.deleteTechnician = (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM technicians WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Failed to delete technician",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Technician not found"
                });
            }

            res.status(200).json({
                message: "Technician deleted successfully"
            });
        }
    );
};
