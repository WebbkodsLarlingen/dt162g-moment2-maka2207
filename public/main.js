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
        tbody.innerHTML += `<tr><td contenteditable="true" data-courseidold="${data.courseId}">${data.courseId}</td>
  <td contenteditable="true" data-coursenameold="${data.courseName}">${data.courseName}</td>
  <td contenteditable="true" data-courseperiodold="${data.coursePeriod}">${data.coursePeriod}</td>
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
        tbody.innerHTML += `<tr><td contenteditable="true" data-courseidold="${course.courseId}">${course.courseId}</td>
  <td contenteditable="true" data-coursenameold="${course.courseName}">${course.courseName}</td>
  <td contenteditable="true" data-courseperiodold="${course.coursePeriod}">${course.coursePeriod}</td>
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
        return res.json().then((data) => {
          apistatus.innerHTML = data.message;
          // If Method was PUT and it was denied we also need to change back previos values which we have stored in data attributes!
          if (method.toUpperCase() == "PUT") {
            // So, grab the correct row by using `_id` value from `url`
            const correctrowId = url.split(
              "http://localhost:3000/api/courses/"
            )[1];
            // Then grab that row
            const correctRow = document
              .querySelector(`[data-deletecourse="${correctrowId}"]`)
              .closest("tr");
            // And reset the old values stored in their "data-{}old" attributes!
            correctRow.children[0].textContent =
              correctRow.children[0].dataset.courseidold;
            correctRow.children[1].textContent =
              correctRow.children[1].dataset.coursenameold;
            correctRow.children[2].textContent =
              correctRow.children[2].dataset.courseperiodold;
          }
        });
      }
      // When response is OK, just fetch the current courses!
      if (res.ok) {
        return res.json().then((data) => {
          apistatus.innerHTML = data.message;
          loadCourses();
          // If method was POST also clear input fields after success
          if (method.toUpperCase() == "POST") {
            document.forms[0][0].value = "";
            document.forms[0][1].value = "";
            document.forms[0][2].value = "";
          }
          // IF method was PUT
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
    e.preventDefault(); // Don't reload page
    addcourse(); // Run add course function!
  });

  // Listen for changing the content of the <td> that have contenteditable enabled
  // by listening for when it leaves focus which can only happen after first entering it
  tbody.addEventListener("focusout", (e) => {
    if (e.target.tagName === "TD" && e.target.isContentEditable) {
      // Grab the entire row and send that to modifyCourse function!
      const evt = e.target.closest("tr");
      modifyCourse(evt);
    }
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
function addcourse() {
  // Grab Form and then create body JSON out of its values in its input fields!
  const form = document.forms[0];
  const bodyJSON = {
    courseId: form[0].value,
    courseName: form[1].value,
    coursePeriod: form[2].value,
  };
  // Send POST to CUD function (Create, Update, Delete with Fetch())
  CUD("POST", "http://localhost:3000/api/courses", bodyJSON);
  // The "CUD" function will reload courses if response OK!
}

// Update course when editing in contenteditable <td> elements under <tbody> element!
function modifyCourse(evt) {
  // Grab textContent from the <td> elements from that <tr>
  let courseIdContent = evt.children[0].textContent;
  let courseNameContent = evt.children[1].textContent;
  let coursePeriodContent = evt.children[2].textContent;
  let courseidvalue = evt.children[3].dataset.deletecourse;

  // And put them into Body JSON to send!
  const bodyJSON = {
    _id: courseidvalue,
    courseId: courseIdContent,
    courseName: courseNameContent,
    coursePeriod: coursePeriodContent,
  };
  CUD("PUT", `http://localhost:3000/api/courses/${courseidvalue}`, bodyJSON);
  console.log(bodyJSON);
}
