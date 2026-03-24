import React, { useState } from 'react';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError('Enter a city name to get the weather.');
      setWeather(null);
      return;
    }

    const apiKey = process.env.REACT_APP_API_KEY;

    if (!apiKey) {
      setError('Missing API key. Add REACT_APP_API_KEY to your environment variables.');
      setWeather(null);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric`;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to fetch weather data.');
      }

      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Something went wrong while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const weatherDetails = weather
    ? [
        {
          label: 'Feels like',
          value: `${Math.round(weather.main.feels_like)}°C`,
        },
        {
          label: 'Humidity',
          value: `${weather.main.humidity}%`,
        },
        {
          label: 'Wind',
          value: `${Math.round(weather.wind.speed)} m/s`,
        },
        {
          label: 'High / Low',
          value: `${Math.round(weather.main.temp_max)}° / ${Math.round(weather.main.temp_min)}°`,
        },
      ]
    : [];

  return (
    <div className="weather-shell">
      <div className="weather-card">
        <div className="weather-card__header">
          <p className="weather-eyebrow">Live weather</p>
          <h1>Weather Dashboard</h1>
          <p className="weather-subtitle">
            Search any city to see the current temperature, conditions, and key details.
          </p>
        </div>

        <form className="weather-search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
            aria-label="City name"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>

        {error && <div className="weather-message weather-message--error">{error}</div>}

        {!weather && !error && !loading && (
          <div className="weather-empty-state">
            <div className="weather-empty-state__icon">☁️</div>
            <p>Start by searching for a city like New York, London, or Tokyo.</p>
          </div>
        )}

        {weather && (
          <div className="weather-results">
            <div className="weather-main">
              <div>
                <p className="weather-location">
                  {weather.name}, {weather.sys.country}
                </p>
                <h2>{Math.round(weather.main.temp)}°C</h2>
                <p className="weather-description">
                  {weather.weather[0].description}
                </p>
              </div>

              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>

            <div className="weather-details-grid">
              {weatherDetails.map((item) => (
                <div className="weather-detail-card" key={item.label}>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
