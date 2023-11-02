// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();

// Import file system module ('fs') and file pathing ('path') from NodeJS
// These are used to handle the `courses.json` file. Its path is stored in `coursesFile`
const fs = require("fs");
const path = require("path");
const coursesFile = path.join(__dirname, "../courses.json");
const backupFile = path.join(__dirname, "../courses-BACKUP.json");

// Helper function that just returns response code and json message to keep things DRY
function codeWithJSONRes(res, code, json) {
  return res.status(code).json(json);
}

// Here are the different CRUD routes where req = request being received
// and res = response being sent back for the request in question.

// RESET courses.json file by deleting it and making a copy of "courses-BACKUP.json" and renaming it to "courses.json"
router.get("/reset", (req, res) => {
  fs.unlink(coursesFile, function (err) {
    // If failed restoring, stop right here then
    if (err) {
      res.status(500).json({
        message: "Misslyckades på serversidan att återställa kurserna!",
      });
    }
    // Here if we succeded deleting courses.json file
    fs.copyFile(backupFile, coursesFile, (err) => {
      // If failed copying the backup file into a new courses.json file
      if (err) {
        res.status(500).json({
          message: "Misslyckades på serversidan att återställa kurserna!",
        });
      }
      // Otherwise we succeeded here!
      res.status(200).json({ message: "Kurserna återställda!" });
    });
  });
});

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

// DELETE one specific course
router.delete("/courses/:id", (req, res) => {
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

// UPDATE one specific course
router.put("/courses/:id", (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Ange ett id i heltal för kursen då ${req.params.id} ej är det.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }
  // Let's now check and make sure all JSON data are correct otherwise, there is no reason to read the file!
  // Checks for courseId
  if (!req.body.courseId) {
    return res.status(400).json({ message: "Ange en kurskod!" });
  }
  const regex = /^[A-Z]{2}\d{3}[A-Z]$/; // FORMAT: Two uppercase letters then 3 digits and then one uppercase letter
  if (!regex.test(req.body.courseId)) {
    return res.status(400).json({
      message:
        "Kurskod ska vara i formatet: IK060G (två stora bokstäver, tre siffror och sedan en stor bokstav i slutet)!",
    });
  }

  // Checks for course name
  if (!req.body.courseName) {
    return res.status(400).json({ message: "Ange ett kursnamn!" });
  }
  if (req.body.courseName.length <= 10) {
    return res.status(400).json({ message: "Kursnamnet är för kort!" });
  }

  // Checks for course period
  if (!req.body.coursePeriod) {
    return res.status(400).json({ message: "Ange en kursperiod!" });
  }
  if (!Number.isInteger(parseInt(req.body.coursePeriod))) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara ett heltal!" });
  }
  if (req.body.coursePeriod.length > 1) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara endast ett heltal!" });
  }

  // Here we can read the file trying to find the course with ":id"
  fs.readFile(coursesFile, (err, data) => {
    // Check if any errors appear (for example file not existing or wrong name was used)
    if (err) {
      res
        .status(500)
        .json({ message: "Kunde ej läsa filen. Kontakta ansvarig!" });
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
          // So let's now edit it

          // Now find the array element whose course._id matches the one in the req.params.id
          const correctcourse = courses.findIndex(
            (course) => course._id === parseInt(req.params.id)
          );
          // Then update it with new validated values!
          courses[correctcourse].courseId = req.body.courseId;
          courses[correctcourse].courseName = req.body.courseName;
          courses[correctcourse].coursePeriod = req.body.coursePeriod;

          // Then write to file to finish the updating
          fs.writeFile(coursesFile, JSON.stringify(courses), (err) => {
            // When error writing to the file for whatever reason
            if (err) {
              return res.status(500).json({
                message: "Misslyckades att uppdatera den lokala kursfilen",
              });
            } // Otherwise return 200 OK status with message about when success!
            else {
              return res
                .status(200)
                .json({ message: `Kurs med id:${req.params.id} uppdaterad!` });
            }
          });
        } // "else" means course with ":id" does NOT exist
        else {
          res.status(404).json({
            message: `Kursen med id: ${req.params.id} finns ej.`,
          });
        }
      } catch (err) {
        // Also catch any error while reading the JSON file
        res
          .status(500)
          .json({ message: "Kunde ej läsa filen. Kontakta ansvarig!" });
      }
    }
  });
});

// POST one new course
router.post("/courses", (req, res) => {
  // Begin validating JSON Body data before accessing file:
  // Checks for courseId
  if (!req.body.courseId) {
    return res.status(400).json({ message: "Ange en kurskod!" });
  }
  const regex = /^[A-Z]{2}\d{3}[A-Z]$/; // FORMAT: Two uppercase letters then 3 digits and then one uppercase letter
  if (!regex.test(req.body.courseId)) {
    return res.status(400).json({
      message:
        "Kurskod ska vara i formatet: IK060G (två stora bokstäver, tre siffror och sedan en stor bokstav i slutet)!",
    });
  }
  // Checks for course name
  if (!req.body.courseName) {
    return res.status(400).json({ message: "Ange ett kursnamn!" });
  }
  if (req.body.courseName.length <= 10) {
    return res.status(400).json({ message: "Kursnamnet är för kort!" });
  }
  // Checks for course period
  if (!req.body.coursePeriod) {
    return res.status(400).json({ message: "Ange en kursperiod!" });
  }
  if (!Number.isInteger(parseInt(req.body.coursePeriod))) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara ett heltal!" });
  }
  if (req.body.coursePeriod.length > 1) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara endast ett heltal!" });
  }

  // If we are here, all JSON Body data is Validated and OK for adding to course.json file so let's open it!
  fs.readFile(coursesFile, (err, data) => {
    // Check if any errors appear (for example file not existing or wrong name was used)
    if (err) {
      return res
        .status(500)
        .json({ message: "Kunde ej läsa filen. Kontakta ansvarig!" });
    }
    // Otherwise, let's keep moving forword with courses.json file!
    else {
      try {
        // Now we try grab the JSON data from the `courses.json`...
        const courses = JSON.parse(data);
        // Special case when entire file is empty of courses!
        if (courses.length == 0) {
          // Because it is empty we must add our own first _id value
          const newCourse = {
            _id: 1,
            courseId: req.body.courseId,
            courseName: req.body.courseName,
            coursePeriod: req.body.coursePeriod,
          };
          // Add new course to the `courses` variable.
          courses.push(newCourse);
          // Then write to the file and finish things up!
          fs.writeFile(coursesFile, JSON.stringify(courses), (err) => {
            // When error writing to the file for whatever reason
            if (err) {
              return res.status(500).json({
                message: "Misslyckades att lägga till kurs i kursfilen",
              });
            } // Otherwise return 200 OK status with message about when success!
            else {
              return res
                .status(200)
                .json({ message: `En kurs har lagts till!` });
            }
          });
        } // If there exists at least one course
        else {
          // Let's now find the course with the highest _id value!
          const highestId = courses.reduce((maxId, course) => {
            return course._id > maxId ? course._id : maxId;
          }, 0);
          // Then add 1 to that to increment the current _id index for the courses.json file!
          const newCourse = {
            _id: highestId + 1,
            courseId: req.body.courseId,
            courseName: req.body.courseName,
            coursePeriod: req.body.coursePeriod,
          };
          // Add new course to the `courses` variable.
          courses.push(newCourse);
          // Then write to the file and finish things up!
          fs.writeFile(coursesFile, JSON.stringify(courses), (err) => {
            // When error writing to the file for whatever reason
            if (err) {
              return res.status(500).json({
                message: "Misslyckades att lägga till kurs i kursfilen",
              });
            } // Otherwise return 200 OK status with message about when success!
            else {
              return res
                .status(200)
                .json({ message: `En kurs har lagts till!` });
            }
          });
        }
      } catch (e) {
        return res
          .status(500)
          .json({
            message:
              "Kunde ej skriva till filen (catch:ad). Kontakta ansvarig!",
          });
      }
    }
  });
});

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" responses for CRUD when someone is requesting something that does not exist.
router.get("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.put("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.post("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.patch("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.delete("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
