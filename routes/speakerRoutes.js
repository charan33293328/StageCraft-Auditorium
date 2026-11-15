
const express = require("express");
const router = express.Router();

const speakerController = require("../controllers/speakerController");

// Get all speakers and search by type
router.get("/", speakerController.getAllSpeakers);

// Get speaker by ID
router.get("/:id", speakerController.getSpeakerById);

// Create speaker
router.post("/", speakerController.createSpeaker);

// Update speaker
router.put("/:id", speakerController.updateSpeaker);

// Delete speaker
router.delete("/:id", speakerController.deleteSpeaker);

module.exports = router;
