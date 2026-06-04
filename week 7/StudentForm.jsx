import { useState, useContext } from "react";
import StudentContext from "../StudentContext";

function StudentForm() {
  const [name, setName] = useState("");
  const { students, setStudents } = useContext(StudentContext);

  const addStudent = () => {
    if (name.trim() === "") return;

    setStudents([...students, name]);
    setName("");
  };

  return (
    <div className="form-section">
      <h3>Add Student</h3>

      <input
        type="text"
        value={name}
        placeholder="Enter Student Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button className="add-btn" onClick={addStudent}>
        Add Student
      </button>
    </div>
  );
}

export default StudentForm;