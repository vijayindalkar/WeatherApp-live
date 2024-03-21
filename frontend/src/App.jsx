import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Oval, ColorRing } from "react-loader-spinner";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "467777c984c3a6ebb68bbc97a3367168";

function WeatherApp() {
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [input, setInput] = useState("");

  const handleSearch = useCallback(async () => {
    if (!input) return;
    setWeather({ ...weather, loading: true });
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: input,
          units: "metric",
          appid: API_KEY,
        },
      });
      setWeather({ data: response.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.log("error", error);
    }
  }, [input, weather]);

  const toDateFunction = useCallback(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  }, []);

  const renderContent = useMemo(() => {
    if (weather.loading) {
      return (
        <div>
          <br />
          <br />
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#7CB9E8", "#6CB4EE", "#007FFF", "#5072A7", "#0000FF"]}
          />{" "}
        </div>
      );
    } else if (weather.error) {
      return (
        <div className="text-lg font-medium text-gray-900 dark:text-white">
          <br />
          <br />
          <span className="text-xl font-semibold text-blue-600/75 dark:text-blue-500/100">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: "20px" }}> City not found</span>
          </span>
        </div>
      );
    } else if (weather.data && weather.data.main) {
      return (
        <div className="flex flex-col justify-center p-4">
          <div className="flex  justify-around">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
          </div>
          <div className="flex justify-center text-xl font-semibold text-blue-600/75 dark:text-blue-500/100">
            {Math.round(weather.data.main.temp)}
            <sup className=" text-xl font-semibold text-blue-600/75 dark:text-blue-500/100">
              °C
            </sup>
          </div>
          <div className="flex justify-center pt-1 text-xl font-semibold text-blue-600/100 dark:text-blue-500/100">
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="flex justify-center text-xl font-semibold text-blue-600/100 dark:text-blue-500/85">
            <span>{toDateFunction()}</span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="flex justify-center text-xl font-semibold text-blue-600/50 dark:text-blue-500/65">
              {weather.data.weather[0].description.toUpperCase()}
            </p>
            <p className="flex justify-center text-xl font-semibold text-blue-600/35 dark:text-blue-500/45">
              Wind Speed: {weather.data.wind.speed}m/s
            </p>
          </div>
        </div>
      );
    }

    return null; // Handle initial state or no data scenario
  }, [weather, toDateFunction]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className=" p-4 mb-4 text-5xl font-extrabold text-gray-900 underline dark:text-white decoration-blue-500 decoration-double">
          Live Weather App
        </h1>
      </div>
      <div>
        <input
          className="bg-white  text-center text-xl font-semibold text-blue-600/100 dark:text-blue-500/100 focus:outline-none focus:shadow-outline border border-blue-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="text"
          placeholder="Enter city"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>
      <div className="">{renderContent}</div>
    </div>
  );
}

export default WeatherApp;
