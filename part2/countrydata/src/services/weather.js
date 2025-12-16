const baseUrl = "https://api.openweathermap.org";
const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;

import axios from "axios";

const getWeatherForCity = async (lat, long) => {
  const response = await axios.get(
    `${baseUrl}/data/3.0/onecall?lat=${lat}&lon=${long}&appid=${apiKey}`
  );
  return response.data;
};

export { getWeatherForCity };
