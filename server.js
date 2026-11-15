
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
require("./config/database");

// Technician routes
const technicianRoutes = require("./routes/technicianRoutes");
app.use("/technicians", technicianRoutes);

// Speaker routes
const speakerRoutes = require("./routes/speakerRoutes");
app.use("/speakers", speakerRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "StageCraft Auditorium API is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
