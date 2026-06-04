// RegistrationForm.jsx

import React, { useState } from "react";
import "./RegistrationForm.css";

function RegistrationForm() {

  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    skills: "",
    city: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    setSuccess(`
Student Registered Successfully!

Name : ${student.name}
Email : ${student.email}
Phone : ${student.phone}
Department : ${student.department}
Year : ${student.year}
Skills : ${student.skills}
City : ${student.city}
    `);

  };

  return (

    <div className="main-container">

      <div className="left-section">

        <h1>Welcome Student</h1>

        <p>
          Fill your details to complete the registration process.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="student"
        />

      </div>



      <div className="right-section">

        <h2>Registration Form</h2>



        <form onSubmit={handleSubmit}>


          <div className="input-box">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

          </div>



          <div className="input-box">

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />

          </div>



          <div className="input-box">

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />

          </div>



          <div className="input-box">

            <select
              name="department"
              onChange={handleChange}
            >

              <option>Select Department</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>Mechanical</option>

            </select>

          </div>



          <div className="input-box">

            <select
              name="year"
              onChange={handleChange}
            >

              <option>Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>

            </select>

          </div>



          <div className="input-box">

            <input
              type="text"
              name="skills"
              placeholder="Skills"
              onChange={handleChange}
            />

          </div>



          <div className="input-box">

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
            />

          </div>



          <button type="submit">

            Submit Registration

          </button>


        </form>



        <div className="output">

          <pre>{success}</pre>

        </div>


      </div>

    </div>

  );

}

export default RegistrationForm;