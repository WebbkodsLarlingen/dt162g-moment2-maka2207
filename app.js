// Import and initialize Express listening on configured or port 3000
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Also import router file
const apiRouter = require("./routes/api");

// Redirect all incoming requsts to the API router
app.use("/api", apiRouter);

// When NOT using /api/{request} tell the user about it!
app.get("/", (req, res) => {
  res.send(
    "<h1>Jag är ett REST API, varför går du in på webbläsaren för?</h1><p>Använd /api/{request} istället!</p>"
  );
});

// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`NodeJS-server startad. Lyssnar på API CRUD på port: ${port}`);
});
