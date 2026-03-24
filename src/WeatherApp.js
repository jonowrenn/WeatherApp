import React, { useMemo, useState } from 'react';

const QUICK_CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'San Francisco'];

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const themeClass = useMemo(() => {
    const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';

    if (condition.includes('clear')) return 'theme-clear';
    if (condition.includes('cloud')) return 'theme-clouds';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'theme-rain';
    if (condition.includes('snow')) return 'theme-snow';
    if (condition.includes('thunder')) return 'theme-storm';

    return 'theme-default';
  }, [weather]);

  const fetchWeatherData = async (cityOverride) => {
    const trimmedCity = (cityOverride ?? city).trim();

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

      setCity(trimmedCity);
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
        {
          label: 'Pressure',
          value: `${weather.main.pressure} hPa`,
        },
        {
          label: 'Visibility',
          value: `${(weather.visibility / 1000).toFixed(1)} km`,
        },
      ]
    : [];

  return (
    <div className={`weather-shell ${themeClass}`}>
      <div className="weather-card">
        <div className="weather-card__header">
          <p className="weather-eyebrow">Live weather</p>
          <h1>Weather Dashboard</h1>
          <p className="weather-subtitle">
            A polished React weather app with live city search, responsive UI, and a cleaner
            forecast experience.
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

        <div className="weather-quick-cities">
          {QUICK_CITIES.map((quickCity) => (
            <button
              key={quickCity}
              type="button"
              className="weather-chip"
              onClick={() => fetchWeatherData(quickCity)}
              disabled={loading}
            >
              {quickCity}
            </button>
          ))}
        </div>

        {loading && (
          <div className="weather-message weather-message--loading">
            <span className="weather-spinner" aria-hidden="true" />
            <span>Fetching the latest weather data...</span>
          </div>
        )}

        {error && <div className="weather-message weather-message--error">{error}</div>}

        {!weather && !error && !loading && (
          <div className="weather-empty-state">
            <div className="weather-empty-state__icon">⛅</div>
            <h3>Search a city to get started</h3>
            <p>
              Try one of the quick picks above or enter any city to see current conditions,
              temperature, and supporting weather details.
            </p>
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
                <p className="weather-description">{weather.weather[0].description}</p>
              </div>

              <div className="weather-main__icon-group">
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <p className="weather-main-label">{weather.weather[0].main}</p>
              </div>
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
