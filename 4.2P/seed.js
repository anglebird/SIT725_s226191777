// Import mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/bmiDB");

// Define schema for BMI records
const bmiSchema = new mongoose.Schema({
  height: Number,      // Height in cm
  weight: Number,      // Weight in kg
  bmi: Number,         // Calculated BMI value
  status: String,      // BMI category (Normal, Overweight, etc.)
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation time
  },
});

// Create model based on schema
const BMIRecord = mongoose.model("BMIRecord", bmiSchema);

// Sample data to populate the database
const sampleData = [
  {
    height: 170,
    weight: 65,
    bmi: 22.49,
    status: "Normal",
  },
  {
    height: 180,
    weight: 85,
    bmi: 26.23,
    status: "Overweight",
  },
  {
    height: 160,
    weight: 45,
    bmi: 17.58,
    status: "Underweight",
  },
];

// Insert sample data into database
BMIRecord.insertMany(sampleData)
  .then(() => {
    console.log("✅ Sample BMI data inserted successfully");
    mongoose.connection.close(); // Close database connection after insertion
  })
  .catch((err) => {
    console.error("❌ Error inserting sample data:", err);
    mongoose.connection.close(); // Ensure connection is closed even if error occurs
  });