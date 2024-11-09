import React, { useState } from "react";
import "./Weather.css";
console.log("Environment Variables:", process.env);

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(""); // הוספת state לתמונת רקע
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // מפתח ה-API של OpenWeather
  const pexelsApiKey = process.env.REACT_APP_PEXELS_API_KEY; // מפתח ה-API של Pexels

  const fetchBackgroundImage = async (weatherType) => {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${weatherType}&per_page=1`,
        {
          headers: {
            Authorization: pexelsApiKey,
          },
        }
      );
      const data = await response.json();
      setBackgroundImage(data.photos[0].src.original); // קישור לתמונת הרקע
    } catch (error) {
      console.error("Error fetching background image from Pexels:", error);
    }
  };

  // פונקציה לקריאה ל-API שמביאה את נתוני מזג האוויר
  const fetchWeather = async () => {
    setLoading(true); // מתחילים טעינה
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      console.log(
        "OpenWeather API Key:",
        process.env.REACT_APP_OPENWEATHER_API_KEY
      );

      if (!response.ok) {
        throw new Error("עיר לא נמצאה, נסה שוב.");
      }
      const data = await response.json();
      setWeather(data);
      fetchBackgroundImage(data.weather[0].main); // קריאה לפונקציה לשליפת התמונה
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      alert(error.message); // הצגת הודעת שגיאה למשתמש
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    fetchWeather();
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1>בדיקת מזג אוויר</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="הכנס שם עיר"
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>חפש</button>
      </div>

      {loading ? (
        <p>טוען נתונים...</p>
      ) : (
        weather &&
        weather.main && (
          <div className="weather-info">
            <h2>מזג האוויר ב-{weather.name}</h2>
            <p>טמפרטורה: {weather.main.temp}°C</p>
            <p>תיאור: {weather.weather[0].description}</p>
            <p>לחות: {weather.main.humidity}%</p>
            <p>מהירות רוח: {weather.wind.speed} m/s</p>
            <p>תחושת קור: {weather.main.feels_like}°C</p>
            <p>עננות: {weather.clouds.all}%</p>
            <p>
              זריחת השמש:{" "}
              {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p>
              שקיעת השמש:{" "}
              {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default Weather;
