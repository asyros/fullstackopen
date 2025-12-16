import { useState, useEffect } from "react";
import { getCountries } from "./services/countries.js";
import { getWeatherForCity } from "./services/weather.js";

const App = () => {
  const [countryName, setCountryName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showAdditionalCountryDetails, setShowAdditionalCountryDetails] =
    useState(false);

  useEffect(() => {
    if (countryName.length > 0) {
      loadCountries();
    }
  }, [countryName]);

  const loadCountries = () => {
    setNotificationMessage(null);
    getCountries(countryName)
      .then((countries) => {
        const formattedCountries = countries.map(
          ({ name, capital, area, flags, languages, capitalInfo }) => {
            return {
              name,
              capital: capital?.[0] || "No capital",
              capitalInfo,
              area,
              flags,
              languages,
            };
          }
        );
        const matchingCountries = formattedCountries.filter((country) =>
          country.name.common.toLowerCase().includes(countryName.toLowerCase())
        );
        if (matchingCountries.length > 10) {
          setNotificationMessage("Too many matches, specify another filter");
          setTimeout(() => {
            setNotificationMessage(null);
          }, 3000);
        } else if (
          matchingCountries.length > 1 &&
          matchingCountries.length <= 10
        ) {
          buildMatchingCountriesWithWeather(matchingCountries);
          setShowAdditionalCountryDetails(false);
        } else if (matchingCountries.length === 1) {
          buildMatchingCountriesWithWeather(matchingCountries);
          setShowAdditionalCountryDetails(true);
        }
      })
      .catch((error) => {});
  };

  const buildMatchingCountriesWithWeather = (matchingCountries) => {
    const countriesWithWeatherArr = [];

    matchingCountries.map((country) => {
      const { latlng } = country?.capitalInfo;
      if (latlng) {
        getWeatherForCity(latlng[0], latlng[1])
          .then((weather) => {
            const { current } = weather;
            countriesWithWeatherArr.push({
              country,
              temperature: convertKelvinToCelsius(current.temp),
              wind: current.wind_speed,
              icon: current.weather[0].icon,
            });
          })
          .then(() => {
            setCountries(countriesWithWeatherArr);
          });
      } else {
        countriesWithWeatherArr
          .push({
            country,
            temperature: null,
            wind: null,
            icon: null,
          })
          .then(() => {
            setCountries(countriesWithWeatherArr);
          });
      }
    });
  };

  const handleCountryInput = (event) => {
    event.preventDefault();
    setCountryName(event.target.value);
  };

  return (
    <>
      <SearchFilter
        countryName={countryName}
        handleCountryInput={handleCountryInput}
      />
      <Notification notificationMessage={notificationMessage} />
      {countries?.map(({ icon, temperature, wind, country }) => {
        return (
          <Country
            key={country.name.common}
            country={country}
            icon={icon}
            temperature={temperature}
            wind={wind}
            showAdditionalCountryDetails={showAdditionalCountryDetails}
          />
        );
      })}
    </>
  );
};

const convertKelvinToCelsius = (kelvin) => {
  return (kelvin - 273.15).toFixed(2) + " °C";
};

const SearchFilter = ({ countryName, handleCountryInput }) => {
  return (
    <>
      <label>find countries</label>
      <input
        style={{ marginLeft: "8px" }}
        value={countryName}
        onChange={handleCountryInput}
      />
    </>
  );
};

const Notification = ({ notificationMessage }) => {
  const notificationStyle = {
    fontSize: 16,
    fontWeight: "bold",
  };

  return <p style={notificationStyle}>{notificationMessage}</p>;
};

const Country = ({
  country,
  showAdditionalCountryDetails,
  icon,
  temperature,
  wind,
}) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const handleBtnClick = (e) => {
    e.preventDefault();
    setShowMoreDetails(true);
  };

  return (
    <div key={country.name.common}>
      {showAdditionalCountryDetails || showMoreDetails ? (
        <AdditionalCountryDetails
          icon={icon}
          temperature={temperature}
          wind={wind}
          {...country}
        />
      ) : (
        <>
          <p>{country.name.common}</p>
          <button onClick={handleBtnClick}>Show</button>
        </>
      )}
    </div>
  );
};

const AdditionalCountryDetails = ({
  icon,
  temperature,
  wind,
  name,
  capital,
  area,
  languages,
  flags,
}) => {
  const languagesList = Object.values(languages);

  return (
    <div>
      <h2>{name.common}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>
      <h2>Languages</h2>
      <ul>
        {languagesList?.map((language) => {
          return <li key={language}>{language}</li>;
        })}
      </ul>
      {flags && <img src={flags.png} alt={flags.alt} />}
      {temperature || icon || wind ? <h2>Weather in {capital}</h2> : null}
      {temperature && <p>Temperature {temperature}</p>}
      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
        />
      )}
      {wind && <p>Wind {wind} m/s</p>}
    </div>
  );
};
export default App;
