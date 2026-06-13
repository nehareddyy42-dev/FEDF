import { useState } from "react";

function BookingForm() {
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const randomPrice = Math.floor(Math.random() * 5000) + 2000;
    setPrice(randomPrice);

    setMessage(`
Passenger: ${name}
Route: ${source} ✈ ${destination}
Date: ${travelDate}
Ticket Price: ₹${randomPrice}
Status: Confirmed ✅
    `);
  };

  const handleReset = () => {
    setName("");
    setSource("");
    setDestination("");
    setTravelDate("");
    setMessage("");
    setPrice("");
  };

  return (
    <div className="booking-container">
      <h2>✈ Flight Booking</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Passenger Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Source City"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Destination City"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          required
        />

        <div className="buttons">
          <button type="submit">Book Ticket</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {source && destination && (
        <div className="route-preview">
          <p>
            Route Preview: {source} ➜ {destination}
          </p>
        </div>
      )}

      {message && (
        <div className="ticket-card">
          <h3>Booking Confirmation</h3>
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
}

export default BookingForm;