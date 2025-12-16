const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
import axios from "axios";

const getCountries = async (countryName) => {
  const response = await axios.get(`${baseUrl}/all`, countryName);
  return response.data;
};

export { getCountries };
