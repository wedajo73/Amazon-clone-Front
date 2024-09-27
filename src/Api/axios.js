import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "https://amazon-api-fawz.onrender.com/",
  // Local backend URL
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
  },
});


export { axiosInstance };
