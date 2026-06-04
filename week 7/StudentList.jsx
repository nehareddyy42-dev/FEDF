import { useContext } from "react";
import StudentContext from "../StudentContext";

function StudentList() {
  const { students, setStudents } = useContext(StudentContext);

  const deleteStudent = (indexToDelete) => {
    const updatedStudents = students.filter(
      (_, index) => index !== indexToDelete
    );

    setStudents(updatedStudents);
  };

  return (
    <div className="list-section">
      <h3>Student List</h3>

      {students.length === 0 ? (
        <p>No Students Added</p>
      ) : (
        <ul>
          {students.map((student, index) => (
            <li key={index} className="student-item">
              <span>{student}</span>

              <button
                className="delete-btn"
                onClick={() => deleteStudent(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentList;