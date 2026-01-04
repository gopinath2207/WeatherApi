import { useState } from 'react';

function Weather(){
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = "2e941a95268ab0fdeddcf1030181d984";

  async function getWeatherData(query){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if(!response.ok){
      throw new Error('City not found');
    }
    return await response.json();
  }

  function getWeatherEmoji(id){
    if(id >= 200 && id < 300){
      return "⛈️"; // Thunderstorm
    }
    else if(id >= 300 && id < 500){
      return "🌦️"; // Drizzle
    }
    else if(id >= 500 && id < 600){
      return "🌧️"; // Rain
    }
    else if(id >= 600 && id < 700){
      return "❄️"; // Snow
    }
    else if(id >= 700 && id < 800){
      return "🌫️"; // Atmosphere
    }
    else if(id === 800){
      return "☀️"; // Clear
    }
    else if(id > 800 && id < 900){
      return "☁️"; // Clouds
    }
    else{
      return "🌈"; // Default
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if(!trimmed){
      setError('Please enter a city name');
      setWeather(null);
      return;
    }

    try{
      setError('');
      setLoading(true);
      const data = await getWeatherData(trimmed);
      setWeather(data);
    }
    catch(err){
      setError(err.message || 'An error occurred');
      setWeather(null);
    }
    finally{
      setLoading(false);
    }
  }

  return(
    <div>
        <h1 style={{textAlign: 'center'}}>Precision Forecast</h1>
      <form className="weatherform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          className="cityinput"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      <div className="weatherresult" style={{display: weather || error || loading ? 'flex' : 'none'}}>
        {loading && <p>Loading...</p>}
        {error && <p className="errorDisplay">{error}</p>}

        {weather && (
          <>
            <h1 className="cityDisplay">{weather.name}</h1>
            <p className="temperatureDisplay">{weather.main.temp.toFixed(1)}°C</p>
            <p className="humidityDisplay">Humidity: {weather.main.humidity}%</p>
            <p className="description">{weather.weather[0].description}</p>
            <p className="weatherEmoji">{getWeatherEmoji(weather.weather[0].id)}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Weather;