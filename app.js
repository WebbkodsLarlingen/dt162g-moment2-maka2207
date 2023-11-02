// Import and initialize Express listening on configured or port 3000
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
// Also import router file
const apiRouter = require("./routes/api");
// Use the "public" folder for web browser pages
app.use(express.static("public"));

// Redirect all incoming requsts to the API router
app.use("/api", apiRouter);

// Redirect all web browser requests to this page when they do NOT start with "/api/{url}"
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`NodeJS-server startad. Lyssnar på API CRUD på port: ${port}`);
});
