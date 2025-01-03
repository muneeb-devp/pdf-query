import {
  getAuthenticatedUser,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import axios from "axios";

const apiKey = process.env.LEMONSQUEEZY_API_KEY || "";


lemonSqueezySetup({
  apiKey,
  onError: (error) => console.error("Error!", error),
});

const { data, error } = await getAuthenticatedUser();

if (error) {
  console.error(error.message);
} else {
  console.error(data);
}

export const ENDPOINT = "https://api.lemonsqueezy.com/v1";
export const lemonInstance = axios.create({
  baseURL: ENDPOINT,
  headers: {
    "Accept": "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey}`,
  },
})

