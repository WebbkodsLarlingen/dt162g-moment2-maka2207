// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();

// Import file system module ('fs') and file pathing ('path') from NodeJS
// These are used to handle the `courses.json` file. Its path is stored in `coursesFile`
const fs = require("fs");
const path = require("path");
const coursesFile = path.join(__dirname, "../courses.json");

// Helper function that just returns response code and json message to keep things DRY
function codeWithJSONRes(res, code, json) {
  return res.status(code).json(json);
}

// Here are the different CRUD routes where req = request being received
// and res = response being sent back for the request in question.
// GET all courses
router.get("/courses", (req, res) => {
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

// GET one specififc course
router.get("/courses/:id", (req, res) => {
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

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" response when someone is requesting something that does not exist.
router.get("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
