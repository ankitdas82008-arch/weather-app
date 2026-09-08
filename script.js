const apiKey = "YOUR_API_KEY_HERE"; // Replace with your

document.getElementById("searchBtn").addEventListener("click", function () {
    getWeather();
});

async function getWeather() {
    const city = document.getElementById("city").value.trim();
    let searchCity = city;

if (city.toLowerCase() === "mehsana") {
    searchCity = "Mahesana";
}


    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    document.getElementById("weather").innerHTML =
        "<h2>⏳ Loading weather...</h2>";

   const url =
    `/api/weather?city=${encodeURIComponent(searchCity)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById("weather").innerHTML =
                `<h2>❌ ${data.message}</h2>`;
            return;
        }

        showWeather(data);
        getForecast(data.name);

    } catch (error) {
        document.getElementById("weather").innerHTML =
            "<h2>❌ Network error</h2>";
    }

}

function showWeather(data) {
    changeWeatherBackground(data.weather[0].main);
    document.getElementById("weather").innerHTML = `
        <h2>📍 ${data.name}</h2>

        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

        <p class="temperature">🌡️ ${data.main.temp}°C</p>

        <p>Feels Like: ${data.main.feels_like}°C</p>

        <p>Weather: ${data.weather[0].description}</p>

        <p>💧 Humidity: ${data.main.humidity}%</p>

       <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
       <p>🧭 Wind Direction: ${getWindDirection(data.wind.deg)}</p>
       <p>🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</p>

<p>🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</p>

    `;
}

document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

document.getElementById("locationBtn").addEventListener("click", getLocation);

function getLocation() {
    if (!navigator.geolocation) {
        alert("Location is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        showLocation,
        function() {
            alert("Unable to get your location. Please allow location access.");
        }
    );
}

function showLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById("weather").innerHTML =
        "<h2>⏳ Getting your weather...</h2>";

    getWeatherByLocation(latitude, longitude);
}

async function getWeatherByLocation(latitude, longitude) {
   const url =
    `/api/weather?lat=${latitude}&lon=${longitude}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById("weather").innerHTML =
                `<h2>❌ ${data.message}</h2>`;
            return;
        }

      document.getElementById("forecast").innerHTML = "<p>⏳ Loading forecast...</p>";
      showWeather(data);
     getForecast(data.name);

    } catch (error) {
        document.getElementById("weather").innerHTML =
            "<h2>❌ Network error</h2>";
    }
}
async function getForecast(city) {
    const forecast = document.getElementById("forecast");

    forecast.innerHTML = "<p>⏳ Loading forecast...</p>";

   const url =
    `/api/weather?forecast=${encodeURIComponent(city)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (String(data.cod) !== "200") {
            forecast.innerHTML =
                `<p>❌ Forecast error: ${data.message}</p>`;
            return;
        }

        forecast.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {
            const item = data.list[i];

            const day = new Date(item.dt * 1000).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            );

            forecast.innerHTML += `
                <div class="forecast-card">
                    <h3>${day}</h3>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
                    <p>${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                </div>
            `;
        }

    } catch (error) {
        forecast.innerHTML =
            "<p>❌ Network error while loading forecast.</p>";

        console.log("Forecast error:", error);
    }
}
function getWindDirection(deg) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}
window.addEventListener("DOMContentLoaded", function () {

    const darkModeBtn = document.getElementById("darkmodeBtn");

    darkModeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            darkModeBtn.textContent = "☀️ Light Mode";
        } else {
            darkModeBtn.textContent = "🌙 Dark Mode";
        }
    });

});
function changeWeatherBackground(weather) {
    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "stormy"
    );

    const condition = weather.toLowerCase();

    if (condition.includes("clear")) {
        document.body.classList.add("sunny");
    } 
    else if (condition.includes("cloud")) {
        document.body.classList.add("cloudy");
    } 
    else if (condition.includes("rain") || condition.includes("drizzle")) {
        document.body.classList.add("rainy");
    } 
    else if (condition.includes("snow")) {
        document.body.classList.add("snowy");
    } 
    else if (
        condition.includes("thunderstorm") ||
        condition.includes("storm")
    ) {
        document.body.classList.add("stormy");
    }
}