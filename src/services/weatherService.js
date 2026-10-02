/**
 * weatherService.js
 * Handles weather data fetching with caching and fallback.
 * API key is read from environment variables — never hardcoded.
 *
 * Uses Open-Meteo API which is FREE and requires NO API key.
 * This is the most privacy-friendly and reliable approach for this project.
 *
 * Architecture:
 *   Browser (Geolocation API) → Coordinates → Open-Meteo → Normalized WeatherData
 */

// Cache duration: 30 minutes (weather doesn't change that fast)
const CACHE_DURATION_MS = 30 * 60 * 1000;

// WMO weather interpretation codes → human-readable
const WMO_CODES = {
  0: { label: "Clear Sky", icon: "☀️", category: "clear" },
  1: { label: "Mainly Clear", icon: "🌤️", category: "clear" },
  2: { label: "Partly Cloudy", icon: "⛅", category: "cloudy" },
  3: { label: "Overcast", icon: "☁️", category: "cloudy" },
  45: { label: "Fog", icon: "🌫️", category: "fog" },
  48: { label: "Icy Fog", icon: "🌫️", category: "fog" },
  51: { label: "Light Drizzle", icon: "🌦️", category: "rain" },
  53: { label: "Moderate Drizzle", icon: "🌦️", category: "rain" },
  55: { label: "Dense Drizzle", icon: "🌧️", category: "rain" },
  61: { label: "Slight Rain", icon: "🌧️", category: "rain" },
  63: { label: "Moderate Rain", icon: "🌧️", category: "rain" },
  65: { label: "Heavy Rain", icon: "🌧️", category: "rain" },
  71: { label: "Slight Snow", icon: "🌨️", category: "snow" },
  73: { label: "Moderate Snow", icon: "❄️", category: "snow" },
  75: { label: "Heavy Snow", icon: "❄️", category: "snow" },
  80: { label: "Slight Showers", icon: "🌦️", category: "rain" },
  81: { label: "Moderate Showers", icon: "🌧️", category: "rain" },
  82: { label: "Violent Showers", icon: "⛈️", category: "storm" },
  95: { label: "Thunderstorm", icon: "⛈️", category: "storm" },
  96: { label: "Thunderstorm w/ Hail", icon: "⛈️", category: "storm" },
  99: { label: "Thunderstorm w/ Heavy Hail", icon: "⛈️", category: "storm" },
};

/**
 * Get user's coordinates from browser Geolocation API.
 * Returns { lat, lon } or throws if denied.
 */
export function getBrowserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, maximumAge: 300000 }
    );
  });
}

/**
 * Reverse geocode coordinates to city name using Open-Meteo Geocoding.
 */
async function getCityFromCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return "Your Location";
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      "Your Location"
    );
  } catch {
    return "Your Location";
  }
}

/**
 * Fetch weather from Open-Meteo (free, no API key required).
 * Returns normalized WeatherData object.
 */
export async function fetchWeatherByCoords(lat, lon) {
  const cacheKey = `weather_${Math.round(lat * 10) / 10}_${Math.round(lon * 10) / 10}`;
  const cached = loadFromCache(cacheKey);
  if (cached) return cached;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data = await res.json();
  const current = data.current;
  const code = current.weather_code;
  const condition = WMO_CODES[code] || { label: "Unknown", icon: "🌡️", category: "unknown" };

  const city = await getCityFromCoords(lat, lon);

  const weather = {
    city,
    lat,
    lon,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation || 0,
    windSpeed: Math.round(current.wind_speed_10m),
    condition: condition.label,
    conditionIcon: condition.icon,
    conditionCategory: condition.category, // 'clear', 'cloudy', 'rain', 'snow', 'storm', 'fog'
    unit: "°C",
    fetchedAt: Date.now(),
  };

  saveToCache(cacheKey, weather, CACHE_DURATION_MS);
  return weather;
}

/**
 * Fetch weather by city name (fallback when location is denied).
 */
export async function fetchWeatherByCity(cityName) {
  // First geocode the city
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  if (!geoRes.ok) throw new Error("City not found.");
  const geoData = await geoRes.json();
  if (!geoData.results?.length) throw new Error(`City "${cityName}" not found.`);

  const { latitude, longitude } = geoData.results[0];
  return fetchWeatherByCoords(latitude, longitude);
}

/**
 * Classify weather conditions for the recommendation engine.
 * Returns { isHot, isCold, isHumid, isDry, isRainy, isModerate }
 */
export function classifyWeather(weather) {
  if (!weather) return {};
  const { temperature, humidity, conditionCategory } = weather;
  return {
    isHot: temperature >= 30,
    isWarm: temperature >= 24 && temperature < 30,
    isCool: temperature >= 15 && temperature < 24,
    isCold: temperature < 15,
    isHumid: humidity >= 65,
    isDry: humidity < 40,
    isRainy: conditionCategory === "rain" || conditionCategory === "storm",
    isCloudy: conditionCategory === "cloudy",
    isClear: conditionCategory === "clear",
    isModerate: temperature >= 20 && temperature < 30 && humidity >= 40 && humidity < 65,
  };
}

// ---- Cache utilities ----

function saveToCache(key, data, ttl) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({ data, expiresAt: Date.now() + ttl })
    );
  } catch {}
}

function loadFromCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
