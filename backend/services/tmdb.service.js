import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
  const urlWithApiKey = `${url}${url.includes("?") ? "&" : "?"}api_key=${ENV_VARS.TMDB_API_KEY}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response = await axios.get(urlWithApiKey, options);

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB" + response.statusText);
  }

  return response.data;
};
