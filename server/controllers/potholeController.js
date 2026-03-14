import Pothole from '../models/Pothole.js';
import { validationResult } from 'express-validator';
import { sendReportEmail } from '../utils/emailService.js';

// @desc    Report new pothole (From YOLO Python Script or Frontend)
// @route   POST /api/potholes/detect
// @access  Public
export const reportPothole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { latitude, longitude, severityLevel, confidence, imageUrl, description } = req.body;

  try {
    // 1. Save to Database
    const pothole = await Pothole.create({
      latitude,
      longitude,
      severityLevel,
      detectionConfidence: confidence,
      imageUrl,
      description,
      status: 'reported',
    });

    console.log("Process initiated: Report saved to database.");

    // 2. Wait 2 seconds as requested for simulation/auto-flow
    setTimeout(async () => {
      try {
        await sendReportEmail({
          latitude,
          longitude,
          severityLevel,
          imageUrl,
          description
        });
        console.log("Email sent and process logged successfully.");
      } catch (err) {
        console.error("Delayed email dispatch failed:", err.message);
      }
    }, 2000);

    res.status(201).json({
      message: "Report submitted and email sequence started",
      pothole,
      logs: ["Process initiated", "Persistence active", "Email queued for vikalpbordekar@gmail.com"]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error reporting pothole', error: error.message });
  }
};

// @desc    Get all potholes
// @route   GET /api/potholes
// @access  Public/Private (Dashboard view)
export const getPotholes = async (req, res) => {
  try {
    const { severityLevel, status } = req.query;
    
    // Build query
    const query = {};
    if (severityLevel) query.severityLevel = severityLevel;
    if (status) query.status = status;

    const potholes = await Pothole.find(query).sort({ detectedAt: -1 });
    res.json(potholes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching potholes', error: error.message });
  }
};

// @desc    Update pothole status
// @route   PATCH /api/potholes/:id/status
// @access  Private (Admin/Officer)
export const updatePotholeStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const pothole = await Pothole.findById(req.params.id);

    if (!pothole) {
      return res.status(404).json({ message: 'Pothole not found' });
    }

    if (!['reported', 'under_repair', 'fixed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    pothole.status = status;
    const updatedPothole = await pothole.save();

    res.json(updatedPothole);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating status', error: error.message });
  }
};
