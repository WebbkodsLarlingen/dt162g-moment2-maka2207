// Import and initialize Express listening on configured or port 3000
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");
const coursesFile = path.join(__dirname, "courses.json");

// Also import router file
const apiRouter = require("./routes/api");
// Use the "public" folder for web browser pages
app.use(express.static("public"));

// Use JSON Parser in Express so we can grab `req.body` JSON data
app.use(express.json());

// Redirect all incoming requsts to the API router
app.use("/api", apiRouter);

// FIXED: GET one specififc course with localhost:3000/courses/
app.get("/courses", (req, res) => {
  fs.readFile(coursesFile, (err, data) => {
    // Check if any errors appear (for example file not existing or wrong name was used)
    if (err) {
      res
        .status(500)
        .json({ message: "Couldn't read necessary file for some reason." });
    }
    // We run "else" when it did NOT fail for some reason to read the `courses.json`
    else {
      try {
        // Now we try grab the JSON data from the `courses.json`...
        const courses = JSON.parse(data);
        // ...and return it as partof the OK response
        res.status(200).json(courses);
      } catch (err) {
        // Or some error still occured so return that.
        res
          .status(500)
          .json({ message: "Couldn't read necessary file for some reason." });
      }
    }
  });
});

// FIXED: GET one specififc course with localhost:3000/courses/{id}
app.get("/courses/:id", (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Provide a number for the course! ${req.params.id} is not a number.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }
  // Here we can read the file trying to find the course with ":id"
  fs.readFile(coursesFile, (err, data) => {
    // Check if any errors appear (for example file not existing or wrong name was used)
    if (err) {
      res
        .status(500)
        .json({ message: "Couldn't read necessary file for some reason." });
    }
    // We run "else" when it did NOT fail for some reason to read the `courses.json`
    else {
      try {
        // Now we try grab the JSON data from the `courses.json`...
        const courses = JSON.parse(data);

        // Then search for the course in question by looking for array
        // element whose _id is equal to req.params.id (:id value).
        // We must parseInt to make the string into an integer.
        const course = courses.find(
          (result) => result._id === parseInt(req.params.id)
        );
        // if NOT undefined, that means course with ":id" exists
        if (course != undefined) {
          res.status(200).json(course);
        } // "else" means course with ":id" does NOT exist
        else {
          res.status(404).json({
            message: `Course doesn't with id: ${req.params.id} exist.`,
          });
        }
      } catch (err) {
        // Also catch any error while reading the JSON file
        res
          .status(500)
          .json({ message: "Couldn't read necessary file for some reason." });
      }
    }
  });
});

// Redirect all web browser requests to this page when they do NOT start with "/api/{url}"
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// FIXED: CAN NOW DELETE with localhost:3000/courses/{id}
app.delete("/courses/:id", (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Provide a number for the course! ${req.params.id} is not a number.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }
  // Here we can read the file trying to find the course with ":id"
  fs.readFile(coursesFile, (err, data) => {
    // Check if any errors appear (for example file not existing or wrong name was used)
    if (err) {
      res
        .status(500)
        .json({ message: "Couldn't read necessary file for some reason." });
    }
    // We run "else" when it did NOT fail for some reason to read the `courses.json`
    else {
      try {
        // Now we try grab the JSON data from the `courses.json`...
        const courses = JSON.parse(data);

        // Then search for the course in question by looking for array
        // element whose _id is equal to req.params.id (:id value).
        // We must parseInt to make the string into an integer.
        const course = courses.find(
          (result) => result._id === parseInt(req.params.id)
        );
        // if NOT undefined, that means course with ":id" exists
        // So, let's delete it from JSON file and send 200 OK that it was done!
        if (course != undefined) {
          // Beacuse req.params.id exists then we can safely remove that from the courses.JSON file

          // Now find the array element whose course._id matches the one in the req.params.id
          const correctcourse = courses.findIndex(
            (course) => course._id === parseInt(req.params.id)
          );

          // Splice that object from the array
          courses.splice(correctcourse, 1);

          // Then attempt to OVERWRITE courses.json with the new correct JSON data
          fs.writeFile(coursesFile, JSON.stringify(courses), (err) => {
            // When error writing to the file for whatever reason
            if (err) {
              res.status(500).json({
                message: "Misslyckades att uppdatera den lokala kursfilen",
              });
            } // Otherwise return 200 OK status with message about when success!
            else {
              res
                .status(200)
                .json({ message: `Kurs med id:${req.params.id} raderad!` });
            }
          });
        } // "else" means course with ":id" does NOT exist
        else {
          res.status(404).json({
            message: `Course with id: ${req.params.id} doesn't exist.`,
          });
        }
      } catch (err) {
        // Also catch any error while reading the JSON file
        res
          .status(500)
          .json({ message: "Couldn't read necessary file for some reason." });
      }
    }
  });
});

// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`NodeJS-server startad. Lyssnar på API CRUD på port: ${port}`);
});
