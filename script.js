async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    loading.textContent = "Loading weather data...";
    error.textContent = "";

    try {

        // Step 1: Convert city name into latitude and longitude
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find location.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        // Step 2: Get weather using latitude and longitude
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Display weather information
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        document.getElementById("condition").textContent =
            getWeatherCondition(current.weather_code);

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m} %`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("feelsLike").textContent =
            `${current.apparent_temperature} °C`;

    } catch (err) {

        error.textContent = err.message;

    } finally {

        loading.textContent = "";
    }
}


// Convert weather code into readable condition
function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }

    return "Unknown";
        }
