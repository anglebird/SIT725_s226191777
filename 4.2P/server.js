// Import required modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Initialize Express app and define port
const app = express();
const port = process.env.PORT || 3004;

// Middleware to serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/bmiDB");

// Event listener for successful database connection
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

// Event listener for database connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Define BMI schema (data structure for database)
const bmiSchema = new mongoose.Schema({
  height: {
    type: Number,
    required: true, // Height must be provided
  },
  weight: {
    type: Number,
    required: true, // Weight must be provided
  },
  bmi: {
    type: Number,
    required: true, // Calculated BMI value
  },
  status: {
    type: String,
    required: true, // BMI category (Normal, Overweight, etc.)
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically store creation time
  },
});

// Create model based on schema
const BMIRecord = mongoose.model("BMIRecord", bmiSchema);

// Route to serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST API: Calculate BMI and store the result in database
app.post("/api/calculate-bmi", async (req, res) => {
  try {
    // Extract height and weight from request body
    const height = parseFloat(req.body.height);
    const weight = parseFloat(req.body.weight);

    // Validate input values
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Please enter valid height and weight values.",
      });
    }

    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100));

    // Determine BMI category
    let status = "";
    if (bmi < 18.5) {
      status = "Underweight";
    } else if (bmi < 25) {
      status = "Normal";
    } else if (bmi < 30) {
      status = "Overweight";
    } else {
      status = "Obese";
    }

    // Create a new BMI record object
    const newRecord = new BMIRecord({
      height,
      weight,
      bmi: parseFloat(bmi.toFixed(2)), // Round BMI to 2 decimal places
      status,
    });

    // Save record to database
    await newRecord.save();

    // Send success response
    res.status(200).json({
      statusCode: 200,
      data: newRecord,
      message: "BMI calculated and saved successfully.",
    });

  } catch (error) {
    // Handle server errors
    res.status(500).json({
      statusCode: 500,
      message: "Server error while calculating BMI.",
      error: error.message,
    });
  }
});

// GET API: Retrieve all BMI records from database
app.get("/api/bmi-records", async (req, res) => {
  try {
    // Fetch records sorted by newest first
    const records = await BMIRecord.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      statusCode: 200,
      data: records,
      message: "BMI records retrieved successfully.",
    });

  } catch (error) {
    // Handle errors when fetching records
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching BMI records.",
      error: error.message,
    });
  }
});

// Health check endpoint to verify server is running
app.get("/health", (req, res) => {
  res.send("Server is healthy!");
});

// Start server only after database connection is established
mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`✅ App listening at: http://localhost:${port}`);
  });
});