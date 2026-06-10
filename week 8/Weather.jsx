import React, { useState, useEffect } from "react";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=17.38&longitude=78.48&current_weather=true"
      );

      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }

      const data = await response.json();

      setWeather(data.current_weather);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(() => {
      fetchWeather();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <h2 className="loading">Loading Weather Information...</h2>;
  }

  if (error) {
    return <h2 className="error">Error: {error}</h2>;
  }

  return (
    <div className="weather-container">
      <h1>🌤 Weather Information System</h1>

      <h3>📍 Hyderabad</h3>

      <div className="weather-card">
        <p>🌡 Temperature</p>
        <h2>{weather.temperature} °C</h2>
      </div>

      <div className="weather-card">
        <p>💨 Wind Speed</p>
        <h2>{weather.windspeed} km/h</h2>
      </div>

      <div className="weather-card">
        <p>🧭 Wind Direction</p>
        <h2>{weather.winddirection}°</h2>
      </div>

      <p className="time">
        🕒 Current Time: {new Date().toLocaleString()}
      </p>

      <p className="time">
        ⏰ Last Updated: {lastUpdated}
      </p>

      <button className="refresh-btn" onClick={fetchWeather}>
        🔄 Refresh Weather
      </button>
    </div>
  );
}

export default Weather;