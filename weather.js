//! WORKING LINK TO API
//! https://api.openweathermap.org/data/2.5/weather?q=Mendoza,ar&units=metric&lang=es&APPID=3d3cb9d7e2ea6fea569d30357c5e356c

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const dotenv = require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const unit = req.body.unitsName;
  const lang = req.body.langName;

  const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&lang=" + lang + "&APPID=" + process.env.APIKEY;
  console.log(apiURL);

  https.get(apiURL, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const sunset = weatherData.sys.sunset;

      console.log(sunset);
      const sunsetTime = sunset.toString();

      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      console.log(sunsetTime);

      res.send(`
      <div class="card mb-3 rounded-0" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${iconURL}" class="img-fluid" alt="..." />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h2 class="card-title">Temperatura en ${weatherData.name}</h2>
              <p class="card-text text-uppercase">${weatherData.main.temp}°C - ${weatherDescription}</p>
              <p class="card-text"><small class="text-muted">"Ocaso: " + ${sunsetTime}</small></p>
            </div>
          </div>
        </div>
      </div>
  `);
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
