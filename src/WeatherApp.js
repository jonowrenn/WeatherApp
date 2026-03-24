import React, { useMemo, useState } from 'react';

const QUICK_CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'San Francisco'];
const MAX_RECENT = 5;

function getWeatherVisual(condition = '') {
  const normalized = condition.toLowerCase();
  if (normalized.includes('clear')) return '☀️';
  if (normalized.includes('cloud')) return '☁️';
  if (normalized.includes('rain')) return '🌧️';
  if (normalized.includes('drizzle')) return '🌦️';
  if (normalized.includes('snow')) return '❄️';
  if (normalized.includes('thunder')) return '⛈️';
  if (normalized.includes('mist') || normalized.includes('fog') || normalized.includes('haze')) return '🌫️';
  return '🌤️';
}

function groupForecastByDay(list) {
  const days = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  return Object.entries(days).slice(0, 5).map(([date, items]) => {
    const midday = items.find(i => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)];
    const temps = items.map(i => i.main.temp);
    const d = new Date(date + 'T12:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let label;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === tomorrow.toDateString()) label = 'Tomorrow';
    else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return {
      date,
      label,
      icon: getWeatherVisual(midday.weather[0].main),
      description: midday.weather[0].description,
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      condition: midday.weather[0].main,
    };
  });
}

function loadRecentSearches() {
  try { return JSON.parse(localStorage.getItem('recentCities') || '[]'); }
  catch { return []; }
}

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);

  const condition = weather?.weather?.[0]?.main || '';
  const weatherVisual = getWeatherVisual(condition);

  const themeClass = useMemo(() => {
    const normalized = condition.toLowerCase();
    if (normalized.includes('clear')) return 'theme-clear';
    if (normalized.includes('cloud')) return 'theme-clouds';
    if (normalized.includes('rain') || normalized.includes('drizzle')) return 'theme-rain';
    if (normalized.includes('snow')) return 'theme-snow';
    if (normalized.includes('thunder')) return 'theme-storm';
    return 'theme-default';
  }, [condition]);

  const addRecentSearch = (cityName) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, MAX_RECENT);
      try { localStorage.setItem('recentCities', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const applyWeatherData = (weatherData, forecastData) => {
    setWeather(weatherData);
    setForecast(forecastData ? groupForecastByDay(forecastData.list) : null);
    addRecentSearch(weatherData.name);
    setCity(weatherData.name);
  };

  const fetchWeatherData = async (cityOverride) => {
    const trimmedCity = (cityOverride ?? city).trim();
    if (!trimmedCity) { setError('Enter a city name to get the weather.'); setWeather(null); return; }
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) { setError('Missing API key. Add REACT_APP_API_KEY to your environment.'); return; }
    try {
      setLoading(true); setError('');
      const [wRes, fRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric`),
      ]);
      const wData = await wRes.json();
      if (!wRes.ok) throw new Error(wData?.message || 'Unable to fetch weather data.');
      const fData = fRes.ok ? await fRes.json() : null;
      applyWeatherData(wData, fData);
    } catch (err) {
      setWeather(null); setForecast(null);
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const fetchByCoords = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) { setError('Missing API key.'); setGeoLoading(false); return; }
    try {
      setLoading(true); setError('');
      const [wRes, fRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      ]);
      const wData = await wRes.json();
      if (!wRes.ok) throw new Error(wData?.message || 'Unable to fetch weather data.');
      const fData = fRes.ok ? await fRes.json() : null;
      applyWeatherData(wData, fData);
    } catch (err) {
      setWeather(null); setForecast(null);
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); setGeoLoading(false); }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError('Geolocation is not supported by your browser.'); return; }
    setGeoLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => { setGeoLoading(false); setError('Location access denied. Please search by city name.'); }
    );
  };

  const handleSubmit = (e) => { e.preventDefault(); fetchWeatherData(); };

  const weatherDetails = weather ? [
    { label: 'Feels like', value: `${Math.round(weather.main.feels_like)}°C` },
    { label: 'Humidity', value: `${weather.main.humidity}%` },
    { label: 'Wind', value: `${Math.round(weather.wind.speed)} m/s` },
    { label: 'High / Low', value: `${Math.round(weather.main.temp_max)}° / ${Math.round(weather.main.temp_min)}°` },
    { label: 'Pressure', value: `${weather.main.pressure} hPa` },
    { label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
  ] : [];

  const filteredRecent = recentSearches.filter(
    c => !QUICK_CITIES.some(q => q.toLowerCase() === c.toLowerCase())
  );
  const isDisabled = loading || geoLoading;

  return (
    <div className={`weather-shell ${themeClass}`}>
      <div className="weather-card">
        <div className="weather-card__header">
          <p className="weather-eyebrow">Live weather</p>
          <h1>Weather Dashboard</h1>
          <p className="weather-subtitle">
            Search any city for live conditions, a 5-day forecast, and detailed weather stats.
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
          <button type="submit" disabled={isDisabled}>
            {loading && !geoLoading ? 'Loading...' : 'Get Weather'}
          </button>
          <button
            type="button"
            className="weather-geo-btn"
            onClick={handleGeolocate}
            disabled={isDisabled}
            title="Use my location"
            aria-label="Use my location"
          >
            {geoLoading ? '⏳' : '📍'}
          </button>
        </form>

        <div className="weather-chips-section">
          <div className="weather-quick-cities">
            {QUICK_CITIES.map(quickCity => (
              <button key={quickCity} type="button" className="weather-chip"
                onClick={() => fetchWeatherData(quickCity)} disabled={isDisabled}>
                {quickCity}
              </button>
            ))}
          </div>
          {filteredRecent.length > 0 && (
            <div className="weather-recent">
              <span className="weather-recent-label">Recent</span>
              {filteredRecent.map(recentCity => (
                <button key={recentCity} type="button" className="weather-chip weather-chip--recent"
                  onClick={() => fetchWeatherData(recentCity)} disabled={isDisabled}>
                  🕐 {recentCity}
                </button>
              ))}
            </div>
          )}
        </div>

        {isDisabled && (
          <div className="weather-message weather-message--loading">
            <span className="weather-spinner" aria-hidden="true" />
            <span>{geoLoading ? 'Getting your location...' : 'Fetching the latest weather data...'}</span>
          </div>
        )}

        {error && <div className="weather-message weather-message--error">{error}</div>}

        {!weather && !error && !isDisabled && (
          <div className="weather-empty-state">
            <div className="weather-empty-state__icon">⛅</div>
            <h3>Search a city to get started</h3>
            <p>Use quick picks, tap 📍 for your location, or type any city to see conditions and a 5-day forecast.</p>
          </div>
        )}

        {weather && (
          <div className="weather-results">
            <div className="weather-main">
              <div>
                <p className="weather-location">{weather.name}, {weather.sys.country}</p>
                <h2>{Math.round(weather.main.temp)}°C</h2>
                <p className="weather-description">{weather.weather[0].description}</p>
              </div>
              <div className="weather-main__icon-group">
                <div className="weather-visual" aria-hidden="true">{weatherVisual}</div>
                <p className="weather-main-label">{condition}</p>
              </div>
            </div>

            <div className="weather-details-grid">
              {weatherDetails.map(item => (
                <div className="weather-detail-card" key={item.label}>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            {forecast && forecast.length > 0 && (
              <div className="weather-forecast">
                <h3 className="weather-forecast-title">5-Day Forecast</h3>
                <div className="weather-forecast-grid">
                  {forecast.map(day => (
                    <div className="weather-forecast-card" key={day.date}>
                      <p className="forecast-day">{day.label}</p>
                      <div className="forecast-icon">{day.icon}</div>
                      <p className="forecast-desc">{day.description}</p>
                      <p className="forecast-temps">
                        <span className="forecast-high">{day.high}°</span>
                        <span className="forecast-low">{day.low}°</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
