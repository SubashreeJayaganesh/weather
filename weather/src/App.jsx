
import './App.css'
import searchIcon from './assets/searchIcon.png';
import windIcon from './assets/windIcon.png';
import humidityIcon from "./assets/humidity.png"
// import bg from "./assets/bg.jpg";
// import bg1 from  './assets/bg.jpg';
import clear from './assets/clear.jpg';
// import clouds from './assets/clouds.jpg';
import drizzle from './assets/drizzle.jpg';
// import mist from './assets/mist.jpg';
import rainy from './assets/rainy.jpg';
import snow from './assets/snow.jpg';
import sunny from './assets/sunny.jpg';
// import thunderstorm from './assets/thunderstorm.jpg';
import { useEffect, useState } from 'react';

const Weather = ({ icon, temp, city, country, lat, log, wind, humidity }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt='Image' />
      </div>
      <div className='temp'>{temp}°C</div>
      <div className="location">{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{humidity}</div>
            <div className='text'>humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Icon" className='icon' />
          <div className='data'>
            <div className='wind-percent'>{wind}</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
};


function App() {
  let APIkey = "1785dfd44bbed41c3b3b514917c56f2f";
  const [text, setText] = useState("london")
  const [icon, setIcon] = useState(snow);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("london");
  const [country, setCountry] = useState("GB")
  const [lat, setlat] = useState(0);
  const [log, setlog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, SetCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02d": sunny,
    "02n": sunny,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rainy,
    "09n": rainy,
    "10d": rainy,
    "10n": rainy,
    "13d": snow,
    "13n": snow,
  };

  const search = async () => {

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${APIkey}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City not found");
        SetCityNotFound(true);
        setLoading(false);
        setError(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setlat(data.coord.lat);
      setlog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clear)
      SetCityNotFound(false);
    }
    catch (error) {
      console.error("An error occured:", error.message);
      setError("give valid input");
    }
    finally {
      setLoading(false);
    }
  }
  const handleCity = (e) => {
    setText(e.target.value);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input text="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className='search-icon' >
            <img src={searchIcon} alt='img' onClick={() => search()} />
          </div>
        </div>


        {loading && <div className='loading-message'>loading..</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}


        {!loading && !cityNotFound && <Weather icon={icon} temp={temp} city={city} country={country} lat={lat} log={log}
          humidity={humidity} wind={wind} />}

      </div>
    </>
  )
}

export default App
