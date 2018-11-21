const app = {};

// UNSPLASH
app.unsplashClientID = '312de5ede65d57c255d22fc5a82552c05c3dc0fde821f66cfe2bef2ad716f8af';
app.unsplashUrl = 'https://api.unsplash.com/photos/random/?client_id=' + app.unsplashClientID;
app.getPhotos = () => {
  $.ajax({
    url: app.unsplashUrl,
    method: 'GET',
    dataType: 'JSON',
    // data: {
    //   query: q
    // }
  }).then((res) => {
    console.log(res);
    app.displayPhotoResults(res);
  });
}

app.displayPhotoResults = (res) => {
  $('#photo').append(`
    <img src=${res.urls.full}>
  `);
}

// WEATHER API

app.weatherApiKey = 'aabc3958afb1ab39dcbe55a9d3801b80';

app.getWeather = (lat = 43.6532, lng = -79.3832) => {
  $.ajax({
    url: `https://api.darksky.net/forecast/${app.weatherApiKey}/${lat},${lng}`,
    dataType: 'JSONP',
    method: 'GET',
    data: {
      units: 'ca'
    }
  }).then((res) => {
    console.log(res);
    app.displayWeatherResults(res);
  })
}

app.displayWeatherResults = (res) => {
  const degrees = ` &#176;C`
  const currentTemp = Math.floor(res.currently.temperature);
  const dailyHighTemp = Math.floor(res.daily.data[0].temperatureHigh);
  const dailyLowTemp = Math.floor(res.daily.data[0].temperatureLow);
  const dailySummary = res.daily.data[0].summary;
  $('.weather').append(`
    <div class="weather-metrics">
      <div class="weather-temps">
        <p class="weather-current">${currentTemp}${degrees}</p>
        <p class="weather-high">High:  ${dailyHighTemp}${degrees}</p>
        <p class="weather-low">Low:  ${dailyLowTemp}${degrees}</p>
      </div>
      <p class="weather-summary">${dailySummary}</p>
    </div>
  `);
}

app.getCoordinates = () => {
  navigator.geolocation.getCurrentPosition(function(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    app.getWeather(lat, lng);
  });
}

// NEWS APIc
app.newsApiKey = 'b66771502bb047dbb8d6dd42c9d0b1b1';

app.getNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: app.newsApiKey,
    country: 'ca',
    pageSize: 5
  }
});

app.getHackerNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: app.newsApiKey,
    sources: 'hacker-news',
    pageSize: 5
  }
});

$.when(app.getNews, app.getHackerNews)
  .then((res1, res2) => {
    // app.displayNewsResults(res1); // NEWS CURRENTLY DISABLED.
    // app.displayNewsResults(res2); // NEWS CURRENTLY DISABLED.
  })
  .fail((err1, err2) => {
    console.log(err1, err2);
  });



app.displayNewsResults = (res) => {
  const articles = res[0].articles
  articles.forEach((article) => {
    $(`#news`).append(`
      <div class="article">
        <h3>${article.title}</h3>
        <a href="${article.url}" target="_blank">${article.source.name}</a>
      </div>
    `);
  })
}

app.init = () => {
  app.getPhotos();
  app.getCoordinates();
}

$(() => {
  app.init();
})