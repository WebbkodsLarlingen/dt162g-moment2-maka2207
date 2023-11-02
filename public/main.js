// Load JS code to load the courses from the NODE REST API WEB SERVICE!
"use strict";
// Grab <tbody> element
const tbody = document.getElementById("tb");

// Grab <p> element where messages for API is shown
const apistatus = document.getElementById("status");

// Grab reset button "Återställ allt" which tells the REST API to restore the courses.json file
const reset = document.getElementById("resetcourses");

// Grab "Lägg till kurs" button to add courses
const addcourseBtn = document.getElementById("postCourse");

// FUNCTION: Fetch one course base on the URL /courses/:id
function loadcourse(url) {
  // Grab the id for the course
  const realurl = url.split("http://localhost:3000/courses/");
  console.log(realurl);
  fetch("http://localhost:3000/api/courses/" + realurl[1])
    .then((res) => res.json())
    .then((data) => {
      // First empty tbody element
      tbody.innerHTML = "";
      if (!data.message) {
        // Next loop through it from courses JSON data
        tbody.innerHTML += `<tr><td>${data.courseId}</td>
  <td>${data.courseName}</td>
  <td>${data.coursePeriod}</td>
  <td style="text-align:center;"data-deletecourse="${data._id}">🗑️</td></tr>`;
      } else {
        apistatus.innerHTML = "Kursen du navigerade till finns inte!";
      }
    });
}
// FUNCTION: Fetch current courses from courses.json file from REST API
// This function is called after each PUT, DELETE & POST HTTP request!
function loadCourses() {
  // Fetch current courses and send them ot the loadCourses function
  fetch("http://localhost:3000/api/courses")
    .then((res) => res.json())
    .then((data) => {
      // First empty tbody element
      tbody.innerHTML = "";
      // Next loop through it from courses JSON data
      data.forEach((course) => {
        tbody.innerHTML += `<tr><td>${course.courseId}</td>
  <td>${course.courseName}</td>
  <td>${course.coursePeriod}</td>
  <td style="text-align:center;"data-deletecourse="${course._id}">🗑️</td></tr>`;
      });
    });
}
// Function for CUD(=Create,Update,Delete) using fetch()
function CUD(method, url, jsonbody = null) {
  // Headers that are always included
  const headers = {
    "Content-Type": "application/json",
  };

  // Dynamic headers where method is the one being sent(PUT,DELETE,POST)
  const options = {
    method: method,
    headers: headers,
  };

  // Add JSON when it is provided which it should or the API will complain
  if (jsonbody) {
    options.body = JSON.stringify(jsonbody);
  }

  // Then finally make the fetch request:
  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => (apistatus.innerHTML = data.message));
      }
      // When response is OK, just fetch the current courses!
      if (res.ok) {
        return res.json().then((data) => {
          apistatus.innerHTML = data.message;
          loadCourses();
        });
      }
    })
    .catch((err) => {
      apistatus.innerHTML = "Något gick fel. Kontakta ansvarig!";
    });
}

// Run the following JS code after DOM being loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if window is just looking for all courses
  const currentUrl = window.location.href;
  if (
    currentUrl == "http://localhost:3000/courses/" ||
    currentUrl == "http://localhost:3000" ||
    currentUrl == "http://localhost:3000/"
  ) {
    // Thus load ALL courses from REST API
    loadCourses(); // Load current courses after DOM content loaded!
  } else {
    // Otherwise check if they wrote http://localhost:3000/courses/{integer}
    if (
      currentUrl.includes("http://localhost:3000/courses/") &&
      Number.isInteger(
        parseInt(currentUrl.split("http://localhost:3000/courses/")[1])
      )
    ) {
      // When it is an integer load just that course for tabel!
      loadcourse(currentUrl);
    } else {
      // Otherwise load all courses as usual
      loadCourses();
      // And show that also in browser
      window.history.pushState(null, null, "/courses/");
      apistatus.innerHTML = "Ange ett nummer för du vill navigera till!";
    }
  }

  // Listen for clicking on deleting courses (only "Hantera" td elements!)
  tbody.addEventListener("click", (e) => {
    // Is clicked a trash can <td>?
    if (e.target.dataset.deletecourse) {
      // Then try delete that course!
      const courseid = e.target.dataset.deletecourse;
      deleteCourse(courseid);
    } // Otherwise ignore click
    else {
      return;
    }
  });
  // Listening for clicks on "Återställ allt"
  reset.addEventListener("click", (e) => {
    resetCourses(); // Reset courses by calling /api/reset GET request
  });

  // Listening for clicks on "Lägg till kurs"
  addcourseBtn.addEventListener("click", (e) => {
    addcourse();
  });
});

// Delete selected courses:"id" is the data-deletecourse='id' value
function deleteCourse(id) {
  CUD("DELETE", `http://localhost:3000/api/courses/${id}`);
}

// Reset courses by calling /api/reset GET request
function resetCourses() {
  // This is ran when clicking on "Återställ allt"
  fetch("http://localhost:3000/api/reset")
    .then((res) => {
      if (res.ok) {
        apistatus.innerHTML = "Kurserna omladdade!";
        loadCourses();
      } else {
        apistatus.innerHTML = "Något gick fel. Kontakta ansvarig!";
      }
    })
    .catch((err) => {
      apistatus.innerHTML = "Något gick fel. Kontakta ansvarig!";
    });
}

// Add course by sending form data from "Kurskod", "Kursnamn" & "Kursperiod"
function addcourse() {}
