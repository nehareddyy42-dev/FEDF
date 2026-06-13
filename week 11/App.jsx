import BookingForm from "./components/BookingForm";
import "./App.css";

function App() {
  const airlineName = import.meta.env.VITE_AIRLINE_NAME;

  return (
    <div className="app">
      <h1>{airlineName}</h1>
      <BookingForm />
    </div>
  );
}

export default App;