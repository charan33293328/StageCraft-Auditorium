
const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// Get all bookings with technician and speaker names
router.get("/", bookingController.getAllBookings);

// Get booking by ID
router.get("/:id", bookingController.getBookingById);

// Update booking details
router.put("/:id", bookingController.updateBooking);

// Delete booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
