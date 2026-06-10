import React, { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

// ─── WMO Weather Code → emoji + label ────────────────────────────────────────
const WMO = {
  0:  { emoji: "☀️",  label: "Clear Sky" },
  1:  { emoji: "🌤️", label: "Mainly Clear" },
  2:  { emoji: "⛅",  label: "Partly Cloudy" },
  3:  { emoji: "☁️",  label: "Overcast" },
  45: { emoji: "🌫️", label: "Fog" },
  48: { emoji: "🌫️", label: "Rime Fog" },
  51: { emoji: "🌦️", label: "Light Drizzle" },
  53: { emoji: "🌦️", label: "Moderate Drizzle" },
  55: { emoji: "🌧️", label: "Dense Drizzle" },
  61: { emoji: "🌧️", label: "Light Rain" },
  63: { emoji: "🌧️", label: "Moderate Rain" },
  65: { emoji: "🌧️", label: "Heavy Rain" },
  71: { emoji: "🌨️", label: "Light Snow" },
  73: { emoji: "🌨️", label: "Moderate Snow" },
  75: { emoji: "❄️",  label: "Heavy Snow" },
  77: { emoji: "🌨️", label: "Snow Grains" },
  80: { emoji: "🌦️", label: "Light Showers" },
  81: { emoji: "🌧️", label: "Moderate Showers" },
  82: { emoji: "⛈️",  label: "Heavy Showers" },
  85: { emoji: "🌨️", label: "Snow Showers" },
  86: { emoji: "🌨️", label: "Heavy Snow Showers" },
  95: { emoji: "⛈️",  label: "Thunderstorm" },
  96: { emoji: "⛈️",  label: "Thunderstorm + Hail" },
  99: { emoji: "⛈️",  label: "Heavy Thunderstorm" },
};

const getWMO = (code) => WMO[code] ?? { emoji: "🌡️", label: "Unknown" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toF = (c) => Math.round((c * 9) / 5 + 32);
const fmt  = (c, unit) => (unit === "F" ? toF(c) : Math.round(c));

const fmtHour = (iso) => {
  const d = new Date(iso);
  const h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12} ${ampm}`;
};

const fmtDay = (dateStr) => {
  const d   = new Date(dateStr + "T00:00:00");
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  return d.toLocaleDateString("en-US", { weekday: "long" });
};

const windDirLabel = (deg) => {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
};

// ─── SVG Icons (small utilities) ─────────────────────────────────────────────
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconLocate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ─── Default saved cities ─────────────────────────────────────────────────────
const DEFAULT_CITIES = [
  { name: "Hyderabad", country: "India",          lat: 17.385, lon: 78.4867 },
  { name: "Mumbai",    country: "India",          lat: 19.076,  lon: 72.8777 },
  { name: "Delhi",     country: "India",          lat: 28.6139, lon: 77.209  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Weather() {
  const [loc, setLoc]           = useState(DEFAULT_CITIES[0]);
  const [weather, setWeather]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [unit, setUnit]         = useState("C");
  const [query, setQuery]       = useState("");
  const [suggestions, setSuggs] = useState([]);
  const [cities, setCities]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("wth_cities")) || DEFAULT_CITIES; }
    catch { return DEFAULT_CITIES; }
  });

  const searchRef   = useRef(null);
  const debounceRef = useRef(null);

  // Persist cities
  useEffect(() => {
    localStorage.setItem("wth_cities", JSON.stringify(cities));
  }, [cities]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggs([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch weather from Open-Meteo ─────────────────────────────────────────
  const fetchWeather = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError("");
    try {
      const url = [
        "https://api.open-meteo.com/v1/forecast",
        `?latitude=${latitude}&longitude=${longitude}`,
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m",
        ",weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day",
        "&hourly=temperature_2m,weather_code",
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        "&timezone=auto&forecast_days=7",
      ].join("");

      const res  = await fetch(url);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      // Find current hour index in hourly array
      const curTime    = data.current.time;           // "2025-06-08T11:00"
      const curHourPfx = curTime.substring(0, 13);    // "2025-06-08T11"
      let startIdx     = data.hourly.time.findIndex((t) => t.startsWith(curHourPfx));
      if (startIdx < 0) startIdx = 0;

      const hourly = data.hourly.time
        .slice(startIdx, startIdx + 24)
        .map((t, i) => ({
          time : t,
          temp : data.hourly.temperature_2m[startIdx + i],
          code : data.hourly.weather_code[startIdx + i],
        }));

      const daily = data.daily.time.map((d, i) => ({
        date  : d,
        code  : data.daily.weather_code[i],
        hi    : data.daily.temperature_2m_max[i],
        lo    : data.daily.temperature_2m_min[i],
        rain  : data.daily.precipitation_sum[i],
      }));

      setWeather({
        temp      : data.current.temperature_2m,
        feelsLike : data.current.apparent_temperature,
        humidity  : data.current.relative_humidity_2m,
        windSpeed : data.current.wind_speed_10m,
        windDir   : data.current.wind_direction_10m,
        uvIndex   : Math.round(data.current.uv_index ?? 0),
        code      : data.current.weather_code,
        isDay     : data.current.is_day,
        hourly,
        daily,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount & when loc changes
  useEffect(() => { fetchWeather(loc.lat, loc.lon); }, [loc, fetchWeather]);

  // ── City search via Open-Meteo geocoding ──────────────────────────────────
  const handleQuery = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSuggs([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val)}&count=6&language=en&format=json`
        );
        const d = await r.json();
        setSuggs(d.results || []);
      } catch { setSuggs([]); }
    }, 280);
  };

  const selectSuggestion = (s) => {
    const newLoc = { name: s.name, country: s.country || "", lat: s.latitude, lon: s.longitude };
    setLoc(newLoc);
    setQuery("");
    setSuggs([]);
  };

  // ── GPS locate ────────────────────────────────────────────────────────────
  const handleLocate = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        let name = "My Location", country = "";
        try {
          const r = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=&count=1&format=json`
          );
          // Use BigDataCloud reverse geocoding (free, no key)
          const rv = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const rv_data = await rv.json();
          name    = rv_data.city || rv_data.locality || "My Location";
          country = rv_data.countryName || "";
        } catch {}
        setLoc({ name, country, lat: coords.latitude, lon: coords.longitude });
      },
      () => {
        setError("Location access was denied.");
        setLoading(false);
      }
    );
  };

  // ── Saved cities management ───────────────────────────────────────────────
  const isCurrentSaved = cities.some((c) => c.lat === loc.lat && c.lon === loc.lon);

  const toggleSave = () => {
    if (isCurrentSaved) {
      setCities((prev) => prev.filter((c) => !(c.lat === loc.lat && c.lon === loc.lon)));
    } else {
      setCities((prev) => [...prev, loc]);
    }
  };

  const removeCity = (e, city) => {
    e.stopPropagation();
    setCities((prev) => prev.filter((c) => !(c.lat === city.lat && c.lon === city.lon)));
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="site-header">
        <div className="site-logo">
          <span className="site-logo-icon">🌤️</span>
          <span className="site-logo-text">Sky<span>Cast</span></span>
        </div>

        {/* Search */}
        <div className="search-wrap" ref={searchRef}>
          <div className="search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={handleQuery}
              aria-label="Search for a city"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((s, i) => (
                <li key={i} className="suggestion-item" onClick={() => selectSuggestion(s)}>
                  <div className="sug-city">{s.name}</div>
                  <div className="sug-region">
                    {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Controls */}
        <div className="header-controls">
          <button className="ctrl-btn" onClick={handleLocate} title="Use my location" aria-label="Detect location">
            <IconLocate />
          </button>
          <button className="ctrl-btn" onClick={() => fetchWeather(loc.lat, loc.lon)} title="Refresh" aria-label="Refresh weather">
            <IconRefresh />
          </button>
          <div className="unit-switcher">
            <button className={`unit-opt ${unit === "C" ? "on" : ""}`} onClick={() => setUnit("C")}>°C</button>
            <button className={`unit-opt ${unit === "F" ? "on" : ""}`} onClick={() => setUnit("F")}>°F</button>
          </div>
        </div>
      </header>

      {/* ── Saved cities chips ─────────────────────────────────────────── */}
      {cities.length > 0 && (
        <div className="quick-cities">
          <span className="qc-label">Saved</span>
          {cities.map((city, i) => {
            const active = city.lat === loc.lat && city.lon === loc.lon;
            return (
              <button
                key={i}
                className={`qc-chip ${active ? "active" : ""}`}
                onClick={() => setLoc(city)}
              >
                {city.name}
                <span className="qc-remove" onClick={(e) => removeCity(e, city)} title="Remove">×</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────────── */}
      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <p className="loading-txt">Fetching weather data…</p>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="card error-wrap">
          <span className="error-emoji">⚠️</span>
          <p className="error-title">Something went wrong</p>
          <p className="error-msg">{error}</p>
          <button className="retry-btn" onClick={() => fetchWeather(loc.lat, loc.lon)}>
            Try Again
          </button>
        </div>
      )}

      {/* ── Dashboard ───────────────────────────────────────────────────── */}
      {!loading && !error && weather && (
        <div className="weather-grid">

          {/* LEFT — current conditions */}
          <div className="card current-card">
            <div className="current-location">
              <span className="current-city">{loc.name}</span>
              <button
                className="fav-btn"
                onClick={toggleSave}
                title={isCurrentSaved ? "Remove from saved" : "Save city"}
                aria-label="Toggle saved city"
              >
                {isCurrentSaved ? "🔖" : "📌"}
              </button>
            </div>
            <div className="current-country">{loc.country}</div>

            <span className="current-weather-icon">
              {getWMO(weather.code).emoji}
            </span>

            <div className="current-temp">
              {fmt(weather.temp, unit)}<sup>°{unit}</sup>
            </div>
            <div className="current-desc">{getWMO(weather.code).label}</div>

            <div className="current-hi-lo">
              <span>
                <span className="hi">↑</span>
                {fmt(weather.daily[0]?.hi ?? weather.temp, unit)}°
              </span>
              <span>
                <span className="lo">↓</span>
                {fmt(weather.daily[0]?.lo ?? weather.temp, unit)}°
              </span>
            </div>
          </div>

          {/* RIGHT column */}
          <div className="right-col">

            {/* Stats strip */}
            <div className="stats-strip">
              <div className="stat-cell">
                <span className="stat-icon">🌡️</span>
                <span className="stat-label">Feels Like</span>
                <span className="stat-value">{fmt(weather.feelsLike, unit)}°</span>
              </div>
              <div className="stat-cell">
                <span className="stat-icon">💧</span>
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.humidity}%</span>
              </div>
              <div className="stat-cell">
                <span className="stat-icon">💨</span>
                <span className="stat-label">Wind</span>
                <span className="stat-value">{weather.windSpeed} <small>km/h</small></span>
              </div>
              <div className="stat-cell">
                <span className="stat-icon">☀️</span>
                <span className="stat-label">UV Index</span>
                <span className="stat-value">{weather.uvIndex}</span>
              </div>
            </div>

            {/* Hourly forecast */}
            <div className="card section-card">
              <p className="sec-title">Hourly Forecast (24 h)</p>
              <div className="hourly-list">
                {weather.hourly.map((h, i) => (
                  <div key={i} className="hourly-item">
                    <span className="hourly-time">{i === 0 ? "Now" : fmtHour(h.time)}</span>
                    <span className="hourly-emoji">{getWMO(h.code).emoji}</span>
                    <span className="hourly-temp">{fmt(h.temp, unit)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="card section-card">
              <p className="sec-title">7-Day Forecast</p>
              <div className="daily-list">
                {weather.daily.map((d, i) => (
                  <div key={i} className="daily-row">
                    <span className="daily-day">{fmtDay(d.date)}</span>
                    <span className="daily-icon">{getWMO(d.code).emoji}</span>
                    <span className="daily-desc">{getWMO(d.code).label}</span>
                    <div className="daily-temps">
                      <span className="daily-hi">{fmt(d.hi, unit)}°</span>
                      <span className="daily-lo">{fmt(d.lo, unit)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        Weather data provided by{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
        {" "}· Free & open-source weather API · No API key required
      </footer>
    </div>
  );
}