const ui = {
    form:              document.querySelector("#form"),
    userLocationInput: document.querySelector("#userLocationInput"),
    submit:            document.querySelector("#submit"),
    choosedLocation:   document.querySelector("#choosedLocation"),
    weather: {
        temp:        document.querySelector("#temp"),
        feelsLike:   document.querySelector("#feelsLike"),
        windSpeed:   document.querySelector("#windSpeed"),
        humidity:    document.querySelector("#humidity"),
        pressure:    document.querySelector("#pressure"),
        conditions:  document.querySelector("#conditions"),
        description: document.querySelector("#description"),
    },
};

// API Stuff

const API_KEY = 'ML4K3QMEQ4PPCAB3FKDURYAZL';
let city = ''; //
const unitGroup = 'metric';
const contentType = 'json';
const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const kb = []

async function fetchWeatherData() {
    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=${contentType}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        main(data)

    } catch (error) {
        console.error(error);
    }
}

// Main logic 

function main (data) {
    kb[0] = data;
    
    displayData()
};

// Users current location

window.addEventListener("DOMContentLoaded", getUserLocation)

function getUserLocation () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                city = `${latitude},${longitude}`;
                fetchWeatherData();
                ui.choosedLocation.textContent = `Your position is: ${latitude.toFixed(2)},${longitude.toFixed(2)}.`
            },
            (error) => {
                console.error("Error getting location:", error.message);
                ui.choosedLocation.textContent = "Could not enter your location, please enter your city manually..."
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser...");
        ui.choosedLocation.textContent = "Geolocation is not supported by this browser."
    }
}

// User selected location

ui.form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (ui.userLocationInput.value != "") {
        city = ui.userLocationInput.value;
        fetchWeatherData();

        ui.choosedLocation.textContent = `Location selected: ${ui.userLocationInput.value}`;
    }
});

// Display data

function displayData () {
    ui.weather.temp.textContent = `The current temperature is ${kb[0].currentConditions.temp}°C.`
    ui.weather.feelsLike.textContent = `It feels like: ${kb[0].currentConditions.feelslike}°C.`
    ui.weather.windSpeed.textContent = `The current wind speed is ${kb[0].currentConditions.windspeed} km/h.`
    ui.weather.humidity.textContent = `The current humidity is ${kb[0].currentConditions.humidity}%.`
    ui.weather.pressure.textContent = `The current pressure is ${kb[0].currentConditions.pressure}hPa.`
    ui.weather.conditions.textContent = `The current conditions is: ${kb[0].currentConditions.conditions}.`
    ui.weather.description.textContent = `The current trends are: ${kb[0].description}.`
};