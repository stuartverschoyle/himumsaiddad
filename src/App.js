import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import RangeSlider from './components/rangeSlider/index';
import './App.css';

function App() {
  // Define State
  const [woeid, setWoeid] = useState(null);
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Requests the users location.
  const requestUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      getUserWeather(position);
    });
  };

  // if WOEID has been set the query weather
  useEffect(() => {
    if (woeid) {
      axios
        .get(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}`)
        .then(function (response) {
          setWeather(response.data);

          // Round weather to remove decimals
          setTemperature(
            Math.round(response.data.consolidated_weather[0].the_temp)
          );
        })
        .catch(function (error) {
          setError(error);
        });
    }
  }, [woeid]);

  // Get user WOEID from long / lat
  const getUserWeather = (position) => {
    if (position) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${position.coords.latitude},${position.coords.longitude}`
        )
        .then(function (response) {
          if (response.data.length > 0) {
            setWoeid(response.data[0].woeid);
          }
        })
        .catch(function (error) {
          setError(error);
        });
    }
  };

  // Calculate backgroundColor
  const backgroundColor = useMemo(() => {
    if (temperature < -10) {
      return '#00ffff';
    }
    if (temperature > 30) {
      return '#ff8c00';
    }
    if (temperature > 10) {
      return '#fff700';
    }

    return '#fff';
  }, [temperature]);

  // If error display issue
  if (error) {
    return (
      <div className="container">
        <h1>Oops, an error occurred...</h1>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundColor: backgroundColor }}>
      <div className="content">
        {weather ? (
          <>
            <img
              style={{ width: 300 }}
              alt="weather icon"
              src={`https://www.metaweather.com/static/img/weather/${weather.consolidated_weather[0].weather_state_abbr}.svg`}
            />
            <RangeSlider
              value={temperature}
              min={-50}
              max={50}
              onChange={(temp) => setTemperature(temp)}
            />
          </>
        ) : (
          <>
            <h1>Permission Required</h1>
            <p>
              In order to continue we require your permission to access your
              location.
            </p>
            <button
              className="button"
              onClick={() => {
                requestUserLocation();
              }}
            >
              Share My Location
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
