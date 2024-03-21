const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const API_KEY = "467777c984c3a6ebb68bbc97a3367168";

app.post("/api/weather", async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    const {
      name: location,
      main: { temp: temperature },
      weather,
    } = response.data;

    const conditions =
      weather && weather.length > 0 ? weather[0].description : "";

    
    res.json({ location, temperature, conditions });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const {
        name: location,
        main: { temp: temperature },
        weather,
      } = response.data;

      const conditions =
        weather && weather.length > 0 ? weather[0].description : "";

      
      socket.emit("weatherUpdate", { location, temperature, conditions });
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };


  fetchWeatherData();
  setInterval(fetchWeatherData, 30000);

socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
