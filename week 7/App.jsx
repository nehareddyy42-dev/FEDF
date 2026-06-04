import { useState } from "react";
import StudentContext from "./StudentContext";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  return (
    <StudentContext.Provider value={{ students, setStudents }}>
      <div className="container">
        <div className="card">
         <h1>🎓 Student Management
           Dashboard</h1>
          <StudentForm />
          <StudentList />
        </div>
      </div>
    </StudentContext.Provider>
  );
}

export default App;
