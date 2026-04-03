const express = require("express");
const path = require("path");

const booksRoutes = require("./routes/books.routes");

const app = express();
const PORT = 3005;

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/books", booksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});