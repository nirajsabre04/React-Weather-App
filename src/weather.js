import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './weather.css';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for light and dark modes

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const weatherRef = useRef(null);

  const getWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: 'metric',
          },
        }
      );
      setWeather(weatherResponse.data);
      // Automatically scroll to the weather info section
      if (weatherRef.current) {
        weatherRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error fetching the weather data:', err);
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try again.');
      } else if (err.response && err.response.status === 401) {
        setError('Invalid API key. Please check your credentials.');
      } else {
        setError('An error occurred while fetching the data.');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
    document.body.classList.toggle('light-mode', isDarkMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="weather-container">
            <div className="mode-toggle">
        <div className="dark-mode-icon" onClick={toggleDarkMode}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>
      <h1>Weather App</h1>
      {/* <div className="mode-toggle">
        <div className="dark-mode-icon" onClick={toggleDarkMode}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div> */}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            getWeather();
          }
        }}
      />
      <button onClick={getWeather}>Get Weather</button>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className={`weather-info ${isDarkMode ? 'dark-mode' : 'light-mode'}`} ref={weatherRef}>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>
            Sunrise:{' '}
            {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>
            Sunset:{' '}
            {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default Weather;
