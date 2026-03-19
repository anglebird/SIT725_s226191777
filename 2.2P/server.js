var express = require("express");
const path = require('path'); // Import path module for handling file paths
var app = express();

// Define the port (use environment variable if available, otherwise default to 3002)
var port = process.env.PORT || 3002;

// Serve static files from the "public" directory
// This allows the browser to access files like index.html via http://localhost:PORT
app.use(express.static(path.join(__dirname, 'public')));

// GET endpoint to add two numbers using query parameters
// Example usage: http://localhost:3002/add?a=10&b=15
app.get('/add', (req, res) => {
  // Retrieve and convert query parameters to numbers
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  
  // Validate inputs to ensure they are valid numbers
  if (isNaN(a) || isNaN(b)) {
    return res.send("Error: Please provide two valid numbers using query parameters 'a' and 'b'.");
  }
  
  // Perform the addition
  const sum = a + b;
  
  // Return the result as plain text
  res.send(`The sum of ${a} and ${b} is: ${sum}`);
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});