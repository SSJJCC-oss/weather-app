// display a fullday using Date Object.
const day = (day) => {
  let fullday;

  switch (day) {
    case "Mon":
      fullday = "Monday";
      break;

    case "Tue":
      fullday = "Tuesday";
      break;

    case "Wed":
      fullday = "Wednesday";
      break;

    case "Thu":
      fullday = "Thursday";
      break;

    case "Fri":
      fullday = "Friday";
      break;

    case "Sat":
      fullday = "Saturday";
      break;

    case "Sun":
      fullday = "Sunday";
      break;

    default:
      fullday = "Today";
      break;
  }

  return fullday;
};

// display the json result.
function displayWeather(result, city, country, countryCode) {
  // let dt = new Date().toDateString();
  let dt = new Date().toLocaleString("en-US", {
    weekday: "short", // short or long
    year: "numeric",
    month: "short", // short or long
    day: "numeric",
    timeZone: result.timezone,
  });
  console.log(result);
  let icon = result.current.weather[0].icon.substr(0, 2);
  console.log(icon.substr(0, 2));

  $(".country-name").text(city + ", " + country);
  let flag = `https://lipis.github.io/flag-icon-css/flags/4x3/${countryCode}.svg`;
  $(".country-flag").attr("src", flag);

  // current temperature
  $(".current-temp").text(Math.floor(result.current.temp));
  $(".insight").text(result.current.weather[0].description);
  $(".day").text(day(dt.substr(0, 3)));
  $(".calender-mode").text(dt.substr(4, 13));

  // for morning
  $(".morning").text(Math.floor(result.daily[0].feels_like.morn));
  $(".morning-high").text(Math.floor(result.daily[0].temp.morn));
  let mornIcon = `https://openweathermap.org/img/wn/${icon}d@2x.png`;
  $(".morning-icon").attr("src", mornIcon);

  // for day
  $(".day-temp").text(Math.floor(result.daily[0].feels_like.day));
  $(".day-temp--high").text(Math.floor(result.daily[0].temp.day));
  $(".day-icon").attr("src", mornIcon);

  // for evening
  $(".evening-temp").text(Math.floor(result.daily[0].feels_like.eve));
  $(".evening-temp--high").text(Math.floor(result.daily[0].temp.eve));
  let eveIcon = `https://openweathermap.org/img/wn/${icon}n@2x.png`;
  $(".eve-icon").attr("src", eveIcon);
}

// make a search query to our API using our users location, and display the result.
function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // for the user current city and country
  const geocoding = `https://us1.locationiq.com/v1/reverse.php?key=pk.ae4b8c6b74488525b7d5089c7e8aa458&format=json&lat=${latitude}&lon=${longitude}`;

  // for the user weather data
  const userLocation = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=b1e131fe0cc7b8aa674d0cd040adccc7`;

  $.ajax({
    url: geocoding,
    method: "GET",
    cache: false,
    dataType: "json",
    success: function (result) {
      let city = result.address.city;
      let country = result.address.country;
      let countryCode = result.address.country_code;

      $.ajax({
        url: userLocation,
        method: "GET",
        cache: false,
        dataType: "json",
        success: function (result) {
          displayWeather(result, city, country, countryCode);
        },
      });
    },
  });
}

function error() {
  setTimeout(() => $(".status").css("display", "block"), 2000);
}

function disabled() {
  setTimeout(
    () =>
      $(".status")
        .text("Geolocation is not supported by your browser")
        .css("display", "block"),
    2000
  );
}

// make a search query to our API by asking our users permision for their location, and display the result.
$("body").ready(function () {
  if (!navigator.geolocation) {
    disabled();
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

// make a search query to our API, and display the result.
$('input[type="search"]').on("change", function () {
  let searchName = $(this).val();

  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${searchName}&units=metric&appid=b1e131fe0cc7b8aa674d0cd040adccc7`;

  if (searchName.trim().length >= 1) {
    $.ajax({
      url: endpoint,
      method: "GET",
      cache: false,
      dataType: "json",
      success: function (result) {
        let city = result.name;
        let country = result.sys.country;
        let countryCode = result.sys.country.toLowerCase();

        const userLocation = `https://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&exclude=hourly,minutely&units=metric&appid=b1e131fe0cc7b8aa674d0cd040adccc7`;

        $.ajax({
          url: userLocation,
          method: "GET",
          cache: false,
          dataType: "json",
          success: function (result) {
            displayWeather(result, city, country, countryCode);
          },
        });
      },
    });
  }
});
