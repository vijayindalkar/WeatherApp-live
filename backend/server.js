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

    // Sending weather data as response
    res.json({ location, temperature, conditions });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Establish WebSocket connection for real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");

  // Fetch weather data every 30 seconds and emit to client
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

      // Emitting weather data to client
      socket.emit("weatherUpdate", { location, temperature, conditions });
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  // Call fetchWeatherData initially and then every 30 seconds
  fetchWeatherData();
  setInterval(fetchWeatherData, 30000);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
