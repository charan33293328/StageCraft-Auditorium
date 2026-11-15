
const db = require("../config/database");

// GET all speakers with optional type search
const getAllSpeakers = (req, res) => {
    const { type } = req.query;

    let sql = "SELECT * FROM speakers";
    let params = [];

    if (type) {
        sql += " WHERE type LIKE ?";
        params.push(`%${type}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve speakers"
            });
        }

        res.status(200).json(rows);
    });
};

// GET speaker by ID
const getSpeakerById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid speaker ID"
        });
    }

    db.get(
        "SELECT * FROM speakers WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to retrieve speaker"
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: "Speaker not found"
                });
            }

            res.status(200).json(row);
        }
    );
};

// CREATE speaker
const createSpeaker = (req, res) => {
    const { name, type } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof type !== "string" || !type.trim()
    ) {
        return res.status(400).json({
            error: "Speaker name and type are required"
        });
    }

    db.run(
        "INSERT INTO speakers (name, type) VALUES (?, ?)",
        [name.trim(), type.trim()],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Failed to create speaker"
                });
            }

            res.status(201).json({
                message: "Speaker created successfully",
                id: this.lastID,
                name: name.trim(),
                type: type.trim()
            });
        }
    );
};

// UPDATE speaker
const updateSpeaker = (req, res) => {
    const id = Number(req.params.id);
    const { name, type } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid speaker ID"
        });
    }

    if (
        typeof name !== "string" || !name.trim() ||
        typeof type !== "string" || !type.trim()
    ) {
        return res.status(400).json({
            error: "Speaker name and type are required"
        });
    }

    db.run(
        "UPDATE speakers SET name = ?, type = ? WHERE id = ?",
        [name.trim(), type.trim(), id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Failed to update speaker"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Speaker not found"
                });
            }

            res.status(200).json({
                message: "Speaker updated successfully"
            });
        }
    );
};

// DELETE speaker
const deleteSpeaker = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid speaker ID"
        });
    }

    db.run(
        "DELETE FROM speakers WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(409).json({
                        error: "Cannot delete speaker because it is associated with existing bookings"
                    });
                }

                return res.status(500).json({
                    error: "Failed to delete speaker"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Speaker not found"
                });
            }

            res.status(200).json({
                message: "Speaker deleted successfully"
            });
        }
    );
};

module.exports = {
    getAllSpeakers,
    getSpeakerById,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker
};
